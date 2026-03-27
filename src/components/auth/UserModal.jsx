import { Modal, Input, Button, message } from 'antd'
import { useState, useEffect } from 'react'
import { updateUser } from '../../services/userService'

const UserModal = ({ user, onClose, onUpdated }) => {
    const [form, setForm] = useState({})

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(user || {})
    }, [user])

    const handleUpdate = async () => {
        try {
            const res = await updateUser(user._id, form)

            message.success('Updated successfully')

            onUpdated(res.user)
            onClose()
        } catch (err) {
            console.log('err:', err)
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
            <Input
                placeholder="Name"
                value={form?.name}
                onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                }
            />

            <Input
                placeholder="Phone"
                value={form?.phone}
                onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                }
                style={{ marginTop: 10 }}
            />

            <Input
                placeholder="Address"
                value={form?.address}
                onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                }
                style={{ marginTop: 10 }}
            />

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