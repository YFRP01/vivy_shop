import React from 'react'

const DevItemsCards = ({item}) => {


  return (
            <div className={`flex items-center border-gray-500 p-1 shadow-md bg-gray-50 rounded-md gap-2 w-full`}>
                <div className='flex-1 text-sm md:text-md gap-1 flex-wrap  break-word'>
                    <div className='flex flex-col break-word'>
                        <div className='flex w-full'>
                            <div className='flex-1 flex flex-col justify-center'>
                                <p className='text-xs'>Name: <span className='font-medium text-sm leading-5'>{item.name.slice(0, 100)}{item.name.length > 100 && '...'}</span></p>
                                <p className='text-xs'>Category: <span className='font-medium text-sm leading-5'>{item.category.slice(0, 100)}{item.category.length > 100 && '...'}</span></p>
                                <p className='text-xs'>Source: <span className='font-medium text-sm leading-5'>{item.source.slice(0, 100)}{item.source.length > 100 && '...'}</span></p>                    
                            </div>
                            <div className='border border-gray-500 w-20  rounded-md bg-red-500 overflow-hidden'>
                                <img src={item.image} alt={item.name + 'image'} className='object-cover h-full rounded-md bg-white text-center border border-gray-50 flex text-[10px] text-gray-600'/>
                            </div>
                        </div>
                        <p className='text-xs'>Description: <span className='font-medium text-sm leading-5'>{item.description.slice(0, 207)}{item.description.length > 207 && '...'}</span></p> 
                    </div>
                    <div className='w-full text-[10px] text-gray-600 flex justify-end items-end'>
                        <p>{item.date}</p>
                        <p>{item.time}</p>
                    </div>
                </div>
            </div>
  )
}

export default DevItemsCards
