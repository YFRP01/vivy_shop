 import { AlertCircle, Boxes, Heart, Home, Menu, MenuIcon, PilcrowLeft, Plus, Search, Settings, ShoppingBag, User2, X } from 'lucide-react'
import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { API_URL } from '../api.js';
import axios from 'axios';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useNotifications } from '../components/context/NotificationsContext.jsx'
import PageTitle from './PageTitle.jsx';

const Navbar = () => {

    const menuRef = useRef()
    const {likedCount, setLikedCount} = useNotifications()
    const [inputValue, setInputValue] = useState('')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [categories, setCategories] = useState([])
    const [searchParams, setsearchParams] = useSearchParams()
    const [placeholderValue, setPlaceholder] = useState('Search for an item ...')
    const navigate = useNavigate()
    const category = searchParams.get('category') || 'all';
    const location = useLocation()

    const handleCategory = (category)=>{
        setPlaceholder(`> Category : ${category}`)
        setsearchParams({category:category})
        // setIsMenuOpen(false)
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

    useEffect(()=>{
        const handleRef = (e)=>{
            if(menuRef.current && !menuRef.current.contains(e.target)){
                setIsMenuOpen(false)
            }
        }
        window.addEventListener('mousedown', handleRef)
        return(()=>{
            window.removeEventListener('mousedown', handleRef)
        })
    },[])

        
  return (
    <nav className='sticky top-0 left-0 right-0 space-y-1 py-2 px-3 md:px-7 lg:px-10 w-full z-60 bg-slate-300'>
        
        {/* top */}
        <div className='flex w-full'>
            {/* left */}
            <div className='px-1 py-2 flex gap-4 '>
                <MenuIcon onClick={()=>(setIsMenuOpen(true))} className='fill-blue-500 cursor-pointer text-blue-500' size={30}/>
                <Settings onClick={()=>(navigate('/developer'))} size={30} className=' cursor-pointer rounded-full text-gray-500 fill-gray-500'/>
            </div>
            {/* center */}
            <div className='flex-1 flex items-center justify-center'>
                <h1 onClick={()=>(navigate('/'))} className='cursor-pointer uppercase flex-1 text-center '>shoply</h1>
            </div>
            {/* right */}
            <div className='px-1 py-2 flex gap-4'>
                <div onClick={()=>(navigate(`/favourites?category=${category}`))} className='flex justify-center items-center relative text-red-500'>
                    <Heart size={30} 
                    className={`cursor-pointer fill-red-500`}/>
                    <span className='absolute text-xs top-1.75 text-white'>{likedCount < 100 && likedCount}</span>
                </div>
                <Boxes onClick={()=>(navigate(`ordered?category=${category}`))} className='text-green-500 cursor-pointer' size={30}/>
            </div>
        </div>
            {/* input search */}
        <div className='w-full flex gap-4 h-full items-center xl:px-4 md:px-9 lg:px-13'>
            <label className={`bg-white flex-1 rounded-2xl flex py-1 px-4 items-center group`}>
                <Search size={16} className='' />
                <input type='text' 
                className='outline-none text-gray-500 text-sm md:text-md  px-3 py-1 w-full'
                placeholder={placeholderValue}
                onChange={(e)=>(setInputValue(e.target.value), handleSearch(e))} value={inputValue}
                />   
                <X className='' size={16}/>            
                </label>
            </div>

            
            {/* menu */}
            {isMenuOpen && (
            <div className={`fixed  bg-black/70 z-61 top-0 left-0 right-0 bottom-0 h-screen transition-all duration-200 ease-in`}>
                <div ref={menuRef} className={`border-r bg-white border-green-500 transform transition-transform ${isMenuOpen ? 'translate-y-0':'-translate-200'} duration-2000 ease-in h-full w-2/3 md:w-1/3 lg:w-1/4`}>
                    <div className='border-b border-blue-500 flex justify-between items-center px-2 py-2 text-blue-500 font-medium text-md md:text-lg'>
                        <span>Categories</span>
                        <X onClick={()=>(setIsMenuOpen(false))} size={20} className='text-red-500' />
                    </div>
                    {categories.length > 0 ? 
                        (
                            <div className='bg-linear-to-tr gap-1 capitalize text-sm md:text-md from-white to-green-50 flex flex-col h-full'>
                                <div onClick={()=>(handleCategory('all'))}
                                    className={`w-full px-2 hover:bg-gray-100 p-1 ${category === 'all' && 'bg-green-400 font-semibold text-green-900'}`}>
                                        all
                                </div>
                                {categories.map((cat)=>(
                                    <div key={cat.category_id} onClick={()=>(handleCategory(cat.category_name))}
                                    className={`w-full px-2 hover:bg-gray-100 p-1 ${category === cat.category_name && 'bg-green-400 font-semibold text-green-900'}`}>
                                        {cat.category_name}
                                    </div>
                                ))}
                            </div>
                        ):(
                            <div className=' h-full flex items-center justify-center text-gray-700 gap-1 text-center'>
                                <AlertCircle size={15} className={``} />
                                <span>No category found!</span>
                            </div>
                    )}
                </div>
            </div>
            )}

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
