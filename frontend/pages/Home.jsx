import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCards from '../components/ItemCards';
import { API_URL } from '../api.js';
import { useSearchParams } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard.jsx';

const Home = () => {

    const [categories, setCategories] = useState([])
    const [items, setItems] = useState([]);
    const [searchParams] = useSearchParams()
    const main = searchParams.get('main') || 'main';
    const category = searchParams.get('category') || 'all';
    

    const getItems = async () => {
        try {
            const res = await axios.get(`${API_URL}/items/?main=${main}&category=${category}`)
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

    useEffect(()=>{
        getItems();
        getAllCategories();
    }, [main, category])

  return (
    <div className='flex flex-col gap-5 p-1'>
        <div className='flex flex-col w-full h-full bg-white'>
            <div className='w-full px-5 shadow py-1 bg-gray-100 text-lg  font-sans'>Categories ({categories.length})</div>
            <div className='flex bg-white px-5 overflow-x-scroll h-60 items-center gap-2'>
                {categories.map((cat, index)=>(
                    <div key={index} className=''>
                        <CategoryCard cat={cat} />
                    </div>
                ))}
            </div>
        </div>
        <div className='w-full px-2 md:px-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center gap-2'>
        {items.map((item)=>(
            <div key={item.item_id} className=''>
                <ItemCards item={item}/>
            </div>
        ))}
        </div>
    </div>
  )
}

    

export default Home;




// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import ItemCards from '../components/ItemCards'
// import { API_URL } from '../api.js'
// import { useSearchParams } from 'react-router-dom'

// const Home = () => {
//   const [items, setItems] = useState([])
//   const [searchParams] = useSearchParams()

//   const main = searchParams.get('main') || 'main'
//   const category = searchParams.get('category') || 'all'

//   const getItems = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/items/?main=${main}&category=${category}`)
//       setItems(res.data)
//     } catch (error) {
//       console.log(error.message)
//     }
//   }

//   useEffect(() => {
//     getItems()
//   }, [main, category])

//   return (
//     <div className="pt-24 flex space-y-5">
//       <div className="w-full px-4 md:px-10 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {items.map((item) => (
//           <div key={item.item_id}>
//             <ItemCards item={item} />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default Home

