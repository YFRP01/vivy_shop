import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api.js';
import { useSearchParams } from 'react-router-dom';
import CategoryCard from '../components/cards/CategoryCard.jsx';
import ItemCards from '../components/cards/ItemCards.jsx';

const Home = () => {

    const [categories, setCategories] = useState([])
    const [items, setItems] = useState([]);
    const [searchParams] = useSearchParams()
    const category = searchParams.get('category') || 'all';
    const amountDisplayedQty = 10;
    const startIndex = 0;
    const [endIndexValue, setEndIndexValue] = useState(amountDisplayedQty)

       
    const getItems = async () => {
        try {
            const res = await axios.get(`${API_URL}/items/?category=${category}`)
            setItems(res.data)
        } catch (error) {
            console.log(error.message)
        }
    };

    const getAllCategories = async ()=>{
        try {
            const res = await axios.get(`${API_URL}/categories`);
            setCategories(res.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDisplay = ()=>{
        if(endIndexValue+1 < items.length){
        setEndIndexValue(endIndexValue+amountDisplayedQty)
        }
        else return
    }
    
    useEffect(()=>{
        getItems()
        getAllCategories()
    }, [category])

  return (
    <div className='flex flex-col gap-5 p-1'>
        <div className='flex flex-col w-full h-full bg-white'>
            <div className='w-full px-5 shadow py-1 bg-gray-100 text-lg  font-sans'>Categories ({categories.length})</div>
            <div className='flex bg-white px-5 overflow-x-scroll h-60 items-center gap-2'>
                {categories.map((cat)=>(
                    <div key={cat.category_id} className=''>
                        <CategoryCard cat={cat} />
                    </div>
                ))}
            </div>
        </div>
        <div className='w-full px-2 md:px-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center gap-2'>
        {items.slice(startIndex, endIndexValue).map((item)=>(
            <div key={item.item_id} className=''>
                <ItemCards item={item}/>
            </div>
        ))}
        </div>
        <div className={`${items.length > amountDisplayedQty ? 'block':'hidden'} cursor-pointer flex items-center justify-center w-full text-gray-700 `}>
            <div className='bg-white rounded text-sm p-1 border border-gray-700'>
                <p onClick={()=>(handleDisplay())} className={`${endIndexValue < items.length? 'block':'hidden'}`}>See more ...</p>
                <p onClick={()=>(setEndIndexValue(amountDisplayedQty))} className={`${endIndexValue >= items.length ? 'block':'hidden'}`}>See less</p>
            </div>
        </div>
    </div>
  )
}

    

export default Home;
