import { Card } from 'antd'

const PromoCard = ({ image, title }) => {
    return (
        <Card
            hoverable
            cover={
                <img
                    alt="promo"
                    src={image}
                    style={{
                        height: '220px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                    }}
                />
            }
            style={{
                borderRadius: '16px',
                overflow: 'hidden',
            }}
        >
            <h4>{title}</h4>
        </Card>
    )
}

export default PromoCard