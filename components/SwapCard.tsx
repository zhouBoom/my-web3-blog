'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowDown, Loader2, RefreshCw } from 'lucide-react';
import { TOKEN_SWAP_ABI, BLOG_TOKEN_ADDRESS, BLOG_TOKEN_ABI } from '@/lib/contracts';

// 假设我们之前忘了在 contracts.ts 导出 TOKEN_SWAP_ADDRESS，这里需要手动加一下或者稍后补上
// 暂时我们假设它是 process.env.NEXT_PUBLIC_TOKEN_SWAP_ADDRESS
const TOKEN_SWAP_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_SWAP_ADDRESS as `0x${string}`;

export function SwapCard() {
    const { address, isConnected } = useAccount();
    const [ethAmount, setEthAmount] = useState('');
    const [rate, setRate] = useState<bigint>(BigInt(10000)); // 默认汇率 1 ETH = 10000 WBT

    // 1. 读取汇率 rate
    const { data: currentRate } = useReadContract({
        address: TOKEN_SWAP_ADDRESS,
        abi: TOKEN_SWAP_ABI,
        functionName: 'rate',
    });

    // 2. 读取用户余额
    const { data: ethBalance } = useBalance({ address });
    const { data: blgBalance, refetch: refetchBlg } = useReadContract({
        address: BLOG_TOKEN_ADDRESS,
        abi: BLOG_TOKEN_ABI,
        functionName: 'balanceOf',
        args: [address!],
        query: { enabled: isConnected }
    });

    // 更新汇率状态
    useEffect(() => {
        if (currentRate) setRate(currentRate);
    }, [currentRate]);

    const { writeContractAsync, isPending } = useWriteContract();

    // 3. 购买代币 (ETH -> BLG)
    const handleBuy = async () => {
        if (!ethAmount) return;
        try {
            await writeContractAsync({
                address: TOKEN_SWAP_ADDRESS,
                abi: TOKEN_SWAP_ABI,
                functionName: 'buyTokens',
                value: parseEther(ethAmount),
            });
            // 简单等待两秒刷新余额
            setTimeout(() => refetchBlg(), 2000);
            setEthAmount('');
        } catch (error) {
            console.error("Swap failed:", error);
        }
    };

    // 计算预估获得
    const estimatedTokens = ethAmount ? Number(ethAmount) * Number(rate) : 0;

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>代币兑换</span>
                    <RefreshCw className="h-4 w-4 text-gray-400 cursor-pointer hover:rotate-180 transition" onClick={() => refetchBlg()} />
                </CardTitle>
                <CardDescription>
                    当前汇率: 1 ETH = {rate.toString()} WBT
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* ETH 输入框 */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>支付 (ETH)</span>
                        <span>余额: {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0'}</span>
                    </div>
                    <Input
                        type="number"
                        placeholder="0.0"
                        value={ethAmount}
                        onChange={(e) => setEthAmount(e.target.value)}
                        className="text-lg font-mono bg-gray-50"
                    />
                </div>

                <div className="flex justify-center text-gray-400">
                    <ArrowDown size={24} />
                </div>

                {/* BLG 预估输出 */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>获得 (WBT)</span>
                        <span>余额: {blgBalance ? formatEther(blgBalance) : '0'}</span>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-md font-mono text-lg text-gray-700">
                        {estimatedTokens > 0 ? estimatedTokens.toFixed(2) : '0.00'}
                    </div>
                </div>

                <div className="pt-4">
                    {!isConnected ? (
                        <div className="w-full flex justify-center">
                            <ConnectButton />
                        </div>
                    ) : (
                        <Button
                            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                            onClick={handleBuy}
                            disabled={isPending || !ethAmount || Number(ethAmount) <= 0}
                        >
                            {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                            {isPending ? "兑换中..." : "立即兑换"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
