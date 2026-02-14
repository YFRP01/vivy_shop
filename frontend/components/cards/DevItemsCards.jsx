import React from 'react'

const DevItemsCards = ({item}) => {

    const color = "from-red to-gray-300";

  return (
    <div className={`border-gray-500 flex items-center gap-2 p-1 bg-linear-to-tr shadow-md ${color} rounded-md`}>
      <div className='flex-1 text-sm md:text-md'>
        <p className='text-xs'>Name: <span className='font-medium text-sm leading-3'>{item.name}</span></p>
        <p className='text-xs'>Category: <span className='font-medium text-sm leading-3'>{item.category}</span></p>
        <p className='text-xs'>Description: <span className='font-medium text-sm leading-3'>{item.description}</span></p>
        <p className='text-xs'>Source: <span className='font-medium text-sm leading-3'>{item.source}</span></p>
        <p className='text-xs'>Date: <span className='font-medium text-sm leading-3'>{item.date}</span></p>
        <p className='text-xs'>Time: <span className='font-medium text-sm leading-3'>{item.time}</span></p>
      </div>
      <div className='border border-gray-500 w-20 h-20 p-1 bg-white rounded-md overflow-hidden'>
        <img src={item.image} alt={item.name + 'image'} className='object-cover rounded-md bg-white text-center flex text-[10px] text-gray-600'/>
      </div>
    </div>
  )
}

export default DevItemsCards
