import axios from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Circle, Heart, JapaneseYen, Minus, MoveLeft, MoveRight, Plus } from 'lucide-react'
import { API_URL } from '../../api'
import PopUp from '../../components/PopUp'
import { useNotifications } from '../../components/context/NotificationsContext'

const EditItem = () => {
  const {id} = useParams()

    const {setLikedCount} = useNotifications()
    const [item, setItem] = useState([])
    const [thumbnails, setThumbnails] = useState([])
    const [editLike,setEditLike] = useState(false)
    const [infos, setInfos] = useState([])
    const [order, setOrder] = useState(null)
    const [selectedInfo, setSelectedInfo] = useState(null)
    const [isPop, setIspop] = useState(false)
    const [displayIndex, setDisplayIndex] = useState(0)
    const [orderedQty, setOrderedQty] = useState(1)
    const totalCost =selectedInfo? orderedQty*selectedInfo.cost : 0;

    const getDetails = async()=>{
        try {
            const res = await axios.get(`${API_URL}/items/${id}`)
            const hold = res.data
            setItem(hold.item)
            setThumbnails(hold.thumbnails)
            setEditLike(hold.item.liked)
            setInfos(hold.infos)
            setOrder(hold.order)
            setOrderedQty(hold.order?.order_qty || 1)
            setSelectedInfo(hold.order.order_status? hold.infos.find((i)=>(i.info_id === hold.order.info_id)) : hold.infos[0])
        } catch (error) {
            console.log(`Error message: ${error.message}`)
        }
    }

    const updateFunc = async () =>{
        try {
            await axios.put(`${API_URL}/orders/${order.order_id}`,{
                info_id: selectedInfo.info_id,
                order_qty: orderedQty
            })
            console.log(`Order successfully updated`);       
        } catch (error) {
            console.log(`Unable to edit the order: ${error.message}`);
        }
    }

    const postFunc = async () =>{
        try {
            await axios.post(`${API_URL}/orders`,{
                item_id: item.item_id,
                info_id: selectedInfo.info_id,
                order_qty: orderedQty
            })
            console.log(`Order successfully created`);
            
        } catch (error) {
            console.log(`Unable to place the order: ${error.message}`);
        }
    }

        const likeFunc = async()=>{
        try {
            const res = await axios.put(`${API_URL}/liked/${id}`,{
                liked: editLike
            });
            setEditLike(res.data.liked)
            if(isPop) setIspop(false)
                
            const globalLikedNotif = await axios.get(`${API_URL}/liked_notifications`)
            setLikedCount(globalLikedNotif.data[0]?.count || 0)
        } catch (error) {
            console.log(error.message);            
        }
    }

    const editCreate = async ()=>{
        console.log(order.order_id)
        if(order.order_status){ await updateFunc() }
        else await postFunc()

        await getDetails()
    }   
       
    const compute = (operation)=>{
        if(isPop) setIspop(false);
        setOrderedQty((prev)=>{
            if(operation === 'minus'){
                return Math.max(1, prev - 1)
            }
            else if(operation === 'add'){
                return prev+1
            }
            return prev
        })
        
    }

    const changeThumbnail = (operation)=>{
        setDisplayIndex((prev)=>{
            if(operation === 'minus'){
                return Math.max(0, prev-1)
            } else if(operation === 'add'){
                return Math.min(prev+1, thumbnails.length-1)
            }
            return prev
        })        
    }
  
    const popUpMessage = `The value of the ordered quantity can't be less than 1, it has been reinitialised to 1`
    
    
    const handleInput = (e)=>{
        const value = parseInt(e.target.value, 10)
        if(isNaN(value) || value < 1){
            setOrderedQty(0)
        } else setOrderedQty(value)
    }
      

    useEffect(()=>{
        getDetails();
        if(orderedQty < 0 || isNaN(orderedQty) || !orderedQty){
            setIspop(true)
            setOrderedQty(1); 
        }
    }, [id])
    
  return (
    <div className='flex flex-col items-center relative gap-2 h-screen px-5 md:px-10 lg:px-15'>
        <div className='relative w-full'>
            <PopUp message={popUpMessage} isPop={isPop}/>
        </div>

        {/* thumbnail display */}
        <div className='w-full bg-white flex items-center relative'>
            <div className='w-full h-50 bg-gray-400 flex items-center justify-center relative'>
                <img src={thumbnails.length>0?thumbnails[displayIndex].image:null} alt={`${item.name}`} className='object cover w-full h-full flex text-gray-700 justify-center items-center'/>
            </div>
            <div className='w-full flex justify-between h-8 px-2 absolute left-0 right-0'>
                <div className='relative flex items-center w-full h-full'>
                    {displayIndex > 0 && (<div onClick={()=>(changeThumbnail('minus'))} className='absolute left-0 transition-colors duration-500 ease-in-out bg-black/70 text-white p-1'><MoveLeft className='w-5 h-full'/></div>)}
                    {displayIndex < thumbnails.length-1 && (<div  onClick={()=>(changeThumbnail('add'))} className='absolute  right-0 transition-colors duration-500 ease-in-out bg-black/70 text-white p-1'><MoveRight className='w-5 h-full'/></div>)}
                </div>
            </div>
            <div className='w-full absolute bottom-2 flex items-center justify-center gap-2'>
                {thumbnails.map((i)=>(
                    <div key={i.image_id}>
                        <Circle className={`w-2 h-2 transition-all duration-500 ease-in ${thumbnails.length>0 && i.image_id === thumbnails[displayIndex].image_id && 'fill-green-500 text-green-900'}`}/>
                    </div>
                ))}
            </div>
        </div>
        <div className='flex flex-col justify-center relative w-full p-2 pr-20 bg-blue-200'>
            <p className='flex break-all gap-1 flex-wrap break-word'><span>Name:</span><span className='flex-1'> {item.name}</span></p>
            <p className='flex gap-1 flex-wrap break-word'><span className=''>Category:</span><span className='flex-1'> {item.category}</span></p>            
            <p className='flex gap-1 flex-wrap break-word'><span className=''>Description:</span><span className='flex-1'> {item.description}</span></p>            
            <button className='absolute right-2 '>
                    {editLike ?(<Heart onClick={()=>(likeFunc())} className='w-15 h-15 text-red-500 fill-red-500 transition-colors duration-100 ease-in-out'/>):((<Heart onClick={()=>(likeFunc())} className='w-15 h-15 fill-gray-500 text-gray-500 transition-colors duration-100 ease-in-out' />))}
            </button>
        </div>
        <div className='w-full p-1 bg-linear-to-b from-green-100 to-green-50 gap-2 flex flex-col items-center'>
            <div className='w-full flex justify-between flex-col gap-2 px-2'>
                <div className='w-full flex justify-end gap-1'>
                    <div className='relative flex items-center justify-center border bg-white border-gray-400 rounded-2xl min-w-25 p-1 text-center '>
                        <span className='flex px-5'>{parseFloat(totalCost)}</span>
                        <JapaneseYen className='w-4 h-4  text-gray-600 absolute right-1'/>
                    </div>
                    <div className='flex items-center justify-center rounded-2xl gap-1 w-25 border bg-white border-gray-600 p-1'>
                        <Minus onClick={()=>(compute('minus'))} className='flex-2 w-full h-full bg-gray-400 rounded-l-2xl'/>
                        <input
                        type='number'
                        min='1'
                        value={orderedQty}
                        onChange={handleInput} 
                        className='flex-3 bg-gray-400 h-full w-full text-center'/>
                        <Plus onClick={()=>(compute('add'))} className='flex-2 w-full h-full bg-gray-400 rounded-r-2xl'/>
                    </div>
                </div>
                <button className='py-1 px-5 cursor-pointer bg-red-500 text-white flex items-center justify-center rounded-2xl border border-gray-500' onClick={()=>(editCreate())}>
                    {order?.order_status? 'EDIT': 'POST'}
                </button>
            </div>
            <div className='flex flex-wrap gap-2 p-1 px-2'>
                {infos.map((i)=>(
                    <p key={i.info_id} onClick={()=>(setSelectedInfo(i),isPop && setIspop(false))} className={`w-full border cursor-pointer ${i.info_id === selectedInfo?.info_id  ? 'border-2 border-green-500':'border-gray-500'} text-[12px] rounded-2xl space-x-1 bg-red-100 p-2`}>
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

export default EditItem
