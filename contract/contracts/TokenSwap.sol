// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSwap is Ownable {
    IERC20 public token;
    uint256 public rate = 10000; // 汇率: 1 ETH = 10000 WBT
    // 代币购买事件，设置为event主要是为了方便查看
    event TokensPurchased(
        address buyer,
        uint256 amountOfETH,
        uint256 amountOfTokens
    );
    // 代币兑换Eth事件
    event TokensSwapped(
        address buyer,
        uint256 amountOfETH,
        uint256 amountOfTokens
    );

    /**
     * 初始化需要代币地址
     * @param _tokenAddress 代币地址
     */
    constructor(address _tokenAddress) Ownable(msg.sender) {
        // 获取代币合约
        token = IERC20(_tokenAddress);
    }

    /**
     * 购买代币
     * 不需要传入数量，直接根据发送的ETH(msg.value)计算
     */
    function buyTokens() public payable {
        require(msg.value > 0, "You must send some ETH");

        // 计算应得代币数量: ETH数量 * 汇率
        uint256 tokenAmount = msg.value * rate;

        // 检查代币余额
        require(
            token.balanceOf(address(this)) >= tokenAmount,
            "Not enough tokens in the contract"
        );

        // 转移代币给买币人
        token.transfer(msg.sender, tokenAmount);

        // 触发代币购买事件 (记录的是 msg.value)
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    /**
     * 使用代币兑换ETH (卖币)
     * @param tokenAmount 代币数量
     */
    function buyEths(uint256 tokenAmount) public {
        require(tokenAmount > 0, "Amount must be > 0");
        uint256 ethAmount = tokenAmount / rate;

        require(
            address(this).balance >= ethAmount,
            "Contract has insufficient ETH"
        );
        require(
            token.balanceOf(msg.sender) >= tokenAmount,
            "Not enough tokens"
        );

        // 1. 先把用户的Token拿过来
        token.transferFrom(msg.sender, address(this), tokenAmount);

        // 2. 再把ETH发给用户 (使用call防范Gas限制问题)
        (bool success, ) = payable(msg.sender).call{value: ethAmount}("");
        require(success, "ETH transfer failed");

        emit TokensSwapped(msg.sender, ethAmount, tokenAmount);
    }

    /**
     * 提取ETH
     */
    function withdraw() public onlyOwner {
        // 使用call代替transfer
        (bool success, ) = payable(owner()).call{value: address(this).balance}(
            ""
        );
        require(success, "Transfer failed");
    }

    // 取回没卖完的 WBT
    function withdrawTokens() public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(owner(), balance);
    }
}
