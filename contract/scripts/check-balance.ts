import { network } from "hardhat";

const BLOG_TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const TOKEN_SWAP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const TEST_BUYER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

async function main() {
    // 显式连接到 localhost，确保 ethers 插件加载
    const { ethers } = await network.connect({
        network: "localhost",
    });

    console.log("🔍 开始核查链上状态...");

    // 1. 获取合约实例
    const blogToken = await ethers.getContractAt("BlogToken", BLOG_TOKEN_ADDRESS);
    const tokenSwap = await ethers.getContractAt("TokenSwap", TOKEN_SWAP_ADDRESS);

    // 2. 查 Token 信息
    const symbol = await blogToken.symbol();
    const decimals = await blogToken.decimals();
    console.log(`\n🎫 代币信息: ${symbol} (精度: ${decimals})`);

    // 3. 查 Deployer (Account #0) 余额
    const [deployer] = await ethers.getSigners();
    const balDeployer = await blogToken.balanceOf(deployer.address);
    console.log(`👤 Deployer (${deployer.address}) 余额: ${ethers.formatUnits(balDeployer, decimals)}`);

    // 4. 查 TokenSwap 库存
    const balSwap = await blogToken.balanceOf(TOKEN_SWAP_ADDRESS);
    console.log(`🏦 TokenSwap 合约 (${TOKEN_SWAP_ADDRESS}) 库存: ${ethers.formatUnits(balSwap, decimals)}`);

    // 5. 查 TokenSwap 的 Owner 和关联 Token
    const swapOwner = await tokenSwap.owner();
    const swapToken = await tokenSwap.token();
    console.log(`   - Swap Owner: ${swapOwner}`);
    console.log(`   - Swap 绑定的 Token 地址: ${swapToken}`);
    if (swapToken.toLowerCase() !== BLOG_TOKEN_ADDRESS.toLowerCase()) {
        console.error("❌ 严重错误: Swap绑定的Token地址与BlogToken不一致！");
    }

    // 6. 模拟一笔交易看看 (Dry Run)
    // 尝试调用 buyTokens 估算一下 Gas，看会不会报错
    console.log("\n🧪 模拟 buyTokens...");
    try {
        // 用 deployer 模拟买 0.01 ETH
        // 注意：这只是 callStatic，不实际上链，只看结果
        await tokenSwap.buyTokens.staticCall({ value: ethers.parseEther("0.01") });
        console.log("✅ 模拟交易成功！说明合约逻辑正常。");
    } catch (e: any) {
        console.error("❌ 模拟交易失败！原因:", e.message || e);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
