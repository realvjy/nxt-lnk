
export async function getUserLayout(username: string) {
    // This will only work in the browser during development
    if (typeof window === 'undefined') {
        return null
    }

    const raw = localStorage.getItem(`user:${username}`)
    return raw ? JSON.parse(raw) : null
}
