import { useLayoutStore } from '@/store/layoutStore'
import { BioBlockType } from '@/shared/blocks'
import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Blockquote from '@tiptap/extension-blockquote'
import { useEffect } from 'react'
import { Button } from '@/ui/button'
import { Bold as BoldIcon, Italic as ItalicIcon, List, ListOrdered, Quote } from 'lucide-react'
import EditorBubbleMenu from '@/components/editor/BubbleMenu'

export default function BioBlock({ block, isEdit }: { block: BioBlockType; isEdit?: boolean }) {
    const updateBlock = useLayoutStore((s) => s.updateBlock)

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Bold,
            Italic,
            BulletList,
            OrderedList,
            ListItem,
            Underline,
            Heading,
            Strike,
            Code,
            TextAlign,
            Link,
            Blockquote,
        ],
        content: block.props.text,
        editable: isEdit,
        immediatelyRender: false, // Fix for SSR hydration issues
        onUpdate: ({ editor }) => {
            if (isEdit) {
                updateBlock(block.id, {
                    ...block,
                    props: {
                        ...block.props,
                        text: editor.getHTML()
                    }
                })
            }
        },
    })

    // Update editor content when block content changes
    useEffect(() => {
        if (editor && editor.getHTML() !== block.props.text) {
            editor.commands.setContent(block.props.text)
        }
    }, [block.props.text, editor])

    if (isEdit) {
        return (
            <div className="tiptap-editor">
                {editor && <EditorBubbleMenu editor={editor} />}

                <EditorContent
                    editor={editor}
                    className="text-lg text-gray-600 w-full min-h-[100px] p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        )
    }

    return (
        <div
            className="text-lg text-gray-600 bio-content"
            dangerouslySetInnerHTML={{ __html: block.props.text }}
        />
    )
}
