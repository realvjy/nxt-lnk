import { BubbleMenu } from '@tiptap/react/menus'
import { Editor } from '@tiptap/core'
import { useState, useRef, useEffect } from 'react'

import {
    Bold, Italic, Underline, Strikethrough, Code,
    List, ListOrdered, Quote,
    AlignLeft, AlignCenter, AlignRight,
    Link as LinkIcon, ArrowRight, ChevronDown
} from 'lucide-react'

import { Button } from '@/components/ui/button'

interface EditorBubbleMenuProps {
    editor: Editor
}

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    if (!editor) return null

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isDropdownOpen])

    const handleDropdownToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleDropdownItemClick = (action: () => void) => {
        action()
        setIsDropdownOpen(false)
    }

    const getActiveTextType = () => {
        if (editor.isActive('heading', { level: 1 })) return 'H1'
        if (editor.isActive('heading', { level: 2 })) return 'H2'
        if (editor.isActive('heading', { level: 3 })) return 'H3'
        return '¶'
    }

    return (
        <BubbleMenu
            editor={editor}
            shouldShow={({ editor }) => !editor.state.selection.empty}
            className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 shadow-md"
        >
            {/* Custom Paragraph / Heading Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 flex items-center gap-1"
                    onMouseDown={handleDropdownToggle}
                >
                    <span className="text-sm font-medium">{getActiveTextType()}</span>
                    <ChevronDown className="h-3 w-3" />
                </Button>

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px]">
                        <div
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                            onMouseDown={(e) => {
                                e.preventDefault()
                                handleDropdownItemClick(() => {
                                    editor.chain().focus().setParagraph().run()
                                })
                            }}
                        >
                            Paragraph
                        </div>
                        <div
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer font-bold text-2xl"
                            onMouseDown={(e) => {
                                e.preventDefault()
                                handleDropdownItemClick(() => {
                                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                                })
                            }}
                        >
                            Heading 1
                        </div>
                        <div
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer font-bold text-xl"
                            onMouseDown={(e) => {
                                e.preventDefault()
                                handleDropdownItemClick(() => {
                                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                                })
                            }}
                        >
                            Heading 2
                        </div>
                        <div
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer font-bold text-lg"
                            onMouseDown={(e) => {
                                e.preventDefault()
                                handleDropdownItemClick(() => {
                                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                                })
                            }}
                        >
                            Heading 3
                        </div>
                    </div>
                )}
            </div>

            {/* Text style buttons */}
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBold().run()}
                variant={editor.isActive('bold') ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                variant={editor.isActive('italic') ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                variant={editor.isActive('underline') ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <Underline className="h-4 w-4" />
            </Button>
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                variant={editor.isActive('strike') ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleCode().run()}
                variant={editor.isActive('code') ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <Code className="h-4 w-4" />
            </Button>

            {/* Lists */}
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <Quote className="h-4 w-4" />
            </Button>

            {/* Alignment */}
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <AlignRight className="h-4 w-4" />
            </Button>

            {/* Link + Color (optional extension support needed) */}
            <Button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleLink({ href: 'https://example.com' }).run()}
                variant={editor.isActive('link') ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
                <ArrowRight className="h-4 w-4" />
            </Button>
        </BubbleMenu>
    )
}