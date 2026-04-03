import { Input } from "antd"
import { useState } from "react"

const SearchBox = ({ data = [], fields = [], onFiltered, placeholder }) => {
    const [value, setValue] = useState("")

    const handleSearch = () => {
        if (!value.trim()) {
            onFiltered(data)
            return
        }

        const keyword = value.toLowerCase()

        const filtered = data.filter(item =>
            fields.some(field => {
                const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], item)
                return fieldValue?.toLowerCase().includes(keyword)
            })
        )

        onFiltered(filtered)
    }

    return (
        <Input.Search
            placeholder={placeholder || "Search..."}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onSearch={handleSearch}
            allowClear
            enterButton="Search"
            style={{
                marginBottom: 16,
                maxWidth: 400
            }}
        />
    )
}

export default SearchBox
