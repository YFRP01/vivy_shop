import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { API_URL } from '../../api'
import axios from 'axios'
import { Edit2Icon, Eye } from 'lucide-react'

const ListCats = () => {

    const [searchParams] = useSearchParams()
    const [mainHold, setMainHold] = useState([])
    const category = searchParams.get('category') || 'all';
    const getAll = async()=>{
        try {
            const response = await axios.get(`${API_URL}/categories/developer?category=${category}`)
            setMainHold(response.data)
        } catch (error) {
            console.log(`Unable to get the saved items ${error.message}`);
        }
    }

    useEffect(()=>{
        getAll()
    }, [])

  return (
    <div>
        <p className='text-blue-500'>Available categories (<span className='text-green-500'>{mainHold.length}</span>)</p>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
            {mainHold?.map((i)=>(
                <div key={i.category_id} className='flex items-center shadow justify-center gap-2 border border-gray-200 rounded-md p-2'>
                    <div className='flex-1 h-full'>
                        <p className='font-medium'>{i.category_name}</p>
                        <div className='flex flex-col justify-between'>
                            <p className='text-sm text-black'><ul className='list-disc list-inside'>
                                <li><span className='text-green-500 font-black'>{i.item.length} </span>item{ i.item.length !== 1 ? 's' : '' }</li></ul></p>
                            <div className='flex flex-col text-[10px] gap-1 text-gray-600'>
                                <p className=''>Date: {i.date}</p>
                                <p className=' '>Time: {i.time}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-end gap-1 relative h-full'>
                        <div className='flex absolute -top-2 right-0 gap-2 items-center justify-end w-full'>
                            <Eye size={20} className='text-gray-500'/>
                            <Edit2Icon size={20} className='text-green-500'/>
                        </div>
                        <div className='flex items-center justify-center bg-gray-50'>
                            <img src={i.image} className='object-cover w-20 h-20 rounded-lg' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ListCats
