// components/SaveButton.tsx
'use client'

import { useLayoutStore } from '@/store/layoutStore'
import { Button } from '@/ui/button'

export default function SaveButton() {
    const layout = useLayoutStore((s) => s.layout)

    const handleSave = () => {
        localStorage.setItem('user:realvjy', JSON.stringify(layout))
        alert('Saved! Visit /realvjy')
    }

    return <Button onClick={handleSave}>💾 Save</Button>
}
