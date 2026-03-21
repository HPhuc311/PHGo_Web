import { Select } from 'antd'

const TripFilter = ({ onFilter }) => {
    return (
        <Select
            placeholder="Filter by status"
            style={{ width: 200 }}
            onChange={onFilter}
            allowClear
        >
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="processing">Processing</Select.Option>
            <Select.Option value="confirmed">Confirmed</Select.Option>
            <Select.Option value="unpaid">Unpaid</Select.Option>
            <Select.Option value="paid">Paid</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
        </Select>
    )
}

export default TripFilter