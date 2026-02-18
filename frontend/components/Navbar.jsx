 import { Heart, Home, Menu, PilcrowLeft, Plus, Search, X } from 'lucide-react'
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

//     <nav className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-green-700 via-emerald-600 to-blue-600 shadow-lg">

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

    <nav className='fixed z-50 w-full top-0 left-0 right-0 transition-all duration-700 ease-in-out'>
        {/* Top nav */}
        <div className='sticky w-full flex items-center z-1 justify-between p-2 px-5 bg-[#066e3b]'>
            <div onClick={()=>(navigate('/developer'))} /*onClick={()=>(navigate(`/?category=${category}`))}*/ className='flex items-center cursor-pointer gap-2.5 text-white font-bold text-2xl'>
                {/* <Home className='w-7 h-7 text-[#10b981]' /> */}
                <span>LOGO</span>
            </div>
            <div className='relative flex items-center group flex-1 p-2 px-5'>
               <div className='flex justify-center items-center w-full'>
                    <input
                    value={inputValue}
                    onChange={(e)=>(setInputValue(e.target.value))}
                    placeholder={placeholderValue}
                    onKeyDown={handleSearch}
                    className='bg-white px-9 py-2 text-sm rounded-full w-full focus:border border-[#04aaa4] focus:ring-2 focus:ring-[#13aaa3] outline-none ' />
                </div> 
                <button className='absolute left-8 text-gray-900/80 group-focus-within:text-gray-900/60 transition-colors duration-300 ease-out'>
                    <Search className='w-4 h-4' />
                </button>
                {inputValue && (
                    <button onClick={()=>(setInputValue(''))} className='absolute right-9 text-gray-900 group-focus-within:text-gray-900/70 transition-colors duration-300 ease-out'>
                        <X className='w-3 h-3'/>
                    </button>
                )}
            </div>
            <div className='bg-green-100/20 flex gap-2 items-center p-2 rounded-xl'>
                <button onClick={()=>(navigate('/favourites'))} className='p-1 relative rounded-full flex items-center justify-center backdrop-blur-2xl hover:bg-green-900/30 transition-colors duration-150 ease-in'>
                        <Heart className='w-5 h-5 text-green-200'/>
                        {likedCount > 0 && (
                            <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] transition-all duration-700 ease-in rounded-full flex items-center justify-center'>
                            {likedCount > 99 ? (
                                <div className='flex gap-0.5 items-center justify-center'>
                                    <div className='bg-white rounded-full w-px h-px'/>
                                    <div className='bg-white rounded-full w-px h-px'/>
                                    <div className='bg-white rounded-full w-px h-px'/>
                                </div>
                            ) : `${likedCount}` }
                            </span>
                        )}
                </button>
                <button onClick={()=>(setIsMenuOpen(!isMenuOpen))} className={`${location.pathname.includes('item')? 'hidden' : 'block'} flex items-center justify-center relative rounded-full p-1 backdrop-blur-2xl hover:bg-green-900/30 transition-colors duration-300 ease-in`}>
                    <Menu className='w-5 h-5 text-green-200'/>
                </button>
            </div>
        </div>

        {/* mobile menu */}
        <div className={`transform ${isMenuOpen ? 'translate-y-0': '-translate-y-120'} transition-all duration-700 ease-in-out`}>
        {isMenuOpen && (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4 py-3 bg-linear-to-b bg-green-700 backdrop-blur-sm border-t border-white/20'>
                {categories.map((category)=>(
                    <div key={category.category_id} onClick={()=>(handleCategory(category.category_name))}
                    className={`flex items-center space-x-3 p-3 rounded-xl justify-center transition-all duration-300 
                        ${ selectedCat === category.category_name
                            ? 'bg-white/30 text-white'
                            : 'bg-blue-500/50 text-white/90 hover:bg-white/20 border-b w-full text-start cursor-pointer'}`}>
                            {category.category_name}
                            {category.category_name.length > 25 && '...'}
                    </div>
                ))}
            </div>
        )}
        </div>
    </nav>
)
}

export default Navbar







