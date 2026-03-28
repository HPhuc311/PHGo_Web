import { Form, Input, Button, Card, message, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAPI } from '../services/authService'
import { useState } from 'react'
import fetchWithAuth from '../services/api'


const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [showForgot, setShowForgot] = useState(false)
    const [showReset, setShowReset] = useState(false)
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    // ================= LOGIN =================
    const handleLogin = async (values) => {
        setLoading(true)
        try {
            const res = await loginAPI(values)

            if (res?.token) {
                localStorage.setItem('user', JSON.stringify(res.user))
                localStorage.setItem('token', res.token)

                login({
                    ...res.user,
                    token: res.token
                })

                message.success('Login success 🎉')
                navigate('/')
            } else {
                message.error(res?.message || "Login failed")
            }

        } catch (err) {
            console.error(err)
            message.error('Server error')
        }
        setLoading(false)
    }

    // ================= SEND OTP =================
    const handleSendCode = async (values) => {
        try {
            const data = await fetchWithAuth('/api/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify(values)
            })

            if (data?.message?.toLowerCase().includes('error')) {
                throw new Error(data.message)
            }

            message.success("OTP sent to your email 📩")

            setEmail(values.email)
            setShowForgot(false)
            setShowReset(true)

        } catch (err) {
            console.error(err)
            message.error(err.message || "Send OTP failed ❌")
        }
    }

    // ================= RESET PASSWORD =================
    const handleReset = async (values) => {
        try {
            const data = await fetchWithAuth('/api/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    code: values.code,
                    newPassword: values.newPassword
                })
            })

            if (data?.message?.toLowerCase().includes('error')) {
                throw new Error(data.message)
            }

            message.success("Password updated ✅")
            setShowReset(false)

        } catch (err) {
            console.error(err)
            message.error(err.message || "Reset failed ❌")
        }
    }

    return (
        <Card title="Login" style={{ maxWidth: 400, margin: 'auto' }}>

            {/* ===== FORGOT MODAL ===== */}
            <Modal
                title="Forgot Password"
                open={showForgot}
                footer={null}
                onCancel={() => setShowForgot(false)}
            >
                <Form onFinish={handleSendCode} layout="vertical">

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Enter email' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Send Code
                    </Button>

                </Form>
            </Modal>

            {/* ===== RESET MODAL ===== */}
            <Modal
                title="Reset Password"
                open={showReset}
                footer={null}
                onCancel={() => setShowReset(false)}
            >
                <Form onFinish={handleReset} layout="vertical">

                    <Form.Item
                        name="code"
                        label="OTP Code"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[{ required: true }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Reset Password
                    </Button>

                </Form>
            </Modal>

            {/* ===== LOGIN FORM ===== */}
            <Form layout="vertical" onFinish={handleLogin}>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Please enter email' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please enter password' }]}
                >
                    <Input.Password />
                </Form.Item>

                <p
                    style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={() => setShowForgot(true)}
                >
                    Forgot Password?
                </p>

                <Button type="primary" htmlType="submit" block loading={loading}>
                    Login
                </Button>

            </Form>
        </Card>
    )
}

export default Login