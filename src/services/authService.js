const API_URL = import.meta.env.VITE_API_URL + '/api/auth'

export const registerAPI = async (data) => {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    return res.json()
}

export const loginAPI = async (data) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    return res.json()
}

export const changePasswordAPI = async (data) => {
    const res = await fetch(`${API_URL}/change-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    })

    return res.json()
}