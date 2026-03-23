import { Typography, Row, Col, Button } from 'antd'
import PromoCard from '../common/PromoCard'

const { Title, Paragraph } = Typography

const PromotionSection = () => {
    const promotions = [
        {
            title: 'Holiday Deals - Book Early for the Best Cars',
            image:
                'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2',
        },
        {
            title: 'Choose Your Style - Ride Your Mood',
            image:
                'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
        },
        {
            title: 'Book at the Right Time - Enjoy Great Discounts',
            image:
                'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
        },
    ]

    return (
        <div style={{ marginTop: '5px', textAlign: 'center' }}>

            <Title level={2}>Promotions</Title>
            <Paragraph>Enjoy many attractive offers from Mioto</Paragraph>

            <div style={{ position: 'relative', marginTop: '30px' }}>
                {/* Card list */}
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