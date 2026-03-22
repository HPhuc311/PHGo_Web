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

    const data = await res.json()

    return data
}

export default fetchWithAuth