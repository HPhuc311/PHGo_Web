import { Spin } from 'antd'
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined) // undefined = loading
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')

        if (storedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(storedUser))
        } else {
            setUser(null) // null = chưa login
        }
    }, [])

    if (user === undefined) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }}>
                <Spin size="large" />
            </div>
        )
    }

    const login = (data) => {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
    }

    const logout = () => {
        localStorage.removeItem('token')   // 🔥 QUAN TRỌNG
        localStorage.removeItem('user')    // 🔥 nên xoá luôn
        setUser(null)

        navigate('/login')
    }

    const updateProfile = (newData) => {
        const updated = { ...user, ...newData }
        setUser(updated)
        localStorage.setItem('user', JSON.stringify(updated))
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)