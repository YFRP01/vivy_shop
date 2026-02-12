import axios from 'axios';
import React, { useState } from 'react'
import { API_URL } from '../../api';
import { Edit, Heart, Verified, X } from 'lucide-react';
import ViewMore from '../ViewMore';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationsContext';

const OrderedRowDisplay = ({item, info, order_id, category, orderItems}) => {

    const {setLikedCount} = useNotifications()
    const navigate = useNavigate()
    const [like, setLike] = useState(item.liked)
    const [viewDetails, setViewDetails] = useState(false)


    const editLike = async ()=>{
        try {
            const result = await axios.put(`${API_URL}/liked/${item.item_id}`,{
                liked: like
            })
            setLike(result.data.liked)
            const globalLikedNotif = await axios.get(`${API_URL}/liked_notifications`)
            setLikedCount(globalLikedNotif.data[0]?.count || 0)
        } catch (error) {
            console.log(error.message);
        }
    }

    const cancelOrder = async ()=>{
      try {
        await axios.delete(`${API_URL}/orders/${order_id}`)
        console.log('successfully deleted');
        if(orderItems) orderItems()
      } catch (error) {
        console.log(`Unable to cancel the order: ${error.message}`);
        
      }
    }

    
  return (
    <div>
        <div className='flex w-full'>
            <div className='border flex justify-center items-center p-1 flex-2'>
              <button className='z-10 flex justify-center items-center p-1 flex-1 ' >
              {like ? 
              (<Heart className='fill-red-500 text-red-500' onClick={()=>(editLike())}/>)
              :
              (<Heart className='fill-gray-600 text-gray-600' onClick={()=>(editLike())}/>)}
            </button>
            </div>
            <div onClick={()=>(setViewDetails(!viewDetails))} className={`flex cursor-pointer`} >
                <div className='border flex justify-center items-center p-1 flex-2 '>{item.name}</div>
                <div className='border flex justify-center items-center'>{item.category}</div>
                <div className='border flex justify-center items-center p-1 flex-4 '>{item.description}</div>
                <div className='border flex justify-center items-center p-1 flex-4 '>{info.details}</div>
                <div className='border flex justify-center items-center p-1 flex-1 '>{info.qty}</div>
                <div className='border flex justify-center items-center p-1 flex-1 '>{info.cost}</div>
            </div>
            <div className='border flex justify-center items-center p-1 flex-1 '>
              <Edit onClick={()=>(navigate(`/item/${item.item_id}`))} size={17} />
            </div>
            <div className='border flex justify-center items-center p-1 flex-1 '>
              <X onClick={()=>(cancelOrder())} size={17} className='text-red-500'/>
            </div>

        </div>
        <div className={`${viewDetails ? 'block':'hidden'}`}>
            <ViewMore item={item} info={info} order_status={true} editLike={editLike} like={like} isView={viewDetails} setIsView={setViewDetails} />
        </div>
    </div>
  )
}

export default OrderedRowDisplay
