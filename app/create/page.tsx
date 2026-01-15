'use client'

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { createPost } from "@/app/action"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useRouter } from "next/navigation"

// 引入 UI 组件
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TiptapEditor from "@/components/TiptapEditor"

export default function CreatePage() {
    const { address, isConnected } = useAccount()
    const router = useRouter()

    // 状态管理
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [mounted, setMounted] = useState(false)

    // 防止 Hydration Error
    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    // 如果没连钱包，显示拦截页
    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold">请先连接钱包</h2>
                <p className="text-gray-500">你需要连接钱包来签署作者身份</p>
                <ConnectButton />
            </div>
        )
    }

    // 这里的 handleSubmit 是为了给 Server Action 包装一层，方便处理 Editor 的内容
    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        // 手动把 Editor 的 HTML 内容塞进 FormData
        formData.set('content', content)

        // 调用 Server Action
        await createPost(formData)
        setIsSubmitting(false)
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">发布新文章</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">

                        {/* 1. 标题 */}
                        <div className="space-y-2">
                            <Label>文章标题</Label>
                            <Input name="title" placeholder="输入引人入胜的标题..." required className="text-lg font-medium" />
                        </div>

                        {/* 2. 分类 */}
                        <div className="space-y-2">
                            <Label>选择分类</Label>
                            <Select name="category" defaultValue="Tech">
                                <SelectTrigger>
                                    <SelectValue placeholder="选择分类" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tech">💻 技术 (Tech)</SelectItem>
                                    <SelectItem value="Web3">🦄 Web3 & Crypto</SelectItem>
                                    <SelectItem value="Life">☕ 生活 (Life)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 3. 富文本编辑器 */}
                        <div className="space-y-2">
                            <Label>正文内容</Label>
                            <TiptapEditor content={content} onChange={setContent} />
                            {/* 隐藏输入框，用于确保表单提交时如果校验逻辑需要(可选) */}
                        </div>

                        {/* 4. 隐藏字段：作者地址 */}
                        <input type="hidden" name="author" value={address} />

                        {/* 5. 提交按钮 */}
                        <div className="pt-4">
                            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                {isSubmitting ? "正在发布..." : "发布文章 (Web2 上链)"}
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}