import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCards from '../components/ItemCards';
// import { API_URL } from '../api.js';

const Home = () => {
    const [items, setItems] = useState([]);
    const main = 'main';
    const category = 'all';
    const API_URL ='http://localhost:5001/api';

    const getItems = async () => {
        try {
            const res = await axios.get(`${API_URL}/items/?main=${main}&category=${category}`)
            setItems(res.data)
        } catch (error) {
            console.log(error.message)
        }
    };

    useEffect(()=>{
        getItems();
    }, [])

  return (
    <div className='h-100 w-screen flex space-5'>
        <div className='w-full grid grid-cols-3 gap-4'>
        {/* {items.map((item)=>(
            <div key={item.item_id} className='bg-red-500'>
                <ItemCards item={item.thumbnail}/>
            </div>
        ))} */}
        </div>
    </div>
  )
}

    

export default Home;


// import React from 'react'
// import axios from 'axios'
// import { API_URL } from '../api.js';
// import { useState } from 'react';
// import { useEffect } from 'react';

// const Home = () => {
    
//     const [items,setItems] = useState([]);
//     const main='main';
//     const category = 'all';

//     const getItems = async ()=>{
//         try {
//             const res = await axios.get(`${API_URL}/items/?main=${main}&category=${category}`)
//             setItems(res.data)
//         } catch (error) {
//             console.log(error.message)
//         }
//     }
//     useEffect(()=>{
//         getItems();
//     }, [])

//   return (
//     <div className='h-100 w-screen flex space-5'>
//       {items.map((i)=>{
//         <div key={i.item_id} className='w-20 h-20 bg-orange-500'>
//             <p>{i.name}</p>
//         </div>
//       })}
//     </div>
//   )
// }

// export default Home


// const getItems = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get(`${API_URL}/items/?main=${main}&category=${category}`);
            
//             // ✅ Ensure items is always an array
//             if (Array.isArray(res.data)) {
//                 setItems(res.data);
//             } else if (res.data && Array.isArray(res.data.items)) {
//                 // If response has nested items array
//                 setItems(res.data.items);
//             } else if (res.data && typeof res.data === 'object') {
//                 // If response is a single object, wrap in array
//                 setItems([res.data]);
//             } else {
//                 setItems([]); // Default to empty array
//             }
            
//             setError(null);
//         } catch (error) {
//             console.log('Error fetching items:', error.message);
//             setError('Failed to load items');
//             setItems([]); // Set to empty array on error
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getItems();
//     }, []);

//     return (
//         <div className='h-screen w-screen flex flex-wrap gap-5 p-5'>
//             {loading ? (
//                 <div className='flex items-center justify-center w-full h-full'>
//                     <p className='text-gray-600'>Loading items...</p>
//                 </div>
//             ) : error ? (
//                 <div className='flex items-center justify-center w-full h-full'>
//                     <p className='text-red-500'>{error}</p>
//                 </div>
//             ) : items.length === 0 ? (
//                 <div className='flex items-center justify-center w-full h-full'>
//                     <p className='text-gray-600'>No items found</p>
//                 </div>
//             ) : (
//                 // ✅ Fixed: Added return statement
//                 items.map((item) => (
//                     <div key={item.item_id} className='w-48 h-48 bg-orange-500 rounded-lg shadow p-4 flex flex-col items-center justify-center'>
//                         <p className='text-white font-semibold text-center'>
//                             {item.name || 'No Name'} {console.log(item)}</p>
//                         <p className='text-red-500'>{item.category}</p>
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// };