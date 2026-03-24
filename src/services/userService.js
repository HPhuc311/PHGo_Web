import axios from 'axios'
import API from './api'

const API_URL = import.meta.env.VITE_API_URL + '/api/user'

// 👉 lấy token
const getToken = () => localStorage.getItem('token')

// 👉 get profile
export const getProfile = async () => {
    const res = await axios.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
    return res.data
}

// 👉 update profile
export const updateProfile = async (data) => {
    const res = await axios.put(`${API_URL}/profile`, data, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
    return res.data
}

export const getAllUsers = () =>
    API('/api/user/all')