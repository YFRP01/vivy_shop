import axios from 'axios';
import React, { useState } from 'react'
import { API_URL } from '../../api';
import { Heart, Verified } from 'lucide-react';
import ViewMore from '../ViewMore';

const FavRowDisplay = ({item, info, order_status}) => {
    const [like, setLike] = useState(item.liked)
    const [viewDetails, setViewDetails] = useState(false)

    const editLike = async ()=>{
        try {
            const result = await axios.put(`${API_URL}/liked/${item.item_id}`,{
                liked: like
            })
            setLike(result.data.liked)
        } catch (error) {
            console.log(error.message);
        }
    }
    
  return (
    <div>
        <div className='flex'>
            <div onClick={()=>(setViewDetails(!viewDetails))} className={`flex cursor-pointer`} >
                <div className='border flex justify-center items-center p-1 flex-2 '>{item.name}</div>
                <div className='border flex justify-center items-center'>{item.category}</div>
                <div className='border flex justify-center items-center p-1 flex-4 '>{info.details}</div>
                <div className='border flex justify-center items-center p-1 flex-1 '>{info.qty}</div>
                <div className='border flex justify-center items-center p-1 flex-1 '>{info.cost}</div>
                <div className='border flex justify-center items-center p-1 flex-1'>{order_status? 
            (<Verified size={17} className='fill-green-500 text-white'/>):(<Verified size={17} className='fill-red-500 text-white'/>)}</div>
            </div>
            <button className='border z-10 flex justify-center items-center p-1 flex-1 ' >
                {like ? 
                (<Heart className='fill-red-500 text-red-500' onClick={()=>(editLike())}/>)
                :
                (<Heart className='fill-gray-600 text-gray-600' onClick={()=>(editLike())}/>)}
            </button> 
        </div>
        <div className={`${viewDetails ? 'block':'hidden'}`}>
            <ViewMore item={item} info={info} order_status={order_status} editLike={editLike} like={like} isView={viewDetails} setIsView={setViewDetails} />
        </div>
    </div>
  )
}


export default FavRowDisplay
