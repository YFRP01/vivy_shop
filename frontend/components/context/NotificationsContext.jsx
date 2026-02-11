import { createContext, useContext, useState } from "react"

const ContainerContext = createContext();

export const NotificationProvider = ({children}) => {
    const [likedCount, setLikedCount] = useState(0)
    return (
        <ContainerContext.Provider value={{likedCount, setLikedCount}}>
            {children}
        </ContainerContext.Provider>
    )
}

export const useNotifications = () => useContext(ContainerContext)