import { Typography, Row, Col, Button } from 'antd'
import PromoCard from '../common/PromoCard'

const { Title, Paragraph } = Typography

const PromotionSection = () => {
    const promotions = [
        {
            title: 'Holiday Deals - Book Early for the Best Cars',
            image: '/images/1.png',
        },
        {
            title: 'Choose Your Style - Ride Your Mood',
            image:
                '/images/2.png',
        },
        {
            title: 'Book at the Right Time - Enjoy Great Discounts',
            image:
                '/images/3.png',
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