import { useEffect, useState, useRef } from 'react'
import { Card, Form, Input, Button, message, Modal } from 'antd'
import { useAuth } from '../context/AuthContext'
import { EditOutlined } from '@ant-design/icons'
import fetchWithAuth from '../services/api'
import { buildImageUrl } from '../utils/image'

const Profile = () => {
    const [form] = Form.useForm()
    const { user, updateProfile } = useAuth()

    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    const [preview, setPreview] = useState(null)
    const [file, setFile] = useState(null)

    const [activeTab, setActiveTab] = useState('account')

    const [showAddCard, setShowAddCard] = useState(false)

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
        preview || buildImageUrl(user?.avatar)
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
            const data = await fetchWithAuth('/api/user/avatar', {
                method: 'PUT',
                body: formData
            })

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
            const data = await fetchWithAuth('/api/user/update', {
                method: 'PUT',
                body: JSON.stringify(values)
            })

            updateProfile(data.user)

            message.success('Profile updated successfully')
            setEditing(false)
        } catch {
            message.error('Update failed')
        }

        setLoading(false)
    }

    const handleAddCard = async (values) => {
        try {
            const res = await fetchWithAuth('/api/user/add-card', {
                method: 'POST',
                body: JSON.stringify(values)
            })

            // 🔥 UPDATE STATE NGAY
            updateProfile({
                ...user,
                cards: res.cards
            })

            message.success("Card saved 💳")
            setShowAddCard(false)

        } catch (err) {
            console.log('err:', err)
            message.error("Failed to save card")
        }
    }

    // const validateCard = (number) => {
    //     const cleaned = number.replace(/\s+/g, '')
    //     let sum = 0
    //     let shouldDouble = false

    //     for (let i = cleaned.length - 1; i >= 0; i--) {
    //         let digit = parseInt(cleaned[i])

    //         if (shouldDouble) {
    //             digit *= 2
    //             if (digit > 9) digit -= 9
    //         }

    //         sum += digit
    //         shouldDouble = !shouldDouble
    //     }

    //     return sum % 10 === 0
    // }

    return (
        <div style={{ display: 'flex', gap: 30, padding: 40 }}>

            {/* SIDEBAR */}
            <div style={{ width: 250 }}>
                <h2>Hello!</h2>

                <div style={{ marginTop: 20, lineHeight: '40px' }}>
                    <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('account')}>👤 My Account</div>
                    <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('payment')}>💳 Payment Methods</div>
                    <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('trips')}>🧾 Change PassWord</div>
                </div>
            </div>

            <Modal
                title="Add New Card"
                open={showAddCard}
                onCancel={() => setShowAddCard(false)}
                footer={null}
            >
                <Form onFinish={handleAddCard} layout="vertical">

                    <Form.Item name="number" label="Card Number" rules={[{ required: true }]}>
                        <Input placeholder="1234 5678 9012 3456" />
                    </Form.Item>

                    <Form.Item name="expiry" label="Expiry">
                        <Input placeholder="MM/YY" />
                    </Form.Item>

                    <Form.Item name="cvv" label="CVV">
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Save Card
                    </Button>
                </Form>
            </Modal>

            {/* MAIN */}
            {activeTab === 'account' && (
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
            )}
            {activeTab === 'payment' && (
                <Card title="Payment Methods">

                    <div style={{ display: "flex" }}>
                        {/* LIST CARD */}
                        {user.cards?.map((card, i) => (
                            <div key={i}
                                style={{
                                    margin: 20,
                                    padding: 16,
                                    borderRadius: 12,
                                    background: '#406093',
                                    color: '#fff'
                                }}>
                                <h4>VISA</h4>
                                <p>**** **** **** {card.last4}</p>
                            </div>
                        ))}

                    </div>
                    {/* ADD CARD */}
                    <Button
                        style={{
                            margin: 20,
                            width: 145,
                            height:120,
                            padding: 16,
                            borderRadius: 12,
                            background: '#406093',
                            color: '#fff'
                        }}
                        type="primary"
                        onClick={() => setShowAddCard(true)}
                    >
                        + Add New Card
                    </Button>
                </Card>
            )}
        </div>
    )
}

export default Profile