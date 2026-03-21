import { useEffect, useState } from 'react'
import { Card, Form, Input, Button, message } from 'antd'

const Profile = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const user = JSON.parse(localStorage.getItem('user'))

    // ================= GET PROFILE =================
    const fetchProfile = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/user/profile', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })

            const data = await res.json()

            form.setFieldsValue({
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address
            })

        } catch (err) {
            console.error(err)
            message.error('Không lấy được thông tin user')
        }
    }

    useEffect(() => {
        fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ================= UPDATE PROFILE =================
    const handleUpdate = async (values) => {
        setLoading(true)

        try {
            const res = await fetch('http://localhost:5000/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(values)
            })

            if (!res.ok) throw new Error()

            message.success('Cập nhật thành công 🎉')
        } catch (err) {
            console.log('err:', err)
            message.error('Cập nhật thất bại ❌')
        }

        setLoading(false)
    }

    return (
        <div style={{ maxWidth: 600, margin: '40px auto' }}>
            <Card title="My Profile">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdate}
                >
                    <Form.Item name="name" label="Name">
                        <Input />
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item name="phone" label="Phone">
                        <Input />
                    </Form.Item>

                    <Form.Item name="address" label="Address">
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Profile