import { Modal } from 'antd'

const UserModal = ({ user, onClose }) => {
    return (
        <Modal open={!!user} onCancel={onClose} footer={null}>
            <h3>Customer Info</h3>

            <p><b>Name:</b> {user?.name}</p>
            <p><b>Email:</b> {user?.email}</p>
            <p><b>Phone:</b> {user?.phone}</p>
            <p><b>Address:</b> {user?.address}</p>
        </Modal>
    )
}

export default UserModal