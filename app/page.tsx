import { getPosts, createPost } from "./action";
import Link from "next/link";

export default async function Home() {
  // 1. 直接在服务端获取数据 (Database -> Server Component)
  // 因为是 Server Component，这里直接调数据库，速度极快
  const posts = await getPosts();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="space-y-2">
        {posts.map((post: any) => {
          // 简单的正则：去掉 HTML 标签，只取前 100 个字做摘要
          const summary = post.content.replace(/<[^>]+>/g, '').slice(0, 100) + '...'

          return (
            <Link href={`/blog/${post.id}`} key={post.id} className="block">
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:border-black transition">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                    {post.category}
                  </span>
                </div>

                <p className="text-gray-600 mt-2">{summary}</p>

                <span className="text-xs text-gray-500 mt-2">作者：{post.author}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  );
}