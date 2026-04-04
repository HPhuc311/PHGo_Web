import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])
    const { user } = useAuth() || {}

    useEffect(() => {
        if (!user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setNotifications([]) // logout → clear UI
            return
        }

        const userId = user._id

        // 🔥 1. LOAD notification cũ
        const savedNoti = localStorage.getItem(`notifications_${ userId } `)
        if (savedNoti) {
            setNotifications(JSON.parse(savedNoti))
        }

        const shown = localStorage.getItem(`discount_shown_${ userId } `)
        if (shown) return

        const delay = 5000

        const timer = setTimeout(() => {
            const couponCode = "DISCOUNT10"

            const newNoti = {
                id: Date.now(),
                title: "🎉 Special Discount!",
                message: `Use code ${ couponCode } to get 10 % off!`,
                code: couponCode
            }

            const updated = [newNoti]

            setNotifications(updated)

            // 🔥 2. SAVE notification
            localStorage.setItem(`notifications_${ userId } `, JSON.stringify(updated))
            localStorage.setItem(`discount_shown_${ userId } `, "true")
            localStorage.setItem(`coupon_${ userId } `, couponCode)

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
