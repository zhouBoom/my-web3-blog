import { getPosts, createPost } from "./action";

export default async function Home() {
  // 1. 直接在服务端获取数据 (Database -> Server Component)
  // 因为是 Server Component，这里直接调数据库，速度极快
  const posts = await getPosts();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* 左侧：文章列表 (占 2 列) */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Web3 Blog 📝</h1>

          {posts.length === 0 ? (
            <p className="text-gray-500">暂时没有文章，快来发布第一篇吧！</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
                <p className="text-gray-600 mt-2 line-clamp-3">{post.content}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                  <span>作者: {post.author.slice(0, 6)}...{post.author.slice(-4)}</span>
                  <span>{post.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 右侧：发文表单 (占 1 列) */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-8">
            <h3 className="text-lg font-bold mb-4">发布新文章</h3>

            {/* 使用 Server Action 的表单 */}
            <form action={createPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">标题</label>
                <input
                  name="title"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">内容</label>
                <textarea
                  name="content"
                  rows={4}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* 临时字段：模拟钱包地址 (下一阶段我们会自动获取) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">模拟钱包地址</label>
                <input
                  name="author"
                  type="text"
                  defaultValue="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" // Hardhat 第一个账户
                  className="mt-1 block w-full bg-gray-100 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
              >
                发布到 Web2 数据库
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}