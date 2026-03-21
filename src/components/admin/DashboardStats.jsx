import { Card } from 'antd'

const DashboardStats = ({ trips }) => {
    const total = trips.length
    const completed = trips.filter(t => t.status === 'completed').length
    const pending = trips.filter(t => t.status === 'pending').length

    return (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <Card>📦 Total: {total}</Card>
            <Card>🟢 Completed: {completed}</Card>
            <Card>🟡 Pending: {pending}</Card>
        </div>
    )
}

export default DashboardStats