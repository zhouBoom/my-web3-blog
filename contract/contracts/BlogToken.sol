// SPDX-License-Identifier: MIT
// 部署博客的代币
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlogToken is ERC20, Ownable {
    // 构造函数：设定名字和代号，并铸造初始供应量给部署者
    constructor() ERC20("BlogToken", "BLG") Ownable(msg.sender) {
        // 初始发行100w个代币，18位的精度
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // 增加mint，给自己增发
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
