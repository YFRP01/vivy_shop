import { Heart, Verified } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const ViewMore = ({viewId, item, info, order_status, editLike, like, isView, setIsView}) =>{
  
 const modalRef = useRef(null)

  //Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsView(false)
      }
    }
    
    window.document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigate = useNavigate()
  
    return (
        <div className={`fixed left-0 right-0 top-0 bottom-0 h-screen bg-black/20 w-screen z-11 ${isView ? 'block':'hidden'}`}>
            <div className='flex flex-col px-10 md:px-25 lg:px-30 xl:px-45 2xl:px-55 items-center justify-center h-full'>
                <div className={`border relative h-80 w-full bg-white border-blue-400 rounded-2xl flex flex-col items-center justify-center`}>
                    <div className='p-2 py-5 w-full h-full flex flex-col items-center justify-start wrap-break-word overflow-y-auto'>
                        <div className='flex w-full relative'>
                            <div className='flex-1'><div className='w-full flex items-start gap-1'><p className='font-serif'>Name:</p> <p className='font-normal text-sm'>{item.name}</p></div>
                            <div className='w-full flex items-start gap-1'><p className='font-serif'>Category:</p> <p className='font-normal text-sm'>{item.category}</p></div>
                        </div>
                        <button onClick={()=>(editLike())}
                         className='flex justify-end absolute -top-3 right-0 items-center ' >
                        {item.liked ? 
                        (<Heart size={50} className='fill-red-500 text-red-500'/>)
                        :
                        (<Heart size={50} className='fill-gray-600  text-gray-600'/>)}
                        </button> 
                        </div>
                        <div className='w-full flex items-start gap-1'><p className='font-serif'>Description:</p> <p className='font-normal text-sm'>{item.description}</p></div>
                        <div className='w-full flex items-start gap-1'><p className='font-serif'>Quantity:</p> <p className='font-normal text-sm'>{info.qty}</p></div>
                        <div className='w-full flex items-start gap-1'><p className='font-serif'>Cost:</p> <p className='font-normal text-sm'>{info.cost}</p></div>
                        <div className='w-full flex items-center gap-1'><p className='font-serif'>Ordered: </p><p className='flex'>{order_status? 
                        (<Verified size={17} className='fill-green-500 text-white'/>):(<Verified size={17} className='fill-red-500 text-white'/>)}</p></div>
                    </div>
                    <div className='w-full border-t rounded-b-2xl border-blue-500 bg-blue-100 flex items-center justify-end gap-2 px-3 py-1 bottom-0 left-0 right-0'>
                        <p onClick={()=>(setIsView(false))} className={`cursor-pointer border border-red-500 text-red-500 py-1 px-2 rounded-2xl bg-white`}>Close</p>
                        <p onClick={()=>(navigate(`/item/${viewId}`))} className={`cursor-pointer border py-1 px-2 border-green-500 text-green-500 bg-white rounded-2xl`}>Visit</p>
                    </div>
            </div>
            </div>
        </div>        

    )
}

export default ViewMore

