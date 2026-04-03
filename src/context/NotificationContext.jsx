import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])
    const { user } = useAuth() || {} // 🔥 chống crash

    useEffect(() => {
        // ❌ chưa login → không chạy
        if (!user) return

        // ❌ đã hiện rồi → không chạy lại
        const shown = localStorage.getItem("discount_shown")
        if (shown) return


        const timer = setTimeout(() => {
            const couponCode = "DISCOUNT10"

            const newNoti = {
                id: Date.now(),
                title: "🎉 Special Discount!",
                message: `Use code ${ couponCode } to get 10 % off!`,
                code: couponCode
            }

            setNotifications(prev => [newNoti, ...prev])

            localStorage.setItem("discount_shown", "true")
            localStorage.setItem("coupon_code", couponCode)

        }, 5 * 1000)

        return () => clearTimeout(timer)

    }, [user])

    return (
        <NotificationContext.Provider value={{ notifications }}>
            {children}
        </NotificationContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => useContext(NotificationContext)
