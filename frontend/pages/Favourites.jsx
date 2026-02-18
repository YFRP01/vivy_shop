import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_URL } from '../api';
import { useSearchParams } from 'react-router-dom';
import ViewMore from '../components/ViewMore';
import { Heart, Verified } from 'lucide-react';


const Favourites = () => {
    
    const [searchParams] = useSearchParams()
    let category = searchParams.get('category') || 'all';
    const [itemArray, setItemArray] = useState([])
    const [viewId, setViewId] = useState(null)
    const [viewItem, setViewItem] = useState({})

    // setCategory(searchParams.get('category'))
    const getLikedItem = async()=>{
        try {
            const result = await axios.get(`${API_URL}/liked/?category=${category}`)
            setItemArray(result.data) 
        } catch (error) {
            console.log(`Unable to get the liked items ${error.message}`);
        }
    }

    const [liking, setLiking] = useState(false)
    const [viewDetails, setViewDetails] = useState(false)   
    
    const editLike = async ()=>{
        console.log(liking);
        {console.log(`i.item_id: ${viewId}, i.item.liked: ${liking}`)}
        try {
            const result = await axios.put(`${API_URL}/liked/${viewId}`,{
                liked: liking
            })           
            setLiking(result.data.liked)
        } catch (error) {
            console.log(error.message);
        }
    }
    

    useEffect(()=>{
        getLikedItem()
    },[category])


    return(
        <div>
            <div className='w-full flex flex-col gap-2 overflow-x-auto'>
            {itemArray.length === 0 ? 
            (<div className='w-full h-full text-gray-600 py-80 absolute flex items-center justify-center'>No liked element found for the category "{category}".</div>)
            :
            (
                <div>
                    <div className='w-full flex flex-col gap-2 overflow-x-auto'>
                    {itemArray.length === 0 ? 
                    (<div className='w-full h-full text-gray-600 py-80 absolute flex items-center justify-center'>No liked element found for the category "{category}".</div>):
                    (
                    <table className='w-full border text-sm md:text-base'>
                        <thead>
                            <tr className='bg-blue-200'>
                                <th className='border p-1'>SN</th>
                                <th className='border p-1'>Name</th>
                                <th className='border p-1'>Category</th>
                                <th className='border p-1'>Description</th>
                                <th className='border p-1'>Details</th>
                                <th className='border p-1'>Qty</th>
                                <th className='border p-1'>Cost</th>
                                <th className='border p-1'>Status</th>
                                <th className='border p-1'>Like</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemArray.map((i, index)=>(
                                <tr key={i.item_id} 
                                    className='border cursor-pointer hover:bg-gray-50'>
                                    <td onClick={()=>(setViewId(i.item.item_id), setViewItem(i.item), setViewDetails(!viewDetails))} className='border p-1 text-center'>{index+1}</td>
                                    <td onClick={()=>(setViewId(i.item.item_id), setViewItem(i.item), setViewDetails(!viewDetails))} className='border p-1'>{i.item?.name}</td>
                                    <td onClick={()=>(setViewId(i.item.item_id), setViewItem(i.item), setViewDetails(!viewDetails))} className='border p-1 text-center'>{i.item?.category}</td>
                                    <td onClick={()=>(setViewId(i.item.item_id), setViewItem(i.item), setViewDetails(!viewDetails))} className='border p-1 text-center'>{i.item?.description?.length > 50 ? i.item?.description?.slice(0, 50) + '...' : i.item?.description}</td>
                                    <td onClick={()=>(setViewId(i.item.item_id), setViewItem(i.item), setViewDetails(!viewDetails))} className='border p-1 text-center'>{i.info?.details}</td>
                                    <td onClick={()=>(setViewId(i.item.item_id), setViewItem(i.item), setViewDetails(!viewDetails))} className='border p-1 text-center'>{i.info?.qty}</td> 
                                    <td onClick={()=>(setViewId(i.item.item_id), setViewItem(i.item), setViewDetails(!viewDetails))} className='border p-1 text-center'>{i.info?.cost}</td>
                                    <td onClick={()=>(setViewId(i.item.item_id), setViewItem(i.item), setViewDetails(!viewDetails))}
                                     className='border p-1 text-center'>{i.order_status? 
                                        (<Verified size={17} className='fill-green-500 w-full text-white'/>):(<Verified size={17} className='fill-orange-500 w-full text-white'/>)}
                                    </td>
                                    <td onClick={()=>(setViewId(i.item.item_id), editLike())}className='border p-1 text-center' >
                                        {i.item.liked ? 
                                        (<Heart size={50} className='fill-red-500 text-red-500'/>)
                                        :
                                        (<Heart size={50} className='fill-gray-600  text-gray-600'/>)}
                                    </td>
                                    {viewDetails && <ViewMore viewId={viewId} editLike={editLike} item={viewItem} like={liking} isView={viewDetails} setIsView={setViewDetails} info={i.info} order_status={i.order_status} viewDetails={viewDetails} setViewDetails={setViewDetails} />}
                                </tr>
                            ))}
                        </tbody>
                    </table>)}
            </div>
            </div>)}
        </div>
        </div>
    )
}

export default Favourites;
