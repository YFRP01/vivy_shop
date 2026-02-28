import { CircleAlert, Edit2, Pointer, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import PreviewImage from '../../components/PreviewImage'
import axios from 'axios'
import { API_URL } from '../../api'

const CreateCat = () => {

    const editImageRef = useRef()
    const [loading, setLoading] = useState(false)
    const [errorOnSubmit, setErrorOnSubmit] = useState({name: '', image: '', server: ''})
    const [successMessage, setSuccessMessage] = useState('')
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

    const handleSubmit = async(e)=>{
        e.preventDefault()
        let hasError= false
            if(!formData.name.trim()){
                setErrorOnSubmit((prev)=>({...prev, name: "Insert the category name!"}))
                hasError = true
            }
            if(!formData.image.file){
                setErrorOnSubmit((prev)=>({...prev, image: "Insert the category image!"}))
                hasError = true
            }
        if(hasError) return

        setLoading(true)
        try {
            setErrorOnSubmit('')
            const data = new FormData()
            data.append("name", formData.name.trim())
            data.append("image", formData.image.file)
            await axios.post(`${API_URL}/categories/developer`, data)
            setSuccessMessage("Category successfully created!")
            clearForm()
        } catch (error) {
            setErrorOnSubmit((prev)=>({...prev, server: error.message}))
        } finally {
            setLoading(false)
        }
    }
    

    return (
    <form onSubmit={handleSubmit}>
        <div className='w-full flex justify-between items-center'>
            <p className='text-blue-500'>Item</p>
            <div className='w-full font-medium text-sm text-white flex justify-end items-center gap-3 px-2 py-1'>
            <button type='button' onClick={clearForm} className='bg-red-500 border-none w-20 h-7 md:w-25 md:h-8 rounded-md cursor-pointer'>Clear</button>
            <button disabled={loading} className={`${loading?'bg-green-200':'bg-green-500'} capitalize border-none w-20 h-7 md:w-25 md:h-8 p-1 rounded-md cursor-pointer`}>
                {loading? 'submitting...':'Submit'}
            </button>
            </div>
        </div>
        {successMessage && (
            <div className = {`bg-green-100 text-green-700 p-2 w-full rounded mt-2`}>{successMessage}</div>
        )}
        {errorOnSubmit.server && (
            <div className = {`bg-red-100 text-red-700 p-2 w-full rounded mt-2`}>{errorOnSubmit.server}</div>
        )}
        <div className='flex gap-0 p-1'>
            <h2 className='flex font-medium'>Name <span className='text-red-500'>*</span></h2>
        <div className='space-y-2 relative w-full flex flex-col justify-center items-center'>
            <input 
            type='text' value={formData?.name} placeholder='Enter the item name ...' onChange={((e)=>(setFormData((prev)=>({...prev, name: e.target.value}))))} 
            className={`focus:ring-2 flex-1 border w-full border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }/>
        {errorOnSubmit.name && (
            <div className = {`bg-red-100 text-red-700 p-2 w-full rounded mb-2`}>{errorOnSubmit.name}</div>
        )}
        <div className='flex border border-gray-200 w-100 h-100 gap-3 justify-center  overflow-x-auto'>
                {formData?.image?.image_url ? (
                <div className='relative flex  h-full items-center justify-center gap-1 text-gray-400 flex-col rounded-md border border-gray-400'>
                    <img onClick={()=>(setViewImageModal(true))} src={formData?.image.image_url} alt='preview' 
                    className=' object-cover border border-gray-200'/>
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
                    <input onChange={(e)=>(handleInsertImage(e))} type='file' accept='image/*' className='bg-red-500 hidden w-5'/>
                    <p>Select Image</p>
                </label>)}
            </div>
            {errorOnSubmit.image && (
                <div className = {`bg-red-100 text-red-700 p-2 w-full rounded `}>{errorOnSubmit.image}</div>
            )}
            </div>
        </div>
        {viewImageModal && (<PreviewImage image={formData.image.image_url} setIsOpen={setViewImageModal} />)}
    </form>
  )
}

export default CreateCat
