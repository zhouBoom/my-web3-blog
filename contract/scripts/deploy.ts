import { network } from "hardhat";

// const { ethers } = await network.connect({
//     network: "hardhatOp",
//     chainType: "op",
// });
async function main() {
    // 显式连接到 localhost，确保部署到持久化节点
    const { ethers } = await network.connect({
        network: "localhost",
    });
    const [deployer] = await ethers.getSigners();
    console.log("正在使用账户部署合约:", deployer.address);
    // 打印一下余额，确保deployer有钱
    const balance = await deployer.provider!.getBalance(deployer.address)
    console.log("账户余额:", ethers.formatEther(balance), "ETH");

    // =========================================================
    // 1. 部署 BlogToken (WBT)
    // TokenSwap 需要卖 BlogToken，所以必须先部署 BlogToken，还得给 TokenSwap 转币
    // =========================================================
    console.log("\n🚀 开始部署 BlogToken...");
    const blogToken = await ethers.deployContract("BlogToken");
    await blogToken.waitForDeployment();
    // 获取地址
    const blogTokenAddress = await blogToken.getAddress();
    console.log(`✅ BlogToken 部署成功! 地址: ${blogTokenAddress}`);

    // =========================================================
    // 2. 部署 TokenSwap (交易所)
    // =========================================================
    console.log("\n🚀 开始部署 TokenSwap...");
    // TokenSwap合约构造函数需要传入_tokenAddress代币地址，告诉它卖的是什么币
    const tokenSwap = await ethers.deployContract("TokenSwap", [blogTokenAddress]);
    await tokenSwap.waitForDeployment();
    const swapAddress = await tokenSwap.getAddress();
    console.log(`✅ TokenSwap 部署成功! 地址: ${swapAddress}`);

    // =========================================================
    // 3. 部署 BlogTipping (打赏合约)
    // =========================================================
    console.log("\n🚀 开始部署 BlogTipping...");
    const blogTipping = await ethers.deployContract("BlogTipping", [blogTokenAddress]);
    await blogTipping.waitForDeployment();
    const tippingAddress = await blogTipping.getAddress();
    console.log(`✅ blogTipping 部署成功! 地址: ${tippingAddress}`);

    // =========================================================
    // 4. 【关键一步】给交易所充值
    // =========================================================
    // 现在 WBT 都在 deployer 手里。
    // 为了让用户能从 TokenSwap 买到币，你必须把一部分币转给 TokenSwap 合约。
    console.log("\n🚚 正在向 TokenSwap 转入代币作为库存...");
    // 转入 50 万个币 (总发行量是 100 万)
    const transforAmount = ethers.parseUnits("500000", 18);
    const tx = await blogToken.transfer(swapAddress, transforAmount);
    await tx.wait(); //等待交易确认

    // 验证一下库存
    const swapBalance = await blogToken.balanceOf(swapAddress);
    console.log(`✅ 转账完成! TokenSwap 合约现在的库存: ${ethers.formatUnits(swapBalance, 18)} WBT`);

    console.log("\n=============================================");
    console.log("📋 部署汇总 (请复制保存到前端配置文件)");
    console.log("=============================================");
    console.log(`NEXT_PUBLIC_BLOG_TOKEN_ADDRESS="${blogTokenAddress}"`);
    console.log(`NEXT_PUBLIC_TOKEN_SWAP_ADDRESS="${swapAddress}"`);
    console.log(`NEXT_PUBLIC_BLOG_TIPPING_ADDRESS="${tippingAddress}"`);
    console.log("=============================================\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});