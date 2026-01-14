'use server'

import { prisma } from "../src/lib/db"
import { revalidatePath } from "next/cache"

// 1. 获取所有的文章
export async function getPosts() {
    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            _count: {
                select: { comments: true } // 查询评论数量
            }
        }
    })
    return posts
}

// 2. 创建新文章
export async function createPost(FormData: FormData) {
    const title = FormData.get('title') as string
    const content = FormData.get('content') as string
    const author = FormData.get('author') as string

    if (!title || !content || !author) {
        throw new Error("Missing required fields")
    }

    // 写入数据库
    await prisma.post.create({
        data: {
            title,
            content,
            author,
        },
    })
    revalidatePath('/')
}
