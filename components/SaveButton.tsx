// components/SaveButton.tsx
'use client'

import { useBuilderStore } from '@/store/useBuilderStore'
import { Button } from '@/ui/button'

export default function SaveButton() {
    const layout = useBuilderStore((s) => s.layout)

    const handleSave = () => {
        localStorage.setItem('user:realvjy', JSON.stringify(layout))
        alert('Saved! Visit /realvjy')
    }

    return <Button onClick={handleSave}>💾 Save</Button>
}
