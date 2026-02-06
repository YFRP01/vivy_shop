import React from 'react'
import {Outlet} from "react-router-dom"
import { LayoutDashboardIcon } from 'lucide-react'
import Navbar from './Navbar'
const MainLayout = () => {
  return (
    <div className='flex flex-col relative w-full '>
        <Navbar />
        <div className='mt-16.5 w-full'><Outlet /></div>
        <div className='absolute bottom-5 right-5 shadow-lg p-5 bg-white flex items-center justify-center rounded-full border border-blue-400'>
            <LayoutDashboardIcon className="text-blue-500 h-5 w-5" />
        </div>
    </div>
  )
}

export default MainLayout