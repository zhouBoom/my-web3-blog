// src/app/providers.tsx
'use client'; // 必须标记为客户端组件

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultConfig,
    lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import '@rainbow-me/rainbowkit/styles.css';

// 1. 配置 Wagmi
const config = getDefaultConfig({
    appName: 'Web3 Blog',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
    chains: [hardhat], // 这里只启用了 hardhat 本地链
    ssr: true, // 开启服务端渲染支持
});

// 2. 配置 React Query
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={lightTheme()} coolMode>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}