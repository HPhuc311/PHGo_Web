import { Input, Select } from 'antd'
import { useState } from 'react'

const CarFilter = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        location: '',
        brand: '',
        price: null
    })

    const handleChange = (key, value) => {
        const updated = { ...filters, [key]: value }
        setFilters(updated)
        onFilter(updated)
    }

    return (
        <div style={{
            display: 'flex',
            gap: 10,
            background: '#fff',
            padding: 15,
            borderRadius: 10,
            boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
        }}>
            <Input
                placeholder="Search location..."
                onChange={(e) => handleChange('location', e.target.value)}
            />

            <Input
                placeholder="Search brand..."
                onChange={(e) => handleChange('brand', e.target.value)}
            />

            <Select
                placeholder="Max price"
                style={{ width: 150 }}
                onChange={(value) => handleChange('price', value)}
                allowClear
            >
                <Select.Option value={500000}>≤ 500K</Select.Option>
                <Select.Option value={1000000}>≤ 1M</Select.Option>
                <Select.Option value={2000000}>≤ 2M</Select.Option>
            </Select>
        </div>
    )
}

export default CarFilter