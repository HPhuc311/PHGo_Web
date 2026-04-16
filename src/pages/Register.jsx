import { Form, Input, Button, Card, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { registerAPI } from '../services/authService'


const Register = () => {
    const navigate = useNavigate()

    const handleRegister = async (values) => {
        try {
            await registerAPI(values)

            message.success("Register successful! Check your email 📩")

            navigate('/login')

        } catch (err) {
            message.error(err.message || "Register failed")
        }
    }

    return (
        <Card title="Register" style={{ maxWidth: 500, margin: 'auto' }}>
            <Form layout="vertical" onFinish={handleRegister}>

                <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                        { required: true, message: "Full Name is required" },
                        { min: 2, max: 100, message: "Full name must be between 2 and 100 characters" },
                        {
                            pattern: /^[^\d]+$/,
                            message: "Full name must not contain numbers"
                        }
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
                        { required: true, message: "Phone number is required" },
                        {
                            pattern: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
                            message: "Invalid phone number"
                        }
                    ]}
                >
                    <Input
                        placeholder="Enter your phone number"
                        inputMode="numeric"
                        onKeyPress={(e) => {
                            // Chỉ cho nhập số và dấu +
                            if (!/[0-9+]/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        onChange={(e) => {
                            // Xử lý paste hoặc nhập sai
                            let value = e.target.value;

                            // Chỉ giữ số và dấu +
                            value = value.replace(/[^0-9+]/g, "");

                            // Không cho nhiều dấu +
                            if ((value.match(/\+/g) || []).length > 1) {
                                value = value.replace(/\+/g, "");
                            }

                            // + chỉ được ở đầu
                            if (value.includes("+") && !value.startsWith("+")) {
                                value = value.replace(/\+/g, "");
                            }

                            e.target.value = value;
                        }}
                    />
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