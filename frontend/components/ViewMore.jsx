import { Heart, Verified } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const ViewMore = ({item, info, order_status, handleLike, setIsView, likeValue}) =>{
  
  const modalRef = useRef(null)
  const navigate = useNavigate()

  const handleLikeToggle = (e)=>{
    console.log('child: ', item?.liked),
    handleLike(e, item?.item_id)  }

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

  
    return (
        <div className={`fixed left-0 right-0 top-0 bottom-0 z-50 h-screen bg-black/20 w-screen`}>
            <div className='flex flex-col px-10 md:px-25 lg:px-30 xl:px-45 2xl:px-55 items-center justify-center h-full'>
                <div ref={modalRef} className={`border relative h-80 w-full bg-white border-blue-400 rounded-2xl flex flex-col items-center justify-center`}>
                    <div className='p-2 py-5 w-full h-full flex flex-col items-center justify-start wrap-break-word overflow-y-auto'>
                        <div className='flex w-full relative'>
                            <div className='flex-1'><div className='w-full flex items-start gap-1'><p className='font-serif'>Name:</p> <p className='font-normal text-sm'>{item?.name}</p></div>
                            <div className='w-full flex items-start gap-1'><p className='font-serif'>Category:</p> <p className='font-normal text-sm'>{item?.category}</p></div>
                        </div>
                        <button onClick={(e)=>(handleLikeToggle(e))}
                         className='flex justify-end absolute -top-3 right-0 items-center ' >
                          {<Heart size={50} onClick={(e)=>(handleLike(e, item?.item_id))}
                            className={`${likeValue ? 'text-red-500 fill-red-500':'text-gray-500 fill-gray-500'}`}/>}
                        </button> 
                        </div>
                        <div className='w-full flex items-start gap-1'><p className='font-serif'>Description:</p> <p className='font-normal text-sm'>{item?.description}</p></div>
                        <div className='w-full flex items-start gap-1'><p className='font-serif'>Quantity:</p> <p className='font-normal text-sm'>{info?.qty}</p></div>
                        <div className='w-full flex items-start gap-1'><p className='font-serif'>Cost:</p> <p className='font-normal text-sm'>{info?.cost}</p></div>
                        <div className='w-full flex items-center gap-1'><p className='font-serif'>Ordered: </p><p className='flex'>{order_status? 
                        (<Verified size={17} className='fill-green-500 text-white'/>):(<Verified size={17} className='fill-red-500 text-white'/>)}</p></div>
                    </div>
                    <div className='w-full border-t rounded-b-2xl border-blue-500 bg-blue-100 flex items-center justify-end gap-2 px-3 py-1 bottom-0 left-0 right-0'>
                        <p onClick={()=>(setIsView(false))} className={`cursor-pointer border border-red-500 text-red-500 py-1 px-2 rounded-2xl bg-white`}>Close</p>
                        <p onClick={()=>(navigate(`/item/${item?.item_id}`))} className={`cursor-pointer border py-1 px-2 border-green-500 text-green-500 bg-white rounded-2xl`}>Visit</p>
                    </div>
            </div>
            </div>
        </div>        

    )
}

export default ViewMore




// import { Heart, Verified } from 'lucide-react'
// import React, { useEffect, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'

// const ViewMore = ({item, info, order_status, isView, setIsView, onLikeToggle}) => {
  
//     const modalRef = useRef(null)
//     const navigate = useNavigate()

//     // Close when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (modalRef.current && !modalRef.current.contains(event.target)) {
//                 setIsView(false)
//             }
//         }
        
//         document.addEventListener('mousedown', handleClickOutside)
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside)
//         }
//     }, [setIsView])

//     // Handle like toggle in modal
//     const handleLikeClick = (e) => {
//         e.stopPropagation();
//         if (onLikeToggle) {
//             onLikeToggle(item, e);
//         }
//     }

//     return (
//         <div className={`fixed left-0 right-0 top-0 bottom-0 h-screen bg-black/20 w-screen z-11 ${isView ? 'block' : 'hidden'}`}>
//             <div className='flex flex-col px-10 md:px-25 lg:px-30 xl:px-45 2xl:px-55 items-center justify-center h-full'>
//                 <div ref={modalRef} className='border relative h-80 w-full bg-white border-blue-400 rounded-2xl flex flex-col items-center justify-center'>
                    
//                     <div className='p-2 py-5 w-full h-full flex flex-col items-center justify-start wrap-break-word overflow-y-auto'>
                        
//                         {/* Header with like button */}
//                         <div className='flex w-full relative'>
//                             <div className='flex-1'>
//                                 <div className='w-full flex items-start gap-1'>
//                                     <p className='font-serif'>Name:</p> 
//                                     <p className='font-normal text-sm'>{item?.name}</p>
//                                 </div>
//                                 <div className='w-full flex items-start gap-1'>
//                                     <p className='font-serif'>Category:</p> 
//                                     <p className='font-normal text-sm'>{item?.category}</p>
//                                 </div>
//                             </div>
                            
//                             {/* ✅ FIXED: Use item?.liked directly from props (it's updated via parent state) */}
//                             <button onClick={handleLikeClick}
//                                 className='flex justify-end absolute -top-3 right-0 items-center'>
//                                 {item?.liked ? 
//                                     (<Heart size={50} className='fill-red-500 text-red-500'/>)
//                                     :
//                                     (<Heart size={50} className='fill-gray-600 text-gray-600'/>)
//                                 }
//                             </button>
//                         </div>
                        
//                         {/* Description */}
//                         <div className='w-full flex items-start gap-1'>
//                             <p className='font-serif'>Description:</p> 
//                             <p className='font-normal text-sm'>{item?.description || 'No description'}</p>
//                         </div>
                        
//                         {/* Quantity */}
//                         <div className='w-full flex items-start gap-1'>
//                             <p className='font-serif'>Quantity:</p> 
//                             <p className='font-normal text-sm'>{info?.qty}</p>
//                         </div>
                        
//                         {/* Cost */}
//                         <div className='w-full flex items-start gap-1'>
//                             <p className='font-serif'>Cost:</p> 
//                             <p className='font-normal text-sm'>{info?.cost}</p>
//                         </div>
                        
//                         {/* Order Status */}
//                         <div className='w-full flex items-center gap-1'>
//                             <p className='font-serif'>Ordered: </p>
//                             <p className='flex'>
//                                 {order_status ? 
//                                     (<Verified size={17} className='fill-green-500 text-white'/>)
//                                     : (<Verified size={17} className='fill-red-500 text-white'/>)
//                                 }
//                             </p>
//                         </div>
//                     </div>
                    
//                     {/* Footer buttons */}
//                     <div className='w-full border-t rounded-b-2xl border-blue-500 bg-blue-100 flex items-center justify-end gap-2 px-3 py-1'>
//                         <p onClick={() => setIsView(false)} 
//                            className='cursor-pointer border border-red-500 text-red-500 py-1 px-2 rounded-2xl bg-white'>
//                             Close
//                         </p>
//                         <p onClick={() => navigate(`/item/${item?.item_id}`)} 
//                            className='cursor-pointer border py-1 px-2 border-green-500 text-green-500 bg-white rounded-2xl'>
//                             Visit
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>        
//     )
// }

// export default ViewMore

