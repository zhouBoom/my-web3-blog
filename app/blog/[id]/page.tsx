import { prisma } from "@/src/lib/db";
import { notFound } from "next/navigation";
import { TipCard } from "@/components/TipCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // 可选，如果没装就用普通 div

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    // 异步解析 params (Next.js 15+ 变更: params 现在是 Promise)
    const { id } = await params;

    // 1. 从数据库获取文章
    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(id),
        },
    });

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* 顶部 Banner 区 */}
            <div className="bg-gray-50 border-b py-12">
                <div className="container mx-auto px-4 max-w-3xl space-y-4">
                    {/* 分类标签 */}
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {post.category}
                    </span>

                    {/* 标题 */}
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        {post.title}
                    </h1>

                    {/* 作者信息 */}
                    <div className="flex items-center gap-3 pt-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-400 to-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {post.author.slice(0, 6)}...{post.author.slice(-4)}
                            </p>
                            <p className="text-sm text-gray-500">
                                发布于 {post.createdAt.toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 正文内容区 */}
            <div className="container mx-auto px-4 max-w-3xl py-10">
                <article className="prose prose-lg prose-slate max-w-none">
                    {/* ⚠️ 渲染富文本 HTML */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                <hr className="my-10 border-gray-100" />

                {/* Web3 打赏区域 */}
                <div className="max-w-md">
                    <TipCard postId={post.id} authorAddress={post.author} />
                </div>
            </div>
        </main>
    );
}