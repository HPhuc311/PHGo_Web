import { useEffect, useState, useRef } from 'react'
import { Card, Form, Input, Button, message } from 'antd'
import { useAuth } from '../context/AuthContext'
import { EditOutlined } from '@ant-design/icons'
import fetchWithAuth from '../services/api'


const Profile = () => {
    const [form] = Form.useForm()
    const { user, updateProfile } = useAuth()

    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    const [preview, setPreview] = useState(null)
    const [file, setFile] = useState(null)

    const fileInputRef = useRef()

    useEffect(() => {
        if (!user) return

        const fetchProfile = async () => {
            try {
                const data = await fetchWithAuth('/api/user/profile')

                form.setFieldsValue({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address
                })
            } catch (err) {
                console.error(err)
                message.error('Failed to fetch user data')
            }
        }

        fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    if (!user) return <div>Please login</div>

    const avatarUrl =
        preview ||
        (user.avatar?.startsWith('http')
            ? user.avatar
            : `${import.meta.env.VITE_API_URL}/${user.avatar}`)

    // Click avatar to open file picker
    const handleAvatarClick = () => {
        if (!editing) return
        fileInputRef.current.click()
    }

    const handleSelectFile = (e) => {
        const selected = e.target.files[0]
        if (!selected) return

        setFile(selected)
        setPreview(URL.createObjectURL(selected))
    }

    const handleUploadAvatar = async () => {
        if (!file) return message.warning('Please select an image first')

        const formData = new FormData()
        formData.append('avatar', file)

        try {
            const res = await fetchWithAuth('/api/user/avatar', {
                method: 'PUT',
                body: formData
            })

            const data = await res.json()

            updateProfile({ avatar: data.avatar })
            message.success('Avatar uploaded successfully')

            setFile(null)
            setPreview(null)
        } catch {
            message.error('Upload failed')
        }
    }

    const handleUpdate = async (values) => {
        setLoading(true)

        try {
            const res = await fetchWithAuth('/api/user/update', {
                method: 'PUT',
                body: JSON.stringify(values)
            })

            const data = await res.json()
            updateProfile(data.user)

            message.success('Profile updated successfully')
            setEditing(false)
        } catch {
            message.error('Update failed')
        }

        setLoading(false)
    }

    return (
        <div style={{ display: 'flex', gap: 30, padding: 40 }}>

            {/* SIDEBAR */}
            <div style={{ width: 250 }}>
                <h2>Hello!</h2>

                <div style={{ marginTop: 20, lineHeight: '40px' }}>
                    <div>👤 My Account</div>
                    <div>❤️ Favorite Cars</div>
                    <div>🧾 My Trips</div>
                    <div>🔒 Change Password</div>
                </div>
            </div>

            {/* MAIN */}
            <div style={{ flex: 1 }}>
                <Card
                    title="Account Information"
                    extra={
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => setEditing(!editing)}
                        >
                            {editing ? 'Cancel' : 'Edit'}
                        </Button>
                    }
                >

                    {/* AVATAR */}
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <img
                            src={avatarUrl}
                            alt="avatar"
                            onClick={handleAvatarClick}
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                cursor: editing ? 'pointer' : 'default'
                            }}
                        />

                        {/* hidden input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleSelectFile}
                        />

                        {editing && file && (
                            <div style={{ marginTop: 10 }}>
                                <Button onClick={handleUploadAvatar}>
                                    Upload Avatar
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* FORM */}
                    <Form form={form} layout="vertical" onFinish={handleUpdate}>
                        <Form.Item name="name" label="Full Name">
                            <Input disabled={!editing} />
                        </Form.Item>

                        <Form.Item name="email" label="Email">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item name="phone" label="Phone Number">
                            <Input disabled={!editing} />
                        </Form.Item>

                        <Form.Item name="address" label="Address">
                            <Input disabled={!editing} />
                        </Form.Item>

                        {editing && (
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                            >
                                Save Changes
                            </Button>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default Profile