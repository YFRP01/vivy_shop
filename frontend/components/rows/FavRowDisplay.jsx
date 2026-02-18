import axios from 'axios';
import React, { useState } from 'react'
import { API_URL } from '../../api';
import { Heart, Verified } from 'lucide-react';

const FavRowDisplay = ({viewID, index, item, info, order_status}) => {
    const [liking, setLiking] = useState(item.liked)

    const editLike = async ()=>{
        try {
            const result = await axios.put(`${API_URL}/liked/${viewID}`,{
                liked: !liking
            })
            setLiking(result.data.liked)
        } catch (error) {
            console.log(error.message);
        }
    }

    
  return (
    <>
        <td className='border p-1 text-center'>{index+1}</td>
        <td className='border p-1'>{item?.name}</td>
        <td className='border p-1 text-center'>{item?.category}</td>
        <td className='border p-1 text-center'>{item?.description?.length > 50 ? item?.description?.slice(0, 50) + '...' : item?.description}</td>
        <td className='border p-1 text-center'>{info?.details}</td>
        <td className='border p-1 text-center'>{info?.qty}</td> 
        <td className='border p-1 text-center'>{info?.cost}</td>
        <td className='border p-1 text-center'>{order_status? 
            (<Verified size={17} className='fill-green-500 w-full text-white'/>):(<Verified size={17} className='fill-orange-500 w-full text-white'/>)}
        </td>
        <td className='border p-1 text-center' >
            {liking ? 
            (<Heart className='fill-red-500 text-red-500 cursor-pointer' onClick={()=>(editLike())}/>)
            :
            (<Heart className='fill-gray-600 text-gray-600 cursor-pointer' onClick={()=>(editLike())}/>)}
        </td>
    </>
  )
}


export default FavRowDisplay
