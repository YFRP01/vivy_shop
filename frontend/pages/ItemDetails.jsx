import axios from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '../api'
import { useEffect } from 'react'
import { Heart, JapaneseYen, Minus, MoveLeft, MoveRight, Plus } from 'lucide-react'
import PopUp from '../components/PopUp'

const ItemDetails = () => {
    const {id} = useParams()

    const [item, setItem] = useState([])
    const [thumbnails, setThumbnails] = useState([])
    const [editLike,setEditLike] = useState()
    const [infos, setInfos] = useState([])
    const [selectedInfo, setSelectedInfo] = useState([])
    const [isPop, setIspop] = useState(false)

    const getDetails = async()=>{
        try {
            const res = await axios(`${API_URL}/items/${id}`)
            setItem(res.data)
            setThumbnails(res.data.thumbnails)
            setEditLike(res.data.liked)
            setInfos(res.data.infos)
            setSelectedInfo(res.data.infos[0])
        } catch (error) {
            console.log(`Error message: ${error.message}`)
        }
    }
    let [orderedQty, setorderedQty] = useState(1);
    const totalCost = orderedQty*selectedInfo.cost;
    const compute = (operation)=>{
        
        if(isPop) setIspop(false)
        if(operation === 'minus'){
            setorderedQty(orderedQty-1)
        }
        else if(operation === 'add'){
            setorderedQty(orderedQty+1)
        }
        
                 
    }
    const popUpMessage = `The value of the ordered quantity can't be less than 1, it has been reinitialised to 1`
    
    if(orderedQty < 1){
        setIspop(true)
        setorderedQty(1); 
    }
    

    console.log(isPop);
    
    const likeFunc = async()=>{
        try {
            const res = await axios.put(`${API_URL}/liked/${id}`,{
                liked: editLike
            });
            setEditLike(res.data.liked)
            if(isPop) setIspop(false) 
        } catch (error) {
            console.log(error.message);
            
        }
    }

    useEffect(()=>{
        getDetails();
    }, [id])
    
  return (
    <div className='flex flex-col items-center relative gap-2 h-screen px-5 md:px-10 lg:px-15'>
        <div className='relative w-full'>
            <PopUp message={popUpMessage} isPop={isPop}/>
        </div>
        <div className='w-full bg-white flex items-center relative'>
            {thumbnails.slice(0,1).map((i)=>(
                <div key={i.image_id} className='w-full h-50 bg-red-500 flex items-center justify-center relative'>
                    <img src={i.image} alt={i.name} className='object cover w-full h-full flex text-gray-700 justify-center items-center'/>
                </div>
            ))}
            <div className='w-full flex justify-between px-2 h-8 absolute left-0 right-0'>
                <div className='bg-black/70 text-white p-1'><MoveLeft className='w-5 h-full'/></div>
                <div className='bg-black/70 text-white p-1'><MoveRight className='w-5 h-full'/></div>
            </div>
            <div>

            </div>
        </div>
        <div className='flex flex-col justify-center relative w-full p-2 pr-20 bg-green-200'>
            <p className='flex break-all'><span>Name:</span><span className='flex-1'> {item.name} item.description</span></p>
            <p className='flex gap-1 flex-wrap break-all'><span className=''>Description:</span><span className='flex-1'> item.description</span></p>
            <button className='absolute right-2 '>
                    {editLike ?(<Heart onClick={()=>(likeFunc())} className='w-15 h-15 text-red-500 fill-red-500 transition-colors duration-100 ease-in-out'/>):((<Heart onClick={()=>(likeFunc())} className='w-15 h-15 fill-gray-500 text-gray-500 transition-colors duration-100 ease-in-out' />))}
            </button>
        </div>
        <div className='w-full p-1 bg-linear-to-b from-green-100 to-green-50 gap-2 flex flex-col items-center'>
            <div className='w-full flex justify-end gap-1'>
                <div className='relative flex items-center justify-center border bg-white border-gray-400 rounded-2xl min-w-25 p-1 text-center '>
                    <span className='flex px-5'>{totalCost.toString()}</span>
                    <JapaneseYen className='w-4 h-4  text-gray-600 absolute right-1'/>
                </div>
                <div className='flex items-center justify-center rounded-2xl gap-1 w-25 border bg-white border-gray-600 p-1'>
                    <Minus onClick={()=>(compute('minus'))} className='flex-2 w-full h-full bg-gray-400 rounded-l-2xl'/>
                    <input
                    type='text'
                    value={orderedQty}
                    onChange={(e)=>(setorderedQty(e.target.value))} 
                    className='flex-3 bg-gray-400 h-full w-full text-center'/>
                    <Plus onClick={()=>(compute('add'))} className='flex-2 w-full h-full bg-gray-400 rounded-r-2xl'/>
                </div>
            </div>
            <div className='flex flex-wrap gap-2 p-1 px-2'>
                {infos.map((i)=>(
                    <p key={i.info_id} onClick={()=>(setSelectedInfo(i),isPop && setIspop(false))} className={`w-full border cursor-pointer ${i.info_id === selectedInfo.info_id ? 'border-2 border-green-500':'border-gray-500'} text-[12px] rounded-2xl space-x-1 bg-red-100 p-2`}>
                        <span className='font-medium '>{i.qty}</span> 
                        <span className=''>{i.details} a</span> 
                        <span className='font-medium '>{i.cost}</span>
                    </p>
                ))}
            </div>
        </div>
    </div>
  )
}

export default ItemDetails
