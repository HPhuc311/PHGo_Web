import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Spin } from 'antd'

const AdminRoute = ({ children }) => {
    const { user } = useAuth()

    if (user === undefined) {
        return <Spin style={{ marginTop: '100px' }} />
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" />
    }

    return children
}

export default AdminRoute