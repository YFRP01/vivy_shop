import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../../api'
import DevItemsCards from '../../components/cards/DevItemsCards'
import { Delete, Trash, Trash2 } from 'lucide-react'
import EditItem from '../../components/EditItem'

const ListItems = () => {

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

  return (
    <div className='w-full h-full'>
      <div className='w-full px-2 text-green-500'>Items ({holdItems.length})</div>
      <div className='h-full'>
        {holdItems.length <= 0? 
          (<div className='h-full text-gray-600 flex items-center justify-center'>No item found</div>):
          (<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-2 p-1'>
            {holdItems?.map((item)=>(
              <div key={item.item_id} 
              className='flex gap-2 items-center justify-center p-a' >
                  <DevItemsCards onClick={()=>(setViewDetailsModal(true), setItemToViewDetails(item.item_id))} item={item} />
                  <Trash2 onClick={()=>(setItemToDeleteId(item.item_id), deleteItem())} className='text-red-500 fill-red-500 hover:text-red-800 hover:fill-red-800  trannsition-all duration-100 ease-in-out ' />
              </div>
          ))}
          </div>)}
        </div>
        {viewDetailsModal && <EditItem setViewDetailsModal={setViewDetailsModal} itemId={itemToViewDetails} />}
    </div>
  )
}

export default ListItems
