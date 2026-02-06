import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const CategoryCard = ({cat}) => {

    const [searchParams, setsearchParams] = useSearchParams();
    const main = searchParams.get('main') || 'main';
    const category = searchParams.get('category') || 'all';

    const handleClick = (main, category)=>{
        if(cat.value === category){
            setsearchParams({main, category:'all'})
        }
        else{
          setsearchParams({main, category:cat.value})
        }
    }
    useEffect(()=>(
        setsearchParams({main, category})
    ),[main, category])

  return (
    <div onClick={()=>(handleClick(main, category))} className={`flex flex-col hover:scale-102 ${category === cat.value && 'border-2 scale-102 border-green-500'} h-45 w-35 md:w-42 rounded-2xl bg-black/20`}>
        <div className='flex-3 flex border-b border-gray-500'>
            <img src={cat.image} alt={`${cat.value} image`} className='object-cover bg-gray-400 rounded-t-2xl text-sm md:text-md text-gray-500 flex items-center justify-center text-center w-full h-full' />
        </div>
        <div className='flex-1 flex w-full text-sm font-normal justify-center items-center'>{cat.value}</div>
    </div>
  )
}

export default CategoryCard
