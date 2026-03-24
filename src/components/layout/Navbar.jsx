import { Avatar, Dropdown } from 'antd'
import { BellOutlined, DownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const API_URL = import.meta.env.VITE_API_URL

    const dropdownItems = [
        {
            key: 'profile',
            label: 'Profile',
            onClick: () => navigate('/profile'),
        },
        {
            key: 'logout',
            label: 'Logout',
            onClick: () => {
                logout()
                navigate('/')
            },
        },
    ]

    return (
        <div
            style={{
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 40px',
                background: '#f5f5f5',
                borderBottom: '1px solid #eee',
            }}
        >
            {/* LEFT - LOGO */}
            <div
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                <h2 style={{ color: '#406093', margin: 0 }}>PHGo</h2>
            </div>

            {/* CENTER - MENU */}
            <div style={{ display: 'flex', gap: '30px', fontWeight: 500 }}>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    Home
                </span>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/cars-list')}>
                    Cars
                </span>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/trips')}>
                    My Trips
                </span>
                {user?.role === 'admin' && (

                    <span onClick={() => navigate('/admin')}
                        style={{ cursor: 'pointer', fontWeight: 500 }}>
                        Dashboard
                    </span>
                )}
            </div>

            {/* RIGHT */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

                {/* Notification */}
                <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />

                {/* AUTH */}
                {!user ? (
                    <>
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </span>

                        <span
                            style={{ cursor: 'pointer', color: '#406093' }}
                            onClick={() => navigate('/register')}
                        >
                            Register
                        </span>
                    </>
                ) : (
                    <Dropdown menu={{ items: dropdownItems }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                            }}
                        >
                    
                                <Avatar src={user.avatar?.startsWith('http')
                                    ? user.avatar
                                    : `${API_URL}/${user.avatar}`}>
                                </Avatar>
                            <span>{user.name}</span>
                            <DownOutlined style={{ fontSize: '12px' }} />
                        </div>
                    </Dropdown>
                )}

            </div>
        </div>
    )
}

export default Navbar