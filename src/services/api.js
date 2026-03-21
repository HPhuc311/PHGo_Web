const BASE_URL = 'http://localhost:5000'

export const fetchWithAuth = async (url, options = {}) => {
    const user = JSON.parse(localStorage.getItem('user'))

    const token = user?.token

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : ''
    }

    const res = await fetch(BASE_URL + url, {
        ...options,
        headers
    })

    return res.json()
}