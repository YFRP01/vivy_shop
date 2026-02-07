 import { Heart, Home, Menu, PilcrowLeft, Plus, Search, X } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { API_URL } from '../api.js';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';


const Navbar = () => {

    const [notification, setNotification] = useState(2);
    const [inputValue, setInputValue] = useState('')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [categories, setCategories] = useState([])
    const [searchParams, setsearchParams] = useSearchParams()
    const [placeholderValue, setPlaceholder] = useState('Search for an item ...')
    const navigate = useNavigate()

    const main = searchParams.get('main') || 'main';
    const category = searchParams.get('category') || 'all';

    const [selectedCat, setSelectedCat] = useState(category)
    
    const handleCategory = (category)=>{
        setSelectedCat(category)
        setPlaceholder(`Category : ${category}`)
        setsearchParams({main, category:category})
        console.log(`Main: ${main}    Category: ${category}`);
        
    }
    
    const handleSearch = ()=>{

    }

        useEffect(()=>(
            setsearchParams()
        ),[main, category])

    const getAllCategories = async ()=>{
        try {
            const res = await axios.get(`${API_URL}/categories`);
            setCategories(res.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
      getAllCategories();
    }, []);

    
  return (
    <nav className='fixed z-50 w-full top-0 left-0 right-0 transition-all duration-700 ease-in-out'>
        {/* Top nav */}
        <div className='sticky w-full flex items-center z-1 justify-between p-2 px-5 bg-[#066e3b]'>
            <div onClick={()=>(navigate(`/?main=${main}&category=${category}`))} className='flex items-center cursor-pointer gap-2.5 text-white font-bold text-2xl'>
                {/* <Home className='w-7 h-7 text-[#10b981]' /> */}
                <span>LOGO</span>
            </div>
            <div className='relative flex items-center group flex-1 p-2 px-5'>
               <div className='flex justify-center items-center w-full'>
                    <input
                    value={inputValue}
                    onChange={(e)=>(setInputValue(e.target.value))}
                    placeholder={placeholderValue}
                    onKeyDown={handleSearch(inputValue)}
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
                        {notification && (
                            <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] transition-all duration-700 ease-in rounded-full flex items-center justify-center'>
                            {notification > 99 ? (
                                <div className='flex gap-0.5 items-center justify-center'>
                                    <div className='bg-white rounded-full w-px h-px'/>
                                    <div className='bg-white rounded-full w-px h-px'/>
                                    <div className='bg-white rounded-full w-px h-px'/>
                                </div>
                            ) : `${notification}` }
                            </span>
                        )}
                </button>
                <button onClick={()=>(setIsMenuOpen(!isMenuOpen))} className='flex items-center justify-center relative rounded-full p-1 backdrop-blur-2xl hover:bg-green-900/30 transition-colors duration-150 ease-in'>
                    <Menu className='w-5 h-5 text-green-200'/>
                </button>

            </div>
        </div>

        {/* mobile menu */}
        <div className={`transform ${isMenuOpen ? 'translate-y-0': '-translate-y-120'} transition-all duration-700 ease-out`}>
        {isMenuOpen && (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4 py-3 bg-linear-to-b bg-green-700 backdrop-blur-sm border-t border-white/20'>
                {categories.map((category, index)=>(
                    <div key={index} onClick={()=>(handleCategory(category.value))}
                    className={`flex items-center space-x-3 p-3 rounded-xl justify-center transition-all duration-300 
                        ${ selectedCat === category.value
                            ? 'bg-white/30 text-white'
                            : 'bg-blue-500/50 text-white/90 hover:bg-white/20 border-b w-full text-start cursor-pointer'}`}>
                            {category.value}
                            {category.value.length > 25 && '...'}
                    </div>
                ))}
            </div>
        )}
        </div>
    </nav>
)
}

export default Navbar






































