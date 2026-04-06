import { Layout } from 'antd'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Booking from './pages/Booking'
import NotFound from './pages/NotFound'
import CarList from './components/car/CarList'
import CarDetail from './components/car/CarDetail'
import Footer from './components/layout/Footer'
import Profile from './pages/Profile'
import MyTrips from './pages/MyTrip'
import AdminRoute from './components/routes/AdminRoute'
import AdminDashboard from './pages/AdminDashboard'
import UserRoute from './components/routes/UserRoute'
import Cars from './pages/Car'
import ScrollToTop from './components/common/ScrollToTop'
import SupportPage from './pages/SupportPage'

const { Content } = Layout

function App() {




    return (
        <Layout>
            <div className='container'>
                <Navbar />
                <Content style={{ padding: '20px' }}>
                    <ScrollToTop /> 
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/cars" element={<CarList />} />
                        <Route path="/cars/:id" element={<CarDetail />} />
                        <Route path="*" element={<NotFound />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/cars-list" element={<Cars />} />                       
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/booking"
                            element={
                                <UserRoute>
                                    <Booking />
                                </UserRoute>
                            }
                        />

                        <Route
                            path="/trips"
                            element={
                                <UserRoute>
                                    <MyTrips />
                                </UserRoute>
                            }
                        />
                        <Route
                            path="/support"
                            element={
                                <UserRoute>
                                    <SupportPage />
                                </UserRoute>
                            }
                        />

                    </Routes>
                </Content>
            </div>
            <Footer />
        </Layout>
    )
}

export default App