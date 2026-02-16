import { CircleAlert, Edit2, Pointer, X } from 'lucide-react'
import React, { useState } from 'react'
import PreviewImage from '../../components/PreviewImage'

const CreateCat = () => {

    const [viewImageModal, setViewImageModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        image: {}
    })

    const clearForm =()=>{
        setFormData({
            name: '',
            image: {}
        })
    }

    const handleInsertImage =(e)=>{
        const file = e.target.files[0]
        if(!file) return
        const image_url = URL.createObjectURL(file)
        setFormData((prev)=>({...prev, image: {file, image_url}}))       
    }
    

  return (
    <div>
        <div className='w-full flex justify-between items-center'>
            <p className='text-blue-500'>Item</p>
            <div className='w-full font-medium text-sm text-white flex justify-end items-center gap-3 px-2 py-1'>
            <button onClick={()=>(clearForm())} className='bg-red-500 border-none w-20 h-7 md:w-25 md:h-8 rounded-md cursor-pointer'>Clear</button>
            <button onClick={()=>(clearForm())} className='bg-green-500 border-none w-20 h-7 md:w-25 md:h-8 p-1 rounded-md cursor-pointer'>Submit</button>
            </div>
        </div>

        <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Name <span className='text-red-500'>*</span></h2>
            <input 
            type='text' value={formData?.name} placeholder='Enter the item name ...' onChange={((e)=>(setFormData((prev)=>({...prev, name: e.target.value}))))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
        </div>

        <div className='flex border border-gray-200 p-1 gap-3 w-full m-1 h-60 overflow-x-auto'>
            {formData?.image?.length > 0 ? (
              <div className='flex gap-2 p-1 w-full'>
                {formData?.image && (
                <div onClick={()=>(setViewImageModal(true))} className='relative w-full bg-red-500 flex items-center justify-center gap-1 text-gray-400 flex-col rounded-md border border-gray-400'>
                    <img src={formData?.image.image_url} alt='preview' 
                    className='w-full h-full object-cover border border-gray-200'/>
                    <div className='absolute top-0 left-0 flex justify-end gap-2 p-2 items-center right-0 w-full h-5'>
                      <label>
                        <Edit2 size='20' className='text-green-500'/>
                        <input onChange={(e)=>(handleInsertImage(e))} type='file' accept='image/*' className='bg-red-500 hidden w-5' />
                      </label>
                    </div>
                 </div>
                )}
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

export default CreateCat