// import { HomeIcon, MenuIcon, Search, ShoppingBag, User, Heart, X, ChevronDown } from 'lucide-react'
// import React, { useState, useEffect } from 'react'

// const Navbar = () => {
//     const logoTite = 'VIVY Shop'
//     const [isMenuOpen, setMenuOpen] = useState(false)
//     const [selectedCat, setCat] = useState('home')
//     const [isScrolled, setIsScrolled] = useState(false)
//     const [searchQuery, setSearchQuery] = useState('')
    
//     const categories = [
//         {id:"1", value:"home", icon: HomeIcon, color: "text-blue-600"},
//         {id:"2", value:"electronics", icon: ShoppingBag, color: "text-green-600"},
//         {id:"3", value:"clothing", icon: User, color: "text-blue-500"},
//         {id:"4", value:"accessories", icon: Heart, color: "text-green-500"},
//         {id:"5", value:"books", icon: null, color: "text-blue-400"},
//         {id:"6", value:"beauty", icon: null, color: "text-green-400"},
//     ];

//     // Handle scroll effect
//     useEffect(() => {
//         const handleScroll = () => {
//             setIsScrolled(window.scrollY > 10)
//         }
//         window.addEventListener('scroll', handleScroll)
//         return () => window.removeEventListener('scroll', handleScroll)
//     }, [])

//     const handleToggle = (id) => {
//         const category = categories.find((cat) => cat.id === id)
//         if (category) {
//             setCat(category.value)
//             setMenuOpen(false)
//         }
//     }

//     const handleSearch = (e) => {
//         if (e.key === 'Enter' && searchQuery.trim()) {
//             console.log('Searching for:', searchQuery)
//             // Implement search functionality here
//         }
//     }

//     return (
//         <nav className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
//             isScrolled 
//                 ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 shadow-lg' 
//                 : 'bg-gradient-to-r from-blue-500 to-green-500'
//         }`}>
//             {/* Top Bar */}
//             <div className='px-4 lg:px-6 py-3'>
//                 <div className='flex items-center justify-between'>
//                     {/* Logo & Mobile Menu */}
//                     <div className='flex items-center space-x-4'>
//                         <div className='lg:hidden'>
//                             <button
//                                 onClick={() => setMenuOpen(!isMenuOpen)}
//                                 className='p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-300'
//                             >
//                                 {isMenuOpen ? (
//                                     <X className='w-5 h-5 text-white' />
//                                 ) : (
//                                     <MenuIcon className='w-5 h-5 text-white' />
//                                 )}
//                             </button>
//                         </div>
                        
//                         <div className='flex items-center space-x-2'>
//                             <div className='p-2 bg-white/20 rounded-lg'>
//                                 <HomeIcon className='w-5 h-5 text-white' />
//                             </div>
//                             <h1 className='text-xl font-bold text-white hidden sm:block'>{logoTite}</h1>
//                         </div>
//                     </div>

//                     {/* Desktop Categories */}
//                     <div className='hidden lg:flex items-center space-x-1'>
//                         {categories.slice(0, 4).map((cat) => (
//                             <button
//                                 key={cat.id}
//                                 onClick={() => handleToggle(cat.id)}
//                                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
//                                     selectedCat === cat.value
//                                         ? 'bg-white/30 text-white shadow-inner'
//                                         : 'text-white/90 hover:bg-white/20 hover:text-white'
//                                 }`}
//                             >
//                                 {cat.icon && <cat.icon className={`w-4 h-4 ${cat.color}`} />}
//                                 <span className='capitalize font-medium'>{cat.value}</span>
//                                 {selectedCat === cat.value && (
//                                     <div className='w-1 h-1 rounded-full bg-white ml-1'></div>
//                                 )}
//                             </button>
//                         ))}
//                         <button className='flex items-center space-x-1 px-3 py-2 text-white/90 hover:bg-white/20 rounded-lg transition-colors duration-300'>
//                             <span>More</span>
//                             <ChevronDown className='w-4 h-4' />
//                         </button>
//                     </div>

