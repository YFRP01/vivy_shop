import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_URL } from '../api';

const Favourites = () => {

    const [itemArray, setItemArray] = useState([])
    const [infoArray, setInfoArray] = useState([])
    const [orderArray, setOrderArray] = useState([])
    const [id, setId] = useState('')

    const getAll = async()=>{
        try {
            const result = await axios.get(`${API_URL}/liked`)
            setItemArray(result.data)            
        } catch (error) {
            console.log(`Unable to get the liked items ${error.message}`);
        }
    }

    const getInfoWithId = async(info_id)=>{
        try {
            const res = await axios.get(`${API_URL}/infos/${info_id}`)
            setInfoArray(res.data)
            return res.data
        } catch (error) {
            console.log('Unable to fetch that info element '+error.message);
            
        }
    }

    const logFunc=(order, info)=>{

        
        if(order === null || order === undefined || !order){
        return `
            ***EMPTY***
            Order_Qty: ${info.qty};
            Cost: ${info.cost};
            Details: ${info.details};`
        }
        else{
            const array = getInfoWithId(order.info_id);
            return `Order_Qty: ${order.qty};
            Cost: ${array.cost};
            Details: ${array.details}; `
        } 
        
    }
    let sum = 0;
    itemArray.map((item)=>{
        
        let hold = `name: ${item.name};
            liked: ${item.liked};
            ;`
        if(item.order === null || item.order === undefined || !item.order){
            hold+=`
            ***EMPTY***
            Order_Qty: ${item.info.qty};
            Cost: ${item.info.cost};
            Details: ${item.info.details};`
        }
        else{
            setId(item.order.info_id)
            const array = getInfoWithId(id);
            hold+=`Order_Qty: ${array.qty};
            Cost: ${array.cost};
            Details: ${array.details}; `;
            
        }
        sum=sum+1
        // console.log(`Hold: ${hold}`);
        // console.log(logFunc(item.order, item.info))        
    })
    console.log(sum);

    useEffect(()=>{
        getAll()
    },[])
  return (
    <div className=''>
        <div className='flex flex-col overflow-x-auto w-full p-3'>
                <div className='flex w-full'>
                    <div className='w-full'>Name</div>
                    <div className='w-full'>Qty</div>
                    <div className='w-full'>Cost</div>
                    <div className='w-full'>Details</div>
                    <div className='w-full'>Liked</div>
                    
                </div>
                <div className='flex w-full gap-2 bg-red-500'>
                    {itemArray.map((i)=>(
                    <div key={i.item_id} className='border'>
                        <div className='border'>{i.name}</div>
                        {/* <div className='border'>{i.order !== null ? i.order.qty : 1}</div>
                        <div className='border'>{i.order !== null ? i.order.cost : (setId(i.order))}</div> */}
                        {/* <div className='border'>{i.order !=== null ? i.order.details : setId(i.or) }</div> */}
                        <div className='border'>{i.liked}</div>
                    </div>
                ))}
                </div>
        </div>
    </div>
  )
}

export default Favourites
