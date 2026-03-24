export const buildImageUrl = (path) => {
    const BASE_URL = import.meta.env.VITE_API_URL

    if (!path) return null

    // nếu là link ngoài
    if (path.startsWith('http')) return path

    return `${BASE_URL}/${path.replace(/^\/+/, '')}`
}