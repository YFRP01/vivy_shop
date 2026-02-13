import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { API_URL } from '../api';
import FavRowDisplay from '../components/rows/FavRowDisplay';
import OrderedRowDisplay from '../components/rows/OrderedRowDisplay';

const Ordered = () => {
  
    const [searchParams] = useSearchParams()
    let category = searchParams.get('category') || 'all';
    const [itemArray, setItemArray] = useState([])

    // setCategory(searchParams.get('category'))
    const getOrderedsItem = async()=>{
        try {
            const result = await axios.get(`${API_URL}/orders/?category=${category}`)
            setItemArray(result.data) 
        } catch (error) {
            console.log(`Unable to get the liked items ${error.message}`);
        }
    }
    
    useEffect(()=>{
        getOrderedsItem()
    },[category])


    return(
        <div>
            <div className='w-full flex flex-col gap-2 overflow-x-auto'>
            {itemArray.length === 0 ? 
            (<div className='w-full h-full text-gray-600 py-80 absolute flex items-center justify-center'>No order found for the category "{category}".</div>)
            :
            (itemArray.map((i, index)=>(
                <div key={index} className='flex bg-gray-400 border'>
                    <div className='border flex items-center justify-center p-1'>{index+1}</div>
                    <OrderedRowDisplay item={i.item} info={i.info} order_id={i.order_id} category={category} orderItems={getOrderedsItem} />
                </div>
            )))}
        </div>

        </div>
    )
}

export default Ordered
