import SettingsPanel from "@/components/settings/SettingsPanel"

export default function SettingsPage() {
    return (
        <main className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Settings</h1>
            <SettingsPanel />
        </main>
    )
}
