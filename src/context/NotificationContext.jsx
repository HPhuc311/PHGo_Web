import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])
    const { user } = useAuth() || {}

    useEffect(() => {
        if (!user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setNotifications([])
            return
        }

        const userId = user._id

        const notiKey = `notifications_${userId}`
        const shownKey = `discount_shown_${userId}`
        const couponKey = `coupon_${userId}`

        const savedNoti = localStorage.getItem(notiKey)
        if (savedNoti) {
            setNotifications(JSON.parse(savedNoti))
        }

        // 🔥 2. LẤY COUPON TỪ LOGIN (backend gửi về)
        const couponCode = localStorage.getItem("new_coupon")

        if (!couponCode) return

        // 👉 tránh hiển thị nhiều lần
        const shown = localStorage.getItem(shownKey)
        if (shown) return

        const delay = 5000

        const timer = setTimeout(() => {

            const newNoti = {
                id: Date.now(),
                title: "🎉 Discount 15%",
                message: `Use code ${couponCode} to get 15% off`,
                code: couponCode
            }

            const updated = [newNoti, ...(savedNoti ? JSON.parse(savedNoti) : [])]

            setNotifications(updated)

            // 🔥 SAVE
            localStorage.setItem(notiKey, JSON.stringify(updated))
            localStorage.setItem(shownKey, "true")
            localStorage.setItem(couponKey, couponCode)

            // 👉 clear để không spam
            localStorage.removeItem("new_coupon")

        }, delay)

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