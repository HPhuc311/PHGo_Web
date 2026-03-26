import { Form, Input, Button, Card, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { registerAPI } from '../services/authService'


const Register = () => {
    const navigate = useNavigate()

    const handleRegister = async (values) => {
        try {
            const res = await registerAPI(values)

            if (res.message === 'Register success') {
                message.success('Register successful 🎉')

                // 👉 chuyển sang login
                navigate('/login')
            } else {
                message.error(res.message)
            }
        } catch {
            message.error('Server error')
        }
    }

    return (
        <Card title="Register" style={{ maxWidth: 500, margin: 'auto' }}>
            <Form layout="vertical" onFinish={handleRegister}>

                <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
 
                <Button type="primary" htmlType="submit" block>
                    Register
                </Button>
            </Form>
        </Card>
    )
}

export default Register