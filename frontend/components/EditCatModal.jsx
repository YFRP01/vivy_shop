import { Edit2, Pointer } from 'lucide-react'
import React, { useRef, useState } from 'react'
import PreviewImage from './PreviewImage'

const EditCatModal = ({selectedCategory}) => {

    const editImageRef = useRef()
    const [viewImageModal, setViewImageModal] = useState(false)
    const [formData, setFormData] = useState({
        name: selectedCategory.name || '',
        image: {
            image_url: selectedCategory.image || '',
            file: null
        }
    })

    const clearForm =()=>{
        setFormData({
        name: selectedCategory.name || '',
        image: {
            image_url: selectedCategory.image || '',
            file: null
        }
        })
    }

    const handleInsertImage =(e)=>{
        const file = e.target.files[0]
        if(!file) return
        const image_url = URL.createObjectURL(file)
        setFormData((prev)=>({...prev, image: {file, image_url}}))       
    }
    

    return (
    <div className='flex flex-col items-center gap-2'>
        <div className='w-full flex justify-between items-center'>
            <p className='text-blue-500'>Item</p>
            <div className='w-full font-medium text-sm text-white flex justify-end items-center gap-3 px-2 py-1'>
            <button onClick={()=>(clearForm())} className='bg-red-500 border-none w-20 h-7 md:w-25 md:h-8 rounded-md cursor-pointer'>Clear</button>
            <button onClick={()=>(clearForm())} className='bg-green-500 border-none w-20 h-7 md:w-25 md:h-8 p-1 rounded-md cursor-pointer'>Submit</button>
            </div>
        </div>

        <div className='flex gap-2 p-1'>
            <h2 className='flex font-medium'>Name <span className='text-red-500'>*</span></h2>
            <div className='space-y-5 h-full w-full flex flex-col justify-center items-center'>
            <input 
            type='text' value={formData?.name} placeholder='Enter the item name ...' onChange={((e)=>(setFormData((prev)=>({...prev, name: e.target.value}))))} 
            className={`focus:ring-2 flex-1 border w-full border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>

            </div>

        </div>
        <div className='flex border border-gray-200 w-full h-80 gap-3 justify-center  overflow-x-auto'>
            {formData?.image?.image_url ? (
            <div className='relative flex w-full h-full items-center justify-center gap-1 text-gray-400 flex-col rounded-md border border-gray-400'>
                <img onClick={()=>(setViewImageModal(true))} src={formData?.image.image_url} alt='preview' 
                className=' object-cover border h-full w-full border-gray-200'/>
                <div className='absolute top-1 left-0 flex justify-end gap-2 items-center right-0 w-full h-5 p-2'>
                    <label ref={editImageRef} className='w-fit flex p-1 items-center justify-end'>
                    <Edit2 size='20' className='text-green-500'/>
                    <input onChange={(e)=>(handleInsertImage(e))} type='file' accept='image/*' className='bg-red-500 hidden w-5' />
                    </label>
                </div>
                </div>
            ):
            (<label className='w-full flex items-center justify-center gap-1 text-gray-400'>
                <Pointer size={20} />
                <input onChange={(e)=>(handleInsertImage(e))} type='file' accept='image/*' className='bg-red-500 hidden w-5' />
                <p>Select Image</p>
            </label>)}
        </div>
        {viewImageModal && (<PreviewImage image={formData.image} setIsOpen={setViewImageModal} />)}
    </div>
  )
}


export default EditCatModal