//                     {/* Search Bar */}
//                     <div className='flex-1 max-w-xl mx-4 lg:mx-8'>
//                         <div className='relative group'>
//                             <input
//                                 type='text'
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 onKeyDown={handleSearch}
//                                 placeholder='Search products, brands, and categories...'
//                                 className='w-full px-4 py-2 pl-12 pr-10 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 text-gray-800 placeholder-gray-500'
//                             />
//                             <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-600 transition-colors duration-300' />
//                             {searchQuery && (
//                                 <button
//                                     onClick={() => setSearchQuery('')}
//                                     className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-300'
//                                 >
//                                     <X className='w-3 h-3 text-gray-500' />
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     {/* User Actions */}
//                     <div className='flex items-center space-x-3'>
//                         <button className='flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors duration-300'>
//                             <Heart className='w-4 h-4' />
//                             <span className='font-medium'>Wishlist</span>
//                         </button>
//                         <button className='p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-300 relative'>
//                             <ShoppingBag className='w-5 h-5 text-white' />
//                             <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
//                                 3
//                             </span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile Menu */}
//             <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
//                 isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//             }`}>
//                 <div className='px-4 py-3 bg-linear-to-b from-blue-600/95 via-indigo-600 to-green-600/95 backdrop-blur-sm border-t border-white/20'>
//                     <div className='grid grid-cols-2 gap-2'>
//                         {categories.map((cat) => (
//                             <button
//                                 key={cat.id}
//                                 onClick={() => handleToggle(cat.id)}
//                                 className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
//                                     selectedCat === cat.value
//                                         ? 'bg-white/30 text-white shadow-inner'
//                                         : 'bg-white/10 text-white/90 hover:bg-white/20'
//                                 }`}
//                             >
//                                 {cat.icon && <cat.icon className={`w-5 h-5 ${cat.color}`} />}
//                                 <span className='capitalize font-medium'>{cat.value}</span>
//                             </button>
//                         ))}
//                     </div>
                    
//                     {/* Mobile Quick Actions */}
//                     <div className='mt-4 pt-4 border-t border-white/20 flex items-center justify-around'>
//                         <button className='flex flex-col items-center space-y-1 text-white/90 hover:text-white transition-colors duration-300'>
//                             <User className='w-5 h-5' />
//                             <span className='text-xs font-medium'>Account</span>
//                         </button>
//                         <button className='flex flex-col items-center space-y-1 text-white/90 hover:text-white transition-colors duration-300'>
//                             <Heart className='w-5 h-5' />
//                             <span className='text-xs font-medium'>Wishlist</span>
//                             <span className='absolute mt-6 ml-4 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
//                                 5
//                             </span>
//                         </button>
//                         <button className='flex flex-col items-center space-y-1 text-white/90 hover:text-white transition-colors duration-300'>
//                             <ShoppingBag className='w-5 h-5' />
//                             <span className='text-xs font-medium'>Cart</span>
//                             <span className='absolute mt-6 ml-4 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center'>
//                                 3
//                             </span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Selected Category Indicator */}
//             <div className='hidden lg:block bg-gradient-to-r from-blue-400/20 to-green-400/20'>
//                 <div className='px-6 py-2'>
//                     <div className='flex items-center space-x-4'>
//                         <span className='text-white/80 text-sm'>Selected:</span>
//                         <div className='flex items-center space-x-2 px-4 py-1.5 bg-white/20 rounded-full'>
//                             <span className='text-white font-semibold capitalize'>{selectedCat}</span>
//                             <div className='w-2 h-2 rounded-full bg-green-300 animate-pulse'></div>
//                         </div>
//                         <div className='text-white/60 text-sm'>
//                             {categories.find(c => c.value === selectedCat)?.icon && (
//                                 <>Browse amazing {selectedCat} products</>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     )
// }

// export default Navbar

