import { Typography, Row, Col, Button } from 'antd'
import PromoCard from '../common/PromoCard'

const { Title, Paragraph } = Typography

const PromotionSection = () => {
    const promotions = [
        {
            title: 'Săn sale lễ - Đặt sớm xe tốt',
            image:
                'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2',
        },
        {
            title: 'Chọn xe đúng gu - vi vu đúng mood',
            image:
                'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
        },
        {
            title: 'Căn xe đúng lúc - giảm giá hấp dẫn',
            image:
                'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
        },
    ]

    return (
        <div style={{ marginTop: '5px', textAlign: 'center' }}>

            <Title level={2}>Chương Trình Khuyến Mãi</Title>
            <Paragraph>Nhận nhiều ưu đãi hấp dẫn từ Mioto</Paragraph>

            <div style={{ position: 'relative', marginTop: '30px' }}>
                {/* List card */}
                <Row gutter={20}>
                    {promotions.map((item, index) => (
                        <Col span={8} key={index}>
                            <PromoCard {...item} />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    )
}

export default PromotionSection