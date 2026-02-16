import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { API_URL } from '../../api'
import DevItemsCards from '../../components/cards/DevItemsCards'
import { Trash2, XCircle } from 'lucide-react'
import EditItem from '../../components/EditItem'

const ListItems = () => {

  const detailsRef = useRef()

  const [holdItems, setHoldItems] = useState([])
  const [itemToDeleteId, setItemToDeleteId] = useState(null)
  const [viewDetailsModal, setViewDetailsModal] = useState(false)
  const [itemToViewDetails, setItemToViewDetails] = useState(null)

  const getItems = async()=>{
    try {
      const response = await axios.get(`${API_URL}/items/developer?category=all`)
      setHoldItems(response.data)
    } catch (error) {
      console.log(`Unable to get the saved items ${error.message}`);
    }
  }

  const deleteItem = async()=>{
    try {
      await axios.delete(`${API_URL}/items/${itemToDeleteId}`);
      setHoldItems((prev)=>prev.filter(item => item.item_id !== itemToDeleteId))
    } catch (error) {
      console.log(`Unable to get the saved items ${error.message}`);
    }
  }

  
  useEffect(()=>{
    deleteItem()
      console.log(holdItems.length, itemToDeleteId);

  },[itemToDeleteId])
  
  useEffect(()=>{
    getItems()
  },[])

  useEffect(()=>{
    const handleClickOutside = (event) => {
      if(detailsRef.current && !detailsRef.current.contains(event.target)){
        setViewDetailsModal(false)
        setItemToViewDetails(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return ()=>{
      document.removeEventListener('mousedown', handleClickOutside)
    }
  },[])

  return (
    <div className='w-full h-full relative'>
      <div className='w-full px-2 text-green-500'>Items ({holdItems.length})</div>
      <div className='h-full'>
        {holdItems.length <= 0? 
          (<div className='h-full text-gray-600 flex items-center justify-center'>No item found</div>):
          (<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-2 p-1'>
            {holdItems?.map((item)=>(
              <div key={item.item_id} 
              className='flex gap-2 items-center justify-center p-a' >
                  <button className='outline-none text-start w-full'
                    onClick={()=>(setViewDetailsModal(true), setItemToViewDetails(item.item_id))}>
                  <DevItemsCards item={item} />
                  </button>
                  <Trash2 onClick={()=>(setItemToDeleteId(item.item_id), deleteItem())} className='text-red-500 fill-red-500 hover:text-red-800 hover:fill-red-800  trannsition-all duration-100 ease-in-out ' />
              </div>
          ))}
          </div>)}
        </div>
        {viewDetailsModal && 
          <div className='h-screen w-screen z-50 fixed top-0 left-0 right-0 bottom-0 bg-black/70 flex items-center justify-center '>
              <div ref={detailsRef} className='bg-white p-8 shadow-lg h-[80%] space-y-5 w-[90%] rounded-xl md:p-4 lg:p-6 relative'>
                <div className='w-full absolute top-0 right-0 p-2 text-red-500 flex items-center justify-end'>
                  <XCircle className='cursor-pointer w-7 h-7' onClick={()=>(setViewDetailsModal(false))} />
                </div>
                <div className='overflow-y-auto h-full'>
                    <EditItem setViewDetailsModal={setViewDetailsModal} itemId={itemToViewDetails} />  
                </div>
              </div>
          </div>
        }
    </div>
  )
}

export default ListItems
