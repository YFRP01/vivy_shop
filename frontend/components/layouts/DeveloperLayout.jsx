import React, { useState } from 'react'
import { Outlet, useNavigate } from "react-router-dom"


const DeveloperLayout = () => {

  const [selectedMethod, setSelectedMethod] = useState(0)
  const pages = [
    {"id": 0, "title": "Create" , "nav": '/developer' },
    {"id": 1, "title": "Categories" , "nav": '/categories' },
  ]

  const methods = [
    {"id": 0, "title":"POST", "nav": '/developer' },
    {"id": 1, "title":"EDIT", "nav": '/developer/items/list' }
  ]

  const navigate = useNavigate()
  const [selectedPage, setSelectedPage] = useState(0)
  return (
    <div className='flex flex-col h-screen bg-white'>
        <div className='flex items-end gap-3 w-full px-3 pb-1 pt-5 border-b border-blue-100'>
            {pages.map((page)=>(
              <div key={page.id} className={`${selectedPage === page.id && 'border-b border-blue-500 text-blue-500'} transition-colors duration-400 0ease-in-out`}
                  onClick={()=>(setSelectedPage(page.id), navigate(`${page.nav}`))}>{page.title}
              </div>
            ))}  
        </div>    
        <div className='flex gap-1 h-full relative'>
          <div className='absolute top-0 w-16 md:w-26 py-4 flex flex-col gap-2 bg-gray-100 border-r h-full border-blue-200'>
            {methods.map((m)=>(
              <p className={`${selectedMethod === m.id ? 'bg-blue-300 hover:bg-blue-200' : 'text-blue-400 hover:bg-blue-100' } p-2 text-sm transition-all duration-200 ease-in-out`} key={m.id} 
              onClick={()=>(setSelectedMethod(m.id), navigate(m.nav))}>{m.title}</p>
            ))}
          </div>
         <div className='pl-17 md:pl-27 w-full'><Outlet /></div>
        </div>
    </div>
  )
}

export default DeveloperLayout
