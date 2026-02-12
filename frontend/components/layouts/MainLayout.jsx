import React from 'react'
import {Outlet, useNavigate} from "react-router-dom"
import { LayoutDashboardIcon } from 'lucide-react'


const MainLayout = () => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col relative w-full '>
        <div className='mt-17.5 w-full'><Outlet /></div>
        <div onClick={()=>(navigate('/ordered'))} className='fixed bottom-5 right-5 z-50 shadow-lg p-5 bg-white flex items-center justify-center rounded-full border border-blue-400'>
            <LayoutDashboardIcon className="text-blue-500 h-5 w-5" />
        </div>
    </div>
  )
}

export default MainLayout