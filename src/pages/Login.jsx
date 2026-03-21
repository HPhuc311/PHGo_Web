import { Form, Input, Button, Card, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAPI } from '../services/authService'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    // const location = useLocation()
    // const from = location.state?.from?.pathname || '/'

    const handleLogin = async (values) => {
        try {
            const res = await loginAPI(values)

            if (res.token) {
                login({
                    ...res.user,
                    token: res.token
                })

                message.success('Login success 🎉')
                navigate('/')
            } else {
                message.error(res.message)
            }
        } catch {
            message.error('Server error')
        }
    }

    return (
        <Card title="Login" style={{ maxWidth: 400, margin: 'auto' }}>
            <Form layout="vertical" onFinish={handleLogin}>

                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    Login
                </Button>
            </Form>
        </Card>
    )
}

export default Login