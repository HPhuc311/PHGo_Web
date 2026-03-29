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

                <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                        { required: true, message: "Name is required" },
                        { min: 2, message: "Name must be at least 2 characters" }
                    ]}
                >
                    <Input placeholder="Enter your name" />
                </Form.Item>

                {/* EMAIL */}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Email is required" },
                        { type: "email", message: "Invalid email format" }
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>

                {/* PHONE */}
                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                        { required: true, message: "Phone is required" },
                        {
                            pattern: /^(0|\+84)[0-9]{9}$/,
                            message: "Invalid Vietnamese phone number"
                        }
                    ]}
                >
                    <Input placeholder="Enter your phone" />
                </Form.Item>

                {/* PASSWORD */}
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: "Password is required" },
                        { min: 8, message: "Minimum 8 characters" },
                        {
                            pattern: /^(?=.*[A-Z])(?=.*\d).+$/,
                            message: "Must include uppercase letter and number"
                        }
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>

                {/* CONFIRM PASSWORD */}
                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: "Please confirm password" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject("Passwords do not match ❌")
                            }
                        })
                    ]}
                >
                    <Input.Password placeholder="Confirm password" />
                </Form.Item>

                {/* SUBMIT */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Register
                    </Button>
                </Form.Item>

            </Form>
        </Card>
    )
}

export default Register