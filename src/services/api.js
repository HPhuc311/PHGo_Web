const BASE_URL = 'http://localhost:5000'

export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token')

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : ''
    }

    const res = await fetch(BASE_URL + url, {
        ...options,
        headers
    })

    if (res.status === 401) {
        console.error('Unauthorized - please login again')
    }

    return res.json()
}

// ✅ THÊM DÒNG NÀY
export default fetchWithAuth