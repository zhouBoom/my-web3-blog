// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// 打赏合约
contract BlogTipping {
    IERC20 public token;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    // 记录每篇文章收到了多少打赏 (文章ID -> 金额)
    mapping(uint256 => uint256) public postTips;

    // indexed代表事件中，这个字段会生成索引，方便查询
    event Tip(
        address indexed from,
        address indexed to,
        uint256 postId,
        uint256 amount
    );

    // 打赏功能,前端调用前，必须先调用 Token 的 approve 方法授权给这个合约
    function tipPost(uint256 _postId, address _author, uint256 _amount) public {
        require(_amount > 0, "Amount must be. > 0");
        require(token.balanceOf(msg.sender) >= _amount, "Not enough tokens");

        // 把币从 打赏者 转给 作者,因为这个钱不在合约里，在用户钱包里，所以需要approve
        bool success = token.transferFrom(msg.sender, _author, _amount);
        require(success, "Transfer failed");

        // 更新记录
        postTips[_postId] += _amount;

        // 调用事件
        emit Tip(msg.sender, _author, _postId, _amount);
    }
}
