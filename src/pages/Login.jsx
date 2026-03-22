import { Form, Input, Button, Card, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAPI } from '../services/authService'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleLogin = async (values) => {
        try {
            const res = await loginAPI(values)

            if (res.token) {

                // ✅ QUAN TRỌNG: LƯU TOKEN ĐÚNG
                localStorage.setItem('user', JSON.stringify(res.user))
                localStorage.setItem('token', res.token) // ❗ không stringify

                // lưu vào context
                login({
                    ...res.user,
                    token: res.token
                })

                message.success('Login success 🎉')
                navigate('/')
            } else {
                message.error(res.message)
            }

        } catch (err) {
            console.error(err)
            message.error('Server error')
        }
    }

    return (
        <Card title="Login" style={{ maxWidth: 400, margin: 'auto' }} variant="outlined">
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

                <Button type="primary" htmlType="submit" block>
                    Login
                </Button>
            </Form>
        </Card>
    )
}

export default Login