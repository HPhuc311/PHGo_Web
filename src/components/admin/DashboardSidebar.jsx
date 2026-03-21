import { Menu } from 'antd'
import { useNavigate } from 'react-router-dom'

const DashboardSidebar = () => {
    const navigate = useNavigate()

    return (
        <Menu mode="inline" style={{ height: '100%' }}>
            <Menu.Item onClick={() => navigate('/profile')}>
                My Profile
            </Menu.Item>

            <Menu.Item onClick={() => navigate('/dashboard')}>
                Booking History
            </Menu.Item>

            <Menu.Item>
                Favorites (coming soon)
            </Menu.Item>
        </Menu>
    )
}

export default DashboardSidebar