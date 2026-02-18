import React, { useEffect, useRef, useState } from 'react'
import EditItem from './EditItem'
import { Pointer, XCircle } from 'lucide-react'

const ViewCatModal = ({hold, setIsOpen, }) => {
    const itemRef = useRef()
    const [viewItemModal, setViewItemModal] = useState(false)
    const [selectedItemId, setSelectedItemId] = useState(null)

    const handleVisit =(id)=>{
        // setViewItemModal(true)
        if(viewItemModal){
            <EditItem itemId={id} setIsOpen={setViewItemModal}/>
        }
    }

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
    <div className='flex flex-col h-full gap-2 w-full p-5'>
        <p className='text-blue-500 text-2xl list-disc list-inside'>{hold?.category_name}</p>
        <div>
            <table className='w-full text-sm text-left text-gray-500 rounded-lg bg-green-400'>
                <thead className='text-xs text-gray-700 uppercase'>
                    <tr>
                        <th scope='col' className='px-6 py-3'>Name</th>
                        <th scope='col' className='px-6 py-3'>Date</th>
                        <th scope='col' className='px-6 py-3'>Time</th>
                        <th scope='col' className='px-6 py-3'>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {hold?.item?.map((i, index)=>(
                        <tr key={i.item_id} 
                        onClick={()=>(setViewItemModal(true), setSelectedItemId(i.item_id))}
                        className={` active:bg-blue-100 border-b border-blue-200 hover:bg-blue-50 ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50' }`}>
                            <th scope='row' className=' px-2 py-1 font-medium text-gray-900 whitespace-nowrap'>{i.name}</th>
                            <td className='px-2 py-1'>{i.date}</td>
                            <td className='px-2 py-1'>{i.time}</td>
                            <td className='px-2 py-1 flex items-center justify-center'>
                                <Pointer size={20} className='cursor-pointer text-blue-500' />
                            </td>
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
    </div>
  )
}

export default ViewCatModal
