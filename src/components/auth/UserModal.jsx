import { Modal, Input, Button, message, Select } from 'antd'
import { useState, useEffect } from 'react'
import { updateUser } from '../../services/userService'

const UserModal = ({ user, onClose, onUpdated }) => {
    const [form, setForm] = useState({})

    useEffect(() => {
        // ✅ clone để tránh mutate object gốc
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(user ? { ...user } : {})
    }, [user])

    const handleUpdate = async () => {
        try {
            const res = await updateUser(user._id, form)

            message.destroy()
            message.success('Updated successfully')

            onUpdated(res.user)
            onClose()

        } catch (err) {
            console.log('err:', err)
            message.destroy()
            message.error('Update failed')
        }
    }

    return (
        <Modal
            open={!!user}
            onCancel={onClose}
            footer={null}
            title="Edit User"
        >
            {/* NAME */}
            <Input
                placeholder="Name"
                value={form?.name}
                onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                }
            />

            {/* PHONE */}
            <Input
                placeholder="Phone"
                value={form?.phone}
                onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                }
                style={{ marginTop: 10 }}
            />

            {/* ADDRESS */}
            <Input
                placeholder="Address"
                value={form?.address}
                onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                }
                style={{ marginTop: 10 }}
            />

            {/* 🔥 ROLE (NEW) */}
            <Select
                value={form?.role}
                onChange={(value) =>
                    setForm({ ...form, role: value })
                }
                style={{ width: '100%', marginTop: 10 }}
            >
                <Select.Option value="customer">Customer</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
            </Select>

            {/* SAVE BUTTON */}
            <Button
                type="primary"
                block
                style={{ marginTop: 15 }}
                onClick={handleUpdate}
            >
                Save
            </Button>
        </Modal>
    )
}

export default UserModal