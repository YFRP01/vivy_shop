import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { API_URL } from '../../api'
import axios from 'axios'
import { Edit2Icon, Eye, XCircle } from 'lucide-react'
import ViewCatModal from '../../components/ViewCatModal'
import EditCatModal from '../../components/EditCatModal'

const ListCats = () => {

    const detailsRef = useRef()
    const [searchParams] = useSearchParams()
    const [mainHold, setMainHold] = useState([])
    const category = searchParams.get('category') || 'all';
    const [vieCategoryModal, setViewCategoryModal] = useState(false)
    const [editCategoryModal, setEditCategoryModal] = useState(false)
    const [checkStatus, setCheckStatus] = useState(false)
    const [selectedItems, setselectedItems] = useState([])
    const [selectedCategory, setSelectedCategory] = useState({})

    const getAll = async()=>{
        try {
            const response = await axios.get(`${API_URL}/categories/developer?category=${category}`)
            setMainHold(response.data)
        } catch (error) {
            console.log(`Unable to get the saved items ${error.message}`);
        }
    }

    const handleView =(item)=>{
        setselectedItems(item)
        setCheckStatus(true)
        setViewCategoryModal(true)
        setEditCategoryModal(false)
    }
    const handleEdit = (name, id, image)=>{
        setEditCategoryModal(true)  
        setCheckStatus(true)
        setSelectedCategory({name, id, image})
    }

    useEffect(()=>{
        getAll()
    }, [])

    useEffect(()=>{
        const handleClickOutside =(e)=>{
            if(detailsRef.current && !detailsRef.current.contains(e.target)){
                setViewCategoryModal(false)
                setEditCategoryModal(false)
                setCheckStatus(false)
            }
        }
            addEventListener('mousedown', handleClickOutside)
            return()=>{
                removeEventListener('mousedown', handleClickOutside)
            }
    }, [])

  return (
    <div>
        <p className='text-blue-500'>Available categories (<span className='text-green-500'>{mainHold.length}</span>)</p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
            {mainHold?.map((i)=>(
                <div key={i.category_id} className='flex items-center shadow justify-center gap-2 border border-gray-200 rounded-md'>
                    <div className='flex-1 h-full p-2 flex flex-col justify-between'>
                        <div className=''>
                        <p className='font-medium'>{i.category_name}</p>
                            <p className='text-sm text-black flex'>
                                    <ul className='/*list-disc list-inside*/ w-full flex gap-1'>
                                        <li><span className='text-green-500 font-black'>{i.item.length} </span>item{ i.item.length !== 1 ? 's' : '' }</li>connected
                                    </ul>
                            </p>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex flex-col text-[10px] gap-1 text-gray-600'>
                                <p className=''>Date: {i.date}</p>
                                <p className=''>Time: {i.time}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-end gap-1 p-1 relative h-full'>
                        <div className='flex gap-2 items-center justify-end w-full'>
                            <Eye onClick={()=>(handleView(i))} size={20} className='text-gray-500'/>
                            <Edit2Icon onClick={()=>handleEdit(i.category_name, i.category_id, i.image)}  size={20} className='text-green-500'/>
                        </div>
                        <div className='flex items-center justify-center bg-gray-50'>
                            <img src={i.image} className='object-cover w-20 h-20 rounded-lg' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
        {checkStatus && (
            <div className='h-screen w-screen z-50 fixed top-0 left-0 right-0 bottom-0 bg-black/70 flex items-center justify-center '>
              <div ref={detailsRef} className='bg-white p-8 shadow-lg h-[80%] space-y-5 w-[90%] rounded-xl md:p-4 lg:p-6 relative'>
                <div className='w-full absolute top-0 right-0 p-2 text-red-500 flex items-center justify-end'>
                  <XCircle className='cursor-pointer w-7 h-7' onClick={()=>(setCheckStatus(false))} />
                </div>
                <div className='overflow-y-auto h-full'>
                    {vieCategoryModal && <ViewCatModal hold={selectedItems} setIsOpen={setViewCategoryModal} />}
                    {editCategoryModal && <EditCatModal selectedCategory={selectedCategory}/>}
                </div>
              </div>
          </div>
        )}
    </div>
  )
}

export default ListCats
