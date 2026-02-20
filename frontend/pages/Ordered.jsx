import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_URL } from '../api';
import { useSearchParams } from 'react-router-dom';
import { Check, Heart, Trash2, Verified, VerifiedIcon, X } from 'lucide-react';
import ViewMore from '../components/ViewMore';
import NotFoundPage from '../components/NotFoundPage';
import PageTitle from '../components/PageTitle';


const Ordered = () =>{
    
    const [searchparams] = useSearchParams()
    let category = searchparams.get('category') || 'all'
    let search = searchparams.get('search') || ''
    const [allObject, setAllObject] = useState([])
    const [isViewModal, setIsViewModal] = useState(false)
    const [likedItemId, setLikedItemId] = useState(null)

    const getOrderedsItem = async()=>{
        try {
            const result = await axios.get(`${API_URL}/orders/?category=${category}&search=${search}`)
            setAllObject(result.data) 
        } catch (error) {
            console.log(`Unable to get the liked items ${error.message}`);
        }
    }

    const toggleLike = async(id)=>{
        try {
            const result = await axios.put(`${API_URL}/liked/${id}`,{
                liked: allObject[allObject?.findIndex((i)=> i.item?.item_id === id)]?.item?.liked
            })           

            setAllObject((prev)=>
                prev.map((i)=> i.item?.item_id === id ? 
                        {...i, item: {...i.item, ...result.data}}: i
                )
            )
        } catch (error) {
            console.log(`Unable to edit the like/ulike the item: ${error.message}`);
            
        }
    }

    const deleteOrder = async(id)=>{
        try {
            await axios.delete(`${API_URL}/orders/${id}`)
            setAllObject((prev)=>  prev.filter(i=> i.order_id !== id))
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleModal= (e,id)=>{
        e.stopPropagation()
        setIsViewModal(true)
        setLikedItemId(id)
    }

    const handleLike = (e,likeId) =>{
        e.stopPropagation()
        toggleLike(likeId)
    }

    const handleDeleteOrder = (e, id)=>{
        e.stopPropagation()
        deleteOrder(id)
    }
    useEffect(()=>{
        getOrderedsItem()
    }, [category, search])



  return (
    <div className='w-full flex flex-col h-screen space-y-2'>
        <div className='h-full w-full flex-1 relative'>
            {allObject?.length < 1? (
                <NotFoundPage search={search} category={category} type='Ordered'/>
            ): 
            (
            <div className='space-y-2'>
            <PageTitle title='ordered' sub={allObject.length}/>
            <table className='w-full rounded-2xl'>
                <thead>
                    <tr className='uppercase text-sm md:text-md'>
                        <th className='px-2 py-2 border border-blue-200'>SN</th>
                        <th className='px-2 py-2 border border-blue-200'>Name</th>
                        <th className='px-2 py-2 border border-blue-200'>Category</th>
                        <th className='px-1 py-2 border border-blue-200'>Liked</th>
                        <th className='px-1 py-2 border border-blue-200'>order</th>
                        <th className='px-1 py-2 border border-blue-200'>Cancel</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {allObject?.map((row, index)=>(
                        <tr key={row.item?.item_id} className='text-xs md:text-sm'
                        onClick={(e)=>(handleModal(e, row.item?.item_id))}>
                            <td className='px-2 py-2 text-center  border border-blue-300 '>{index+1}</td>
                            <td className='px-3 py-2 text-center  border border-blue-300 '>{row.item?.name}</td>
                            <td className='px-3 py-2 text-center  border border-blue-300 '>{row.item?.category}</td>
                            <td className='py-2 text-center  border border-blue-300 '>
                                <span className='flex justify-center items-center'>
                                    {<Heart onClick={(e)=>(handleLike(e, row.item?.item_id))}
                                     className={`${row.item?.liked? 'text-red-500 fill-red-500':'text-gray-500 fill-gray-500'} cursor-pointer`}/>}
                                </span>
                            </td>
                            <td className='py-2 text-center border border-blue-300  '>
                                <span className='flex justify-center items-center'>
                                    <VerifiedIcon className='text-green-500'/>
                                </span>
                            </td>
                            <td className='py-2 text-center border border-blue-300 '>
                                <span className='text-center flex justify-center items-center'>
                                    <Trash2 onClick={(e)=>(handleDeleteOrder(e, row.order_id))} className='text-red-500 cursor-pointer'/>
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>   
            </div>
            )}
        </div>

        {isViewModal && <ViewMore likeValue={allObject[allObject?.findIndex((i)=> i.item.item_id === likedItemId)]?.item.liked} handleLike={handleLike} 
        info={allObject[allObject?.findIndex((i)=> i.item.item_id === likedItemId)]?.info} 
        item={allObject[allObject?.findIndex((i)=> i.item.item_id === likedItemId)]?.item} 
        order_status={true} 
        setIsView={setIsViewModal} type='ordered' />}
    </div>
  )
}

export default Ordered
