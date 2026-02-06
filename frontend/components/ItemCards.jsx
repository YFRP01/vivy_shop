import React, { useState } from 'react'
import { exchangeRate } from '../src/assets/assets'
import { Heart, HeartCrack, JapaneseYen, Tag } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '../api'
import { useNavigate } from 'react-router-dom'

const ItemCards = ({item}) => {

    const [editLike, setEditLike] = useState(item.liked)
    const navigate = useNavigate()

    const getCategoryColor = (category) => {
    const colors = {
      "health": 'from-blue-500 to-blue-600',
      "automotive": 'from-emerald-500 to-teal-600',
      "food - bakery": 'from-amber-500 to-orange-600',
      "food - meats": 'from-pink-500 to-rose-600',
      "food - frozen": 'from-indigo-500 to-purple-600',
      "food - snacks": 'from-red-500 to-orange-600',
      default: 'from-gray-500 to-gray-700'
    }
    const categoryKey = category?.toLowerCase() || 'default'
    return colors[categoryKey] || colors.default
  }

    const editItem = async () =>{
        try {
            const res = await axios.put(`${API_URL}/liked/${item.item_id}`,{
                liked: editLike
            })
            setEditLike(res.data.liked)
            console.log(`Like status: ${res.data}`)
        } catch (error) {
            console.log(`Unable to Like/Unlike the item: ${error.message}`)
        }
    }

    const formatPrice = (price) => {
    return (price * exchangeRate).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}

    return (
      <div className='flex overflow-hidden cursor-pointer hover:scale-101 w-full flex-col h-83 relative bg-white shadow-md hover:shadow-lg transition shadow-all duration-300 p-1 rounded-xl'>
        {/* <p className='absolute overflow-hidden bg-orange-100 h-5 leading-5 max-w-30 text-end rounded-l-full text-xs px-2 flex flex-wrap items-center justify-end right-0 top-3 text-orange-500'>
            {item.category.slice(0,14)}
            {item.category.length > 17 && '...'}
        </p> */}

        <div className="absolute top-3 right-3 z-1">
        <div className={`flex items-center gap-1 bg-linear-to-r ${getCategoryColor(item.category)} text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm`}>
          <Tag className="w-3 h-3" />
          <span className="max-w-24 truncate">
            {item.category || 'General'}
          </span>
        </div>
      </div>

        <div className='bg-[#e1e5e9] relative w-full flex-2 flex items-center justify-center text-xs text-black/40 rounded-xl'>
            <img onClick={()=>(navigate(`/item/${item.item_id}`))} src={item.thumbnail} alt={item.name +' image'} className='object-cover w-full flex items-center justify-center h-full transition all duration-200 px-5'/>
           <button onClick={()=>(editItem())} className='absolute -bottom-4 right-2'>
                {editLike ?(<Heart className='w-10 h-10 text-red-500 fill-red-500 transition-colors duration-100 ease-in-out'/>):((<Heart className='w-10 h-10 fill-gray-500 text-gray-500 transition-colors duration-100 ease-in-out' />))}
            </button>
        </div>
        <div onClick={()=>(navigate(`/item/${item.item_id}`))} className='flex-1 px-2 mt-4 relative'>
            <div className='p-1 break-all'>
                <h1 className='font-semibold flex flex-wrap text-base md:text-md text-black leading-tight'>{item.name.slice(0,39)}{item.name.length > 39 && '...'}</h1>
                <p className='text-sm md:text-md text-[#374151] font-normal leading-snug line-clamp-2'>{item.info.details.slice(0,70)}{item.info.details.length > 70 && '...'}</p>
            </div>
        <div className='h-fit flex items-end'>
            <div className='flex gap-0 md:gap-1 overflow-hidden items-center flex-wrap break-all font-sans text-sm text-[#0f172a] font-medium'>
                <span className='flex items-center px-2'>
                    <span className='text-md md:text-lg font-bold'>{formatPrice(item.info.cost)}</span>
                    <JapaneseYen className='w-4 h-4' /> 
                </span>
                <span>/</span>
                <span className='flex'>{item.info.qty} commande{item.info.qty && 's'}</span>
            </div>
        </div>
        </div>
    </div>
  )
}

export default ItemCards