// src/lib/contracts.ts
import { parseAbi } from 'viem';

// 1. 获取环境变量中的地址
export const BLOG_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_BLOG_TOKEN_ADDRESS as `0x${string}`;
export const BLOG_TIPPING_ADDRESS = process.env.NEXT_PUBLIC_BLOG_TIPPING_ADDRESS as `0x${string}`;

// 2. 定义合约接口 (只定义我们要用的函数)
export const BLOG_TOKEN_ABI = parseAbi([
    // ERC20 标准方法
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function balanceOf(address account) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
]);

export const BLOG_TIPPING_ABI = parseAbi([
    // 我们写的打赏方法
    'function tipPost(uint256 _postId, address _author, uint256 _amount)',
    // 查询某篇文章收到了多少打赏
    'function postTips(uint256) view returns (uint256)',
    // 事件
    'event Tip(address indexed from, address indexed to, uint256 postId, uint256 amount)'
]);

export const TOKEN_SWAP_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_SWAP_ADDRESS as `0x${string}`;

export const TOKEN_SWAP_ABI = parseAbi([
    'function buyTokens() payable',
    'function rate() view returns (uint256)',
    // 如果之后需要反向兑换 (BLG -> ETH)
    'function sellTokens(uint256 amount)'
]);