export const buildImageUrl = (path) => {
    if (!path) return ''

    // nếu là cloudinary
    if (path.startsWith('http')) return path

    return import.meta.env.VITE_API_URL + path
}