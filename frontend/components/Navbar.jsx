 import { Heart, Home, Menu, MenuIcon, PilcrowLeft, Plus, Search, X } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { API_URL } from '../api.js';
import axios from 'axios';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useNotifications } from '../components/context/NotificationsContext.jsx'

const Navbar = () => {

    const {likedCount, setLikedCount} = useNotifications()
    const [inputValue, setInputValue] = useState('')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [categories, setCategories] = useState([])
    const [searchParams, setsearchParams] = useSearchParams()
    const [placeholderValue, setPlaceholder] = useState('Search for an item ...')
    const navigate = useNavigate()
    const category = searchParams.get('category') || 'all';
    const [selectedCat, setSelectedCat] = useState(category)
    const location = useLocation()

    const handleCategory = (category)=>{
        setSelectedCat(category)
        setPlaceholder(`Category : ${category}`)
        setsearchParams({category:category})
        setIsMenuOpen(false)
        setsearchParams({category: category})
    }
    
    const handleSearch = (e)=>{
        if(e.key === 'Enter' && inputValue.trim()){
            console.log('Searching for: ', inputValue);
        }
    }

    const getAllCategories = async ()=>{
        try {
            const res = await axios.get(`${API_URL}/categories`);
            setCategories(res.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    const getLikedNotif = async()=>{
        try {
            const response = await axios.get(`${API_URL}/liked_notifications`)
            setLikedCount(parseInt(response.data[0]?.count || 0))
        } catch (error) {
            console.log(`Unable to get new liked notifications: ${error.message}`);         
        }
    }
    
    const deleteLikedNotif = async()=>{
        try {
            await axios.delete(`${API_URL}/liked_notifications`)
            setLikedCount(0)
        } catch (error) {
            console.log(`Unable to get new liked notifications: ${error.message}`);         
        }
    }

    
    useEffect(()=>{
         if (!searchParams.get('category')) {
            setsearchParams({ category: 'all' })
        }
        getAllCategories()
        getLikedNotif()
    },[])

    useEffect(()=>{
        let timer;
        if(location.pathname.includes('/favourites')){
            timer = setTimeout(()=>{ 
                deleteLikedNotif()
            }, 700)
        }
        return () =>{
            if(timer) clearTimeout(timer)
        }

    }, [location.pathname])
        
  return (
    <nav className='sticky top-0 left-0 right-0 flex gap-1 w-full z-60 bg-linear-to-b from-green-500 to-blue-500'>
        <div className='flex-1  px-10 py-2 bg-yellow-500'>
            <MenuIcon className='' size={20}/>
        </div>
        <div className='flex-3 flex flex-col py-1 items-center bg-red-500'>
            <h1 className='uppercase'>shoply</h1>
            <div className='w-full px-3'>
                <lable className={`bg-white rounded-2xl flex py-1 px-2 items-center group`}>
                    <Search size={16} className='focus:ring-2 focus:ring-blue-500 border-none focus:border focus:border-green-500 ' />
                    <input type='search' 
                    className='outline-none text-gray-500 text-sm md:text-md  px-3 py-1 w-full'
                    placeholder='Search for an item...'
                    onChange={(e)=>(setInputValue(e.target.value), handleSearch(e))} value={inputValue}
                    />               
                 </lable>
            </div>
        </div>
        <div className='flex-1 bg-orange-500'>

        </div>
    </nav>
)
}

export default Navbar








    // <nav className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-green-700 via-emerald-600 to-blue-600 shadow-lg">

//   {/* Top Row */}
//   <div className="flex items-center justify-between px-5 py-3">

//     {/* Left - Menu */}
//     <button
//       onClick={() => setIsMenuOpen(true)}
//       className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition backdrop-blur-md"
//     >
//       <Menu className="w-5 h-5 text-white" />
//     </button>

//     {/* Center - Logo */}
//     <div
//       onClick={() => navigate('/')}
//       className="cursor-pointer text-white font-extrabold tracking-wide text-xl"
//     >
//       SHOPLY
//     </div>

//     {/* Right - Favourites */}
//     <button
//       onClick={() => navigate('/favourites')}
//       className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition backdrop-blur-md"
//     >
//       <Heart className="w-5 h-5 text-white" />
//       {likedCount > 0 && (
//         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
//           {likedCount > 99 ? '99+' : likedCount}
//         </span>
//       )}
//     </button>

//   </div>

//   {/* Search Row */}
//   <div className="px-5 pb-4">
//     <div className="relative">
//       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

//       <input
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         onKeyDown={handleSearch}
//         placeholder={placeholderValue}
//         className="w-full pl-11 pr-10 py-2.5 rounded-2xl bg-white text-sm shadow-inner focus:ring-2 focus:ring-emerald-400 outline-none transition"
//       />

//       {inputValue && (
//         <button
//           onClick={() => setInputValue('')}
//           className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       )}
//     </div>
//   </div>

//   {/* Slide Menu Panel */}
//   <div
//     className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 z-50
//     ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
//   >
//     {/* Panel Header */}
//     <div className="flex justify-between items-center p-4 border-b">
//       <span className="font-semibold text-gray-700">Categories</span>
//       <button onClick={() => setIsMenuOpen(false)}>
//         <X className="w-5 h-5 text-gray-500" />
//       </button>
//     </div>

//     {/* Category List */}
//     <div className="overflow-y-auto h-full pb-20">
//       {categories.map((cat) => (
//         <div
//           key={cat.category_id}
//           onClick={() => handleCategory(cat.category_name)}
//           className={`px-5 py-3 text-sm cursor-pointer transition
//             ${selectedCat === cat.category_name
//               ? 'bg-emerald-100 text-emerald-700 font-medium'
//               : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           {cat.category_name}
//         </div>
//       ))}
//     </div>
//   </div>

//   {/* Overlay */}
//   {isMenuOpen && (
//     <div
//       onClick={() => setIsMenuOpen(false)}
//       className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
//     />
//   )}

// </nav>
