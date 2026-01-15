'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, Heading1, Heading2, Heading3, Quote, Code, Minus, Undo, Redo } from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"

interface EditorProps {
    content: string
    onChange: (richText: string) => void
}

const TiptapEditor = ({ content, onChange }: EditorProps) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
                heading: { levels: [1, 2, 3] }
            }),
            Placeholder.configure({ placeholder: '开始撰写你的精彩故事...' }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none max-w-none text-black',
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
            {/* 工具栏 */}
            <div className="border-b bg-gray-50 p-2 flex gap-1 flex-wrap items-center">
                <Toggle size="sm" pressed={editor.isActive('heading', { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                    <Heading2 className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm" pressed={editor.isActive('heading', { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                    <Heading3 className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
                    <Bold className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
                    <List className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote className="h-4 w-4" />
                </Toggle>

                <Toggle size="sm" pressed={editor.isActive('codeBlock')} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}>
                    <Code className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="px-2">
                    <Minus className="h-4 w-4" />
                </Button>

                <div className="ml-auto flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* 编辑区 */}
            <div className="min-h-[300px] p-4 bg-white text-black">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default TiptapEditor