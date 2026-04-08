import { useEffect, useState, useRef } from 'react'
import { Card, Form, Input, Button, message, Modal } from 'antd'
import { useAuth } from '../context/AuthContext'
import { EditOutlined } from '@ant-design/icons'
import fetchWithAuth from '../services/api'
import { buildImageUrl } from '../utils/image'
import { deleteCard } from '../services/userService'
import { changePasswordAPI } from '../services/authService'

const Profile = () => {
    const [form] = Form.useForm()
    const [cardForm] = Form.useForm()
    const { user, updateProfile, logout } = useAuth()

    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    const [preview, setPreview] = useState(null)
    const [file, setFile] = useState(null)

    const [activeTab, setActiveTab] = useState('account')

    const [showAddCard, setShowAddCard] = useState(false)

    const fileInputRef = useRef()

    const [cardType, setCardType] = useState('card')

    const [passwordLoading, setPasswordLoading] = useState(false)


    useEffect(() => {
        // 🔥 FETCH PROFILE
        if (user) {
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
        }


    }, [user, form, cardForm])

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
                body: JSON.stringify({
                    ...values,
                    brand: detectCardType(values.number),
                })
            })

            updateProfile({
                ...user,
                cards: res.cards
            })

            message.success("Card added 💳")
            setShowAddCard(false)
            cardForm.resetFields()
            setCardType('card')

        } catch {
            message.error("Add failed")
        }
    }

    // 🔥 VALIDATE (LUHN)
    const validateCardNumber = (number) => {
        const cleaned = number.replace(/\s+/g, '')

        if (!/^\d{13,19}$/.test(cleaned)) return false

        let sum = 0
        let shouldDouble = false

        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i])

            if (shouldDouble) {
                digit *= 2
                if (digit > 9) digit -= 9
            }

            sum += digit
            shouldDouble = !shouldDouble
        }

        return sum % 10 === 0
    }

    const handleDeleteCard = async (index) => {
        Modal.confirm({
            title: 'Delete this card?',
            onOk: async () => {
                try {
                    const res = await deleteCard(index)

                    updateProfile({
                        ...user,
                        cards: res.cards
                    })

                    message.success("Card deleted ❌")
                } catch (err) {
                    console.log(err)
                    message.error("Delete failed")
                }
            }
        })
    }

    const detectCardType = (number) => {
        const cleaned = number.replace(/\s/g, '')

        if (cleaned.startsWith('4')) return 'visa'
        if (/^5[1-5]/.test(cleaned)) return 'mastercard'

        return 'card'
    }

    const handleChangePassword = async (values) => {
        Modal.confirm({
            title: "Change password?",
            content: "You will be logged out after this action",
            okText: "Yes",
            cancelText: "Cancel",

            onOk: async () => {
                setPasswordLoading(true)

                try {
                    const res = await changePasswordAPI(values)

                    if (res.message.toLowerCase().includes('success')) {

                        message.success("Password changed successfully 🔐")

                        // 👉 message bảo mật (đặt ở đây luôn)
                        message.info("For security reasons, please login again")

                        setTimeout(() => {
                            logout()
                        }, 1000)

                    } else {
                        message.error(res.message)
                    }

                } catch (err) {
                    message.error(err.message || "Change password failed ❌")
                }

                setPasswordLoading(false)
            }
        })
    }


    return (
        <div style={{ display: 'flex', gap: 30, padding: 40 }}>

            {/* SIDEBAR */}
            <div style={{ width: 250 }}>
                <h2>Hello!</h2>

                <div style={{ marginTop: 20, lineHeight: '40px' }}>
                    <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('account')}>👤 My Account</div>
                    <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('payment')}>💳 Payment Methods</div>
                    <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('password')}> 🔐 Change Password </div>
                </div>
            </div>

            <Modal
                title="Add New Card"
                open={showAddCard}
                destroyOnHidden
                onCancel={() => 
                    setShowAddCard(false)}
                    
                footer={null}
            >
                <Form onFinish={handleAddCard} form={cardForm} layout="vertical">

                    <Form.Item
                        name="holder"
                        label="Card Holder Name"
                        rules={[{ required: true, message: 'Enter card holder name' }]}
                    >
                        <Input placeholder="Nguyen Van A" />
                    </Form.Item>

                    <Form.Item
                        name="number"
                        label="Card Number"
                        rules={[
                            { required: true, message: 'Please enter card number' },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve()

                                    if (!validateCardNumber(value)) {
                                        return Promise.reject('Invalid card number ❌')
                                    }

                                    return Promise.resolve()
                                }
                            }
                        ]}
                    >
                        <Input
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            value={cardForm.getFieldValue('number')}

                            suffix={
                                <span style={{ fontWeight: 600 }}>
                                    {cardType === 'visa' && 'VISA'}
                                    {cardType === 'mastercard' && 'MC'}
                                </span>
                            }

                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '')
                                const formatted = raw.replace(/(.{4})/g, '$1 ').trim()

                                cardForm.setFieldsValue({ number: formatted })
                                setCardType(detectCardType(formatted))
                            }}
                        />
                    </Form.Item>

                    <Form.Item name="expiry" label="Expiry" rules={[{ required: true, message: 'Enter your expiry' }]}>
                        <Input placeholder="MM/YY" />
                    </Form.Item>

                    <Form.Item name="cvv" label="CVV" rules={[{ required: true, message: 'Enter your cvv' }]}>
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
                <Card title="Payment Methods" extra={
                    <Button
                        style={{marginLeft: 40}}
                        onClick={() => {
                            setShowAddCard(true)
                            cardForm.resetFields()     
                            setCardType('card') 
                        }}
                    >
                        + Add Card
                    </Button>
                }>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>

                        {user.cards?.map((card, i) => (
                            <div key={i}
                                style={{
                                    width: 320,
                                    height: 180,
                                    borderRadius: 16,
                                    padding: 20,
                                    background: '#dbe2ea',
                                    position: 'relative',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}>

                                {/* HEADER */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontWeight: 600
                                }}>
                                    <span style={{ color: '#1a3d7c' }}>
                                        {card.brand === 'Visa' && 'VISA'}
                                        {card.brand === 'Mastercard' && 'MASTERCARD'}
                                    </span>

                                    <span style={{ fontSize: 12 }}>
                                        CREDIT
                                    </span>
                                </div>

                                {/* CARD NUMBER */}
                                <div style={{
                                    marginTop: 20,
                                    fontSize: 20,
                                    letterSpacing: 2,
                                    fontWeight: 500
                                }}>
                                    **** **** **** {card.last4}
                                </div>

                                {/* NAME */}
                                <div style={{
                                    marginTop: 15,
                                    fontSize: 13,
                                    textTransform: 'uppercase'
                                }}>
                                    {card.holder}
                                </div>

                                {/* EXPIRY */}
                                <div style={{
                                    marginTop: 5,
                                    fontSize: 12
                                }}>
                                    {card.expiry}
                                </div>

                                {/* DELETE BUTTON */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 10,
                                    right: 10,
                                    cursor: 'pointer',
                                    fontSize: 16
                                }}
                                    onClick={() => handleDeleteCard(i)}
                                >
                                    🗑️
                                </div>

                            </div>
                        ))}
                    </div>
                </Card>
            )}
            {activeTab === 'password' && (
                <Card title="Change Password">
                    <Form layout="vertical" onFinish={handleChangePassword}>

                        <Form.Item
                            name="oldPassword"
                            label="Current Password"
                            rules={[{ required: true, message: 'Enter current password' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[
                                { required: true, message: 'Enter new password' },
                                { min: 8, message: 'Minimum 8 characters' }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Confirm password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject("Passwords do not match ❌")
                                    }
                                })
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={passwordLoading}
                            block
                        >
                            Update Password
                        </Button>

                    </Form>
                </Card>
            )}
        </div>
    )
}

export default Profile