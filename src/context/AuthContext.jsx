import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined) // undefined = loading

    useEffect(() => {
        const storedUser = localStorage.getItem('user')

        if (storedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(storedUser))
        } else {
            setUser(null) // null = chưa login
        }
    }, [])

    const login = (data) => {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    const updateProfile = (newData) => {
        const updated = { ...user, ...newData }
        setUser(updated)
        localStorage.setItem('user', JSON.stringify(updated))
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)