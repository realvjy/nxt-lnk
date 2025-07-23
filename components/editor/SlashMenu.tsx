'use client'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useBuilderStore } from '@/store/useBuilderStore'
import { Block } from '@/shared/blocks'

type BlockType = 'name' | 'bio' | 'link'

export default function SlashMenu() {
    const addBlock = useBuilderStore((s) => s.addBlock)
    const [visible, setVisible] = useState(false)
    const [step, setStep] = useState<'select' | 'input'>('select')
    const [selectedType, setSelectedType] = useState<BlockType | null>(null)
    const [formData, setFormData] = useState({ text: '', label: '', url: '' })

    const handleInsert = () => {
        if (!selectedType) return
        const textCopy = formData.text
        const labelCopy = formData.label
        const urlCopy = formData.url

        const blockMap: Record<BlockType, Block> = {
            name: { id: nanoid(), type: 'name', props: { text: textCopy } },
            bio: { id: nanoid(), type: 'bio', props: { text: textCopy } },
            link: { id: nanoid(), type: 'link', props: { label: labelCopy, url: urlCopy } },
        }


        addBlock(blockMap[selectedType])
        setFormData({ text: '', label: '', url: '' })
        setSelectedType(null)
        setStep('select')
        setVisible(false)
    }

    return (
        <div>
            <input
                placeholder="Type / to insert"
                className="w-full border rounded px-3 py-2 mb-4"
                onKeyDown={(e) => {
                    if (e.key === '/') {
                        e.preventDefault()
                        setVisible(true)
                    }
                }}
            />

            {visible && (
                <div className="bg-white border rounded shadow w-full max-w-sm p-4 space-y-2">
                    {step === 'select' && (
                        <>
                            <button onClick={() => { setSelectedType('name'); setStep('input'); }}>➕ Add Name</button>
                            <button onClick={() => { setSelectedType('bio'); setStep('input'); }}>➕ Add Bio</button>
                            <button onClick={() => { setSelectedType('link'); setStep('input'); }}>➕ Add Link</button>
                        </>
                    )}

                    {step === 'input' && selectedType && (
                        <>
                            {selectedType !== 'link' ? (
                                <input
                                    placeholder="Enter text"
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            ) : (
                                <>
                                    <input
                                        placeholder="Label"
                                        value={formData.label}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                        className="w-full border rounded px-3 py-2 mb-2"
                                    />
                                    <input
                                        placeholder="URL"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </>
                            )}
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => setStep('select')} className="text-sm text-gray-500">← Back</button>
                                <button onClick={handleInsert} className="ml-auto text-sm text-blue-600">Insert</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
