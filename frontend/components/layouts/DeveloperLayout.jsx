import React, { useState } from 'react'
import { Outlet, useNavigate } from "react-router-dom"
const DeveloperLayout = () => {
  
  const pages = [
    {"id": 0, "title": "Create" , "nav": '/developer' },
    {"id": 1, "title": "All items" , "nav": '/developer/items' },
    {"id": 2, "title": "Categories" , "nav": '/developer/categories' },
  ]

  const navigate = useNavigate()
  const [selectedPage, setSelectedPage] = useState(0)
  return (
    <div className='flex flex-col px-1'>
        <div className='flex items-end gap-3 px-3 pb-1 pt-5 border-b border-blue-100'>
            {pages.map((page)=>(
              <div key={page.id} className={`${selectedPage === page.id && 'border-b border-blue-500 text-blue-500'} transition-colors duration-400 0ease-in-out`}
                  onClick={()=>(setSelectedPage(page.id), navigate(`${page.nav}`))}>{page.title}
              </div>
            ))}  
        </div>    
        <div className='bg-white'><Outlet /></div>
    </div>
  )
}

export default DeveloperLayout
