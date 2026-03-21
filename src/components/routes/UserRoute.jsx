import { useAuth } from '../../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { notification, Spin } from 'antd'
import { useEffect } from 'react'

const UserRoute = ({ children }) => {
    const { user } = useAuth()
    const location = useLocation()

    useEffect(() => {
        if (user === null) {
            notification.warning({
                message: 'Login Required',
                description: 'Please login to access this feature'
            })
        }
    }, [user])

    if (user === undefined) {
        return <Spin style={{ marginTop: '100px' }} />
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />
    }

    return children
}

export default UserRoute