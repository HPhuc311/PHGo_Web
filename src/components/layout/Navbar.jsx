import { Avatar, Badge, Button, Dropdown, message } from 'antd'
import { BellOutlined, DownOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { buildImageUrl } from '../../utils/image'
import { useNotification } from '../../context/NotificationContext'


const Navbar = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const { notifications } = useNotification()
    const location = useLocation()
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

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code)
        message.success("Copied to clipboard 🎉")
    }

    const items = notifications.map(n => ({
        key: n.id,
        label: (
            <div style={{ minWidth: 220 }}>
                <b>{n.title}</b>

                <div style={{ fontSize: 12, margin: "5px 0" }}>
                    {n.message}
                </div>

                {/* 👉 HIỂN THỊ CODE */}
                {n.code && (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 5,
                        background: "#f0f5ff",
                        padding: "5px 8px",
                        borderRadius: 6
                    }}>
                        <b style={{ color: "#406093" }}>{n.code}</b>

                        <Button
                            size="small"
                            onClick={() => handleCopy(n.code)}
                        >
                            Copy
                        </Button>
                    </div>
                )}
            </div>
        )
    }))

    const isActive = (path) => location.pathname === path


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
                <span
                    onClick={() => navigate('/')}
                    style={{
                        cursor: 'pointer',
                        color: isActive('/') ? '#1677ff' : '#333',
                        borderBottom: isActive('/') ? '2px solid #1677ff' : 'none',
                        paddingBottom: 4,
                        transition: 'all 0.2s'
                    }}
                >
                    Home
                </span>
                <span
                    onClick={() => navigate('/cars-list')}
                    style={{
                        cursor: 'pointer',
                        color: isActive('/cars-list') ? '#1677ff' : '#333',
                        borderBottom: isActive('/cars-list') ? '2px solid #1677ff' : 'none',
                        paddingBottom: 4
                    }}
                >
                    Cars
                </span>
                <span
                    onClick={() => navigate('/trips')}
                    style={{
                        cursor: 'pointer',
                        color: isActive('/trips') ? '#1677ff' : '#333',
                        borderBottom: isActive('/trips') ? '2px solid #1677ff' : 'none',
                        paddingBottom: 4
                    }}
                >
                    My Trips
                </span>
                {user?.role === 'admin' && (

                    <span
                        onClick={() => navigate('/admin')}
                        style={{
                            cursor: 'pointer',
                            color: isActive('/admin') ? '#1677ff' : '#333',
                            borderBottom: isActive('/admin') ? '2px solid #1677ff' : 'none',
                            paddingBottom: 4
                        }}
                    >
                        Cars
                    </span>
                )}
            </div>

            {/* RIGHT */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

                {/* Notification */}
                <Dropdown menu={{ items }} placement="bottomRight">
                    <Badge count={notifications.length}>
                        <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
                    </Badge>
                </Dropdown>

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
                    
                            <Avatar src={buildImageUrl(user.avatar)} />
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