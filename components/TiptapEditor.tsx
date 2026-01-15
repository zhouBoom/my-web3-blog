'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, Heading1, Heading2 } from 'lucide-react'
import { Toggle } from "@/components/ui/toggle" // 如果没装: npx shadcn-ui@latest add toggle

// 定义组件属性：父组件传一个 onChange 回调来拿内容
interface EditorProps {
    content: string
    onChange: (richText: string) => void
}

const TiptapEditor = ({ content, onChange }: EditorProps) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Placeholder.configure({
                placeholder: '开始撰写你的精彩故事...',
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                // prose 是 tailwind-typography 的核心类，让文章自动变好看
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="border rounded-md">
            {/* 1. 工具栏 */}
            <div className="border-b bg-gray-50 p-2 flex gap-1 flex-wrap">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading1 className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Toggle>
            </div>

            {/* 2. 编辑区 */}
            <div className="min-h-[300px] p-4 bg-white">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default TiptapEditor