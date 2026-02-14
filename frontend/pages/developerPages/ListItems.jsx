import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../../api'
import DevItemsCards from '../../components/cards/DevItemsCards'
import { Delete, Trash, Trash2 } from 'lucide-react'

const ListItems = () => {

  const [holdItems, setHoldItems] = useState([])

  const getItems = async()=>{
    try {
      const response = await axios.get(`${API_URL}/items/developer?category=all`)
      setHoldItems(response.data)
    } catch (error) {
      console.log(`Unable to get the saved items ${error.message}`);
    }
  }
  
  useEffect(()=>{
    getItems()
  },[])

  return (
    <div className='w-full h-full'>
      <div className='w-full px-2 text-green-500'>Items ({holdItems.length})</div>
      <div className='h-full'>
        {!holdItems? 
          (<div className='h-full text-gray-600 flex items-center justify-center'>No item found</div>):
          (<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-2 p-1'>
            {holdItems?.map((item)=>(
                <div key={item.item_id} className='flex gap-2 items-center justify-center p-a' >
                    <DevItemsCards item={item} />
                    <Trash2 className='text-red-500 fill-red-500' />
                </div>
          ))}
          </div>)}
        </div>
    </div>
  )
}

export default ListItems
