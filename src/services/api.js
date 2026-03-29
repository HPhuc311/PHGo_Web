const BASE_URL = import.meta.env.VITE_API_URL

export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token')

    const headers = {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : ''
    }

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(BASE_URL + url, {
        ...options,
        headers
    })

    const data = await res.json()

    // 🔥 QUAN TRỌNG
    if (!res.ok) {
        throw new Error(data.message || "Request failed")
    }

    return data
}

export default fetchWithAuth