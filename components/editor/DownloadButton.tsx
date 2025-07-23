import { Button } from '@/ui/button'
import { Download } from 'lucide-react'
import { useUserStore, useLayoutStore, usePersistenceStore } from '@/store/index'
import { generateHtml, downloadHtml } from '@/lib/htmlGenerator'

export default function DownloadButton() {
    const username = useUserStore((s) => s.username)
    const layout = useLayoutStore((s) => s.layout)
    const saveToStorage = usePersistenceStore((s) => s.saveToStorage)

    const handleDownload = () => {
        if (!username) {
            alert("Username is required to download HTML")
            return
        }

        // Save current state before downloading
        saveToStorage()

        // Generate HTML content
        const htmlContent = generateHtml(username, layout)

        // Trigger download
        downloadHtml(username, htmlContent)
    }

    return (
        <Button
            onClick={handleDownload}
            variant="outline"
            className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1"
        >
            <Download size={16} />
            <span>Download HTML</span>
        </Button>
    )
}
