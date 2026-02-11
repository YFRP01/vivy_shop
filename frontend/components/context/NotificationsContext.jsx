import { createContext, useContext, useState } from "react"

const ContainerContext = createContext();

export const NotificationProvider = ({children}) => {
    const [likedCount, setLikedCount] = useState(0)
    return (
        <ContainerContext value={{likedCount, setLikedCount}}>
            {children}
        </ContainerContext>
    )
}

export const useNotifications = () => useContext(ContainerContext)