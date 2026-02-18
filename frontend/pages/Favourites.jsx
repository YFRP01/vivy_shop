import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_URL } from '../api';
import FavRowDisplay from '../components/rows/FavRowDisplay';
import { useSearchParams } from 'react-router-dom';
import ViewMore from '../components/ViewMore';


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

    const [like, setLike] = useState(null)
    const [viewDetails, setViewDetails] = useState(false)

    const editLike = async (i)=>{
        try {
            const result = await axios.put(`${API_URL}/liked/${i}`,{
                liked: like
            })
            setLike(result.data.liked)
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
                        <thead className='bg-gray-100'>
                            <tr>
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
                                <tr key={i.item_id} onClick={()=>(setViewId(i.item.item_id), setViewItem(i.item), setViewDetails(!viewDetails))} 
                                className='border cursor-pointer hover:bg-gray-50'>
                                    <FavRowDisplay viewId={viewId} setViewDetails={setViewDetails} viewDetails={viewDetails} index={index} item={i.item} info={i.info} order_status={i.order_status}/>
                                    {viewDetails && <ViewMore viewId={viewId} editLike={editLike} item={viewItem} like={like} isView={viewDetails} setIsView={setViewDetails} info={i.info} order_status={i.order_status} viewDetails={viewDetails} setViewDetails={setViewDetails} />}
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
