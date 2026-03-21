import { Select } from 'antd'

const ServiceSelect = () => {
    return (
        <Select placeholder="Select Service">
            <Select.Option value="local">Local Ride</Select.Option>
            <Select.Option value="long">Long Distance</Select.Option>
            <Select.Option value="airport">Airport Transfer</Select.Option>
            <Select.Option value="daily">Daily Hire</Select.Option>
        </Select>
    )
}

export default ServiceSelect