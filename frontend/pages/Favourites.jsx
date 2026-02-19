import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_URL } from '../api';
import { useSearchParams } from 'react-router-dom';
import { Check, Heart, X } from 'lucide-react';
import ViewMore from '../components/ViewMore';
import NotFoundPage from '../components/NotFoundPage';
import PageTitle from '../components/PageTitle';

const Favourites = () => {
    
    const [searchparams] = useSearchParams()
    let category = searchparams.get('category') || 'all'

    const [allObject, setAllObject] = useState([])
    const [isViewModal, setIsViewModal] = useState(false)
    const [likedItemId, setLikedItemId] = useState(null)

    const getFavItems = async () =>{
        try {
            const result = await axios.get(`${API_URL}/liked/?category=${category}`)
            setAllObject(result.data)
        } catch (error) {
            console.log(`Unable to get liked items: ${error.message}`);   
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

    const handleModal= (e,id)=>{
        e.stopPropagation()
        setIsViewModal(true)
        setLikedItemId(id)
    }

    const handleLike = (e,likeId) =>{
        e.stopPropagation()
        toggleLike(likeId)
    }

    useEffect(()=>{
        getFavItems()
    }, [category])


  return (
    <div className='w-full flex flex-col h-screen space-y-2'>
        <div className='h-full w-full flex-1 relative'>
            {allObject?.length < 1? (
                <NotFoundPage category={category} type='liked'/>
            ): 
            (
            <div className='space-y-2'>
            <PageTitle title='Favourite' sub={allObject.length}/>
            <table className='w-full rounded-2xl'>
                <thead>
                    <tr className='uppercase text-sm md:text-md'>
                        <th className='px-2 py-2 border border-blue-200'>SN</th>
                        <th className='px-2 py-2 border border-blue-200'>Name</th>
                        <th className='px-2 py-2 border border-blue-200'>Category</th>
                        <th className='px-2 py-2 border border-blue-200'>Ordered</th>
                        <th className='px-2 py-2 border border-blue-200'>Liked</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {allObject?.map((row, index)=>(
                        <tr key={row.item?.item_id} className='text-xs md:text-sm'
                        onClick={(e)=>(handleModal(e, row.item?.item_id))}>
                            <td className='px-2 py-2 text-center p-1 border border-blue-300 '>{index+1}</td>
                            <td className='px-3 py-2 text-center p-1 border border-blue-300 '>{row.item?.name}</td>
                            <td className='px-3 py-2 text-center p-1 border border-blue-300 '>{row.item?.category}</td>
                            <td className='px-3 py-2 text-center p-1 border border-blue-300  '>
                                <span className='flex justify-center items-center'>
                                    {
                                    row.order_status?
                                        <Check className='text-green-500'/>:
                                        <X className={`text-red-500`} />
                                    }
                                </span>
                            </td>
                            <td className='px-3 py-2 text-center p-1 border border-blue-300 '>
                                <span className='flex justify-center items-center'>
                                    {<Heart onClick={(e)=>(handleLike(e, row.item?.item_id))}
                                     className={`${row.item?.liked? 'text-red-500 fill-red-500':'text-gray-500 fill-gray-500'} cursor-pointer`}/>}
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
        order_status={allObject[allObject?.findIndex((i)=> i.item.item_id === likedItemId)]?.order_status} 
        setIsView={setIsViewModal} type='favourite' />}
    </div>
  )
}

export default Favourites