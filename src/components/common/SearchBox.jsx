import { Card, Tabs, Input, DatePicker, Button } from 'antd'

const { RangePicker } = DatePicker

const SearchBox = () => {
    return (
        <div style={{ position: 'relative', top: '-60px' }}>
            <Card style={{ borderRadius: '20px' }}>

                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Xe tự lái" key="1" />
                    <Tabs.TabPane tab="Xe có tài xế" key="2" />
                    <Tabs.TabPane tab="Thuê dài hạn" key="3" />
                </Tabs>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Input placeholder="Địa điểm" />

                    <RangePicker style={{ width: '300px' }} />

                    <Button type="primary" size="large">
                        Tìm Xe
                    </Button>
                </div>

            </Card>
        </div>
    )
}

export default SearchBox