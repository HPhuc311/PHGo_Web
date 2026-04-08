import { Row, Col, Divider } from 'antd'
import { FacebookOutlined, TwitterOutlined } from '@ant-design/icons'

const Footer = () => {
    return (
        <div style={{ background: '#f5f5f5', padding: '40px 440px', marginTop: '60px' }}>

            <div className="container">

                {/* Top */}
                <Row gutter={40}>

                    {/* Logo + Contact */}
                    <Col md={6}>
                        <h2 style={{ color: '#406093' }}>PHGo</h2>

                        <p><b>Hotline:</b> 1900 1234</p>
                        <p>Support: 7AM - 10PM</p>

                        <p><b>Email:</b> contact@phgo.vn</p>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <FacebookOutlined />
                            <TwitterOutlined />
                        </div>
                    </Col>

                    {/* Policy */}
                    <Col md={6}>
                        <h4>Policies</h4>
                        <p>Terms & Conditions</p>
                        <p>Operating Rules</p>
                        <p>Privacy Policy</p>
                        <p>Complaint Resolution</p>
                    </Col>

                    {/* Learn More */}
                    <Col md={6}>
                        <h4>Learn More</h4>
                        <p>How it works</p>
                        <p>Booking Guide</p>
                        <p>About Us</p>
                        <p>FAQ</p>
                    </Col>

                    {/* Partner */}
                    <Col md={6}>
                        <h4>Partners</h4>
                        <p>Become a Car Owner</p>
                        <p>Register GPS Service</p>
                        <p>Long-term Rental</p>
                    </Col>

                </Row>

                <Divider />

                {/* Bottom info */}
                <Row gutter={20}>
                    <Col md={12}>
                        <p>© Phgo Asia Joint Stock Company</p>
                        <p>Business Registration No: 0317307544</p>
                    </Col>

                    <Col md={12}>
                        <p>
                            Address: Pearl Plaza, CongHoa Street, Ho Chi Minh City, Vietnam
                        </p>
                    </Col>
                </Row>

                <Divider />

                {/* Payment */}
                <div style={{ textAlign: 'center' }}>
                    <p><b>Payment Methods</b></p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                            alt="visa"
                            style={{ height: '30px' }}
                        />

                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                            alt="paypal"
                            style={{ height: '30px' }}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Footer