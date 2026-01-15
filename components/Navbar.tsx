// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button"; // 使用 shadcn 的 Button
import { PenSquare, Coins } from "lucide-react"; // 图标

export function Navbar() {
    return (
        <nav className="border-b bg-white">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* 1. Logo */}
                <Link href="/" className="text-xl font-bold flex items-center gap-2">
                    <span>🦄</span> Web3 Blog
                </Link>

                {/* 2. 中间导航 */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                    <Link href="/" className="hover:text-black transition">首页</Link>
                    <Link href="/swap" className="flex items-center gap-1 hover:text-black transition">
                        <Coins size={16} /> 兑换代币
                    </Link>
                </div>

                {/* 3. 右侧功能区 */}
                <div className="flex items-center gap-4">
                    <Link href="/create">
                        <Button variant="ghost" className="gap-2">
                            <PenSquare size={16} />
                            写文章
                        </Button>
                    </Link>

                    {/* 钱包连接按钮 */}
                    <ConnectButton showBalance={false} />
                </div>
            </div>
        </nav>
    );
}