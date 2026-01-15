'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BLOG_TOKEN_ADDRESS, BLOG_TIPPING_ADDRESS, BLOG_TOKEN_ABI, BLOG_TIPPING_ABI } from '@/lib/contracts';
import { Loader2, Coins } from 'lucide-react';

export function TipCard({ postId, authorAddress }: { postId: number; authorAddress: string }) {
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState('10'); // 默认打赏 10 个

    // 1. 读取数据
    // A. 查询用户对打赏合约的授权额度
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: BLOG_TOKEN_ADDRESS,
        abi: BLOG_TOKEN_ABI,
        functionName: 'allowance',
        args: [address!, BLOG_TIPPING_ADDRESS],
        query: { enabled: isConnected } // 只有连钱包了才查
    });

    // B. 查询这篇文章目前收到的总打赏
    const { data: totalTips } = useReadContract({
        address: BLOG_TIPPING_ADDRESS,
        abi: BLOG_TIPPING_ABI,
        functionName: 'postTips',
        args: [BigInt(postId)],
    });

    // 2. 写入操作 (Approve & Tip)
    const { writeContractAsync, isPending } = useWriteContract();

    // 处理打赏流程
    const handleAction = async () => {
        try {
            const tipAmount = parseUnits(amount, 18); // 假设是 18 位精度

            // 判断逻辑：如果授权额度 < 打算打赏的金额，先执行授权
            if (!allowance || allowance < tipAmount) {
                // Step 1: Approve
                const hash = await writeContractAsync({
                    address: BLOG_TOKEN_ADDRESS,
                    abi: BLOG_TOKEN_ABI,
                    functionName: 'approve',
                    args: [BLOG_TIPPING_ADDRESS, tipAmount], // 刚好授权这么多，或者授权无限大
                });
                console.log("Approve Tx:", hash);
                // 这里为了简化，我们暂时不等待 Approve 上链确认，实际项目中应该用 useWaitForTransactionReceipt 等待
                // 但因为 Wagmi 状态更新很快，我们简单处理：让用户再点一次按钮进行打赏
            } else {
                // Step 2: Tip
                const hash = await writeContractAsync({
                    address: BLOG_TIPPING_ADDRESS,
                    abi: BLOG_TIPPING_ABI,
                    functionName: 'tipPost',
                    args: [BigInt(postId), authorAddress as `0x${string}`, tipAmount],
                });
                console.log("Tip Tx:", hash);
            }
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("交易失败，请检查控制台或拒绝原因");
        }
    };

    // 计算当前应该显示什么按钮文本
    const tipAmountBN = parseUnits(amount || '0', 18);
    const isNeedsApprove = allowance ? allowance < tipAmountBN : true;

    return (
        <Card className="border-yellow-200 bg-yellow-50/50">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-yellow-800">
                    <Coins className="h-5 w-5" />
                    支持作者
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* 展示总打赏数 */}
                    <div className="text-sm text-gray-600">
                        这篇文章已获得 <span className="font-bold text-yellow-700">{totalTips ? formatUnits(totalTips, 18) : '0'}</span> WBT 打赏
                    </div>

                    {!isConnected ? (
                        <ConnectButton />
                    ) : (
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-white"
                                placeholder="数量"
                            />
                            <Button
                                onClick={handleAction}
                                disabled={isPending || !amount}
                                className="min-w-[120px] bg-yellow-600 hover:bg-yellow-700 text-white"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : isNeedsApprove ? (
                                    "先授权 WBT"
                                ) : (
                                    "打赏"
                                )}
                            </Button>
                        </div>
                    )}

                    <p className="text-xs text-gray-400">
                        * 第一次打赏需要先进行代币授权 (Approve)
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}