import React, { useEffect, useRef, useState } from 'react'
import EditItem from './EditItem'
import { CircleAlert, Pointer, XCircle } from 'lucide-react'

const ViewCatModal = ({hold }) => {
    const itemRef = useRef()
    const [viewItemModal, setViewItemModal] = useState(false)
    const [selectedItemId, setSelectedItemId] = useState(null)

    useEffect(()=>{
        const handleClickOutside =(e)=>{
            if(itemRef.current && !itemRef.current.contains(e.target)){
                setViewItemModal(false)
            }
        }
        addEventListener('mousedown', handleClickOutside)
        return()=>{
            removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

  return (
    <div className='flex flex-col h-full'>
        <div className='w-full space-y-2 h-fit relative'>
        <p className='text-blue-500 text-2xl list-disc list-inside'>{hold?.category_name}
            (<span className='text-green-500 font-medium'>{hold?.item?.length}</span>)
        </p>
        {hold?.item?.length > 0 ? (
        <div className='w-full h-full space-y-2'>
            <div>
                <table className='w-full text-sm text-left text-gray-500 rounded-lg bg-green-400'>
                    <thead className='text-xs text-gray-700 uppercase'>
                        <tr>
                            <th scope='col' className='px-6 py-2 '>Name</th>
                            <th scope='col' className='px-6 py-2'>Date</th>
                            <th scope='col' className='px-6 py-2'>Time</th>
                            {/* <th scope='col' className='px-6 py-3'>Edit</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {hold?.item?.map((i, index)=>(
                            <tr key={i.item_id} 
                            onClick={()=>(setViewItemModal(true), setSelectedItemId(i.item_id))}
                            className={` active:bg-blue-100 flex-wrap border-b text-xs border-blue-200 hover:bg-blue-50 ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50' }`}>
                                <th scope='row' className=' px-3 py-3 font-medium text-gray-900 '>{i.name}</th>
                                <td className='px-3 py-3'>{i.date}</td>
                                <td className='px-3 py-3'>{i.time}</td>
                                {/* <td className='px-2 py-1 flex items-center justify-center'>
                                    <Pointer size={20} className='cursor-pointer text-blue-500' />
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {viewItemModal && (
                <div className='h-screen w-screen z-50 fixed top-0 left-0 right-0 bottom-0 bg-black/70 flex items-center justify-center '>
                <div ref={itemRef} className='bg-white p-8 shadow-lg h-[80%] space-y-5 w-[90%] rounded-xl md:p-4 lg:p-6 relative'>
                    <div className='w-full absolute top-0 right-0 p-2 text-red-500 flex items-center justify-end'>
                    <XCircle className='cursor-pointer w-7 h-7' onClick={()=>(setViewItemModal(false))} />
                    </div>
                    <div className='overflow-y-auto h-full'>
                        <EditItem itemId={selectedItemId} setIsOpen={setViewItemModal}/>
                    </div>
                </div>
            </div>
        )}
        </div>):
        (<div className='text-gray-600 absolute top-60 left-0 right-0 h-full flex items-center justify-center gap-2 px-5 md:px-10'>
            <div className='flex justify-center'>
                <CircleAlert className='w-6 h-6' />
            </div>
            <p className='flex-1'>No items connected to this category yet. Please create an item and connect it to this category to view it here.</p>
        </div>)}
        </div>
    </div>
  )
}

export default ViewCatModal
