import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { API_URL } from '../../api'
import { assets, sources } from '../../src/assets/assets'
import { ArrowDownCircle, ArrowDownCircleIcon, ArrowUpCircle, CircleAlert, Edit, Edit2, Images, Info, MinusCircle, Plus, PlusCircle, PlusCircleIcon, PlusSquare, X } from 'lucide-react'
import PreviewImage from '../../components/PreviewImage'


const CreateItems = () => {

  const ref = useRef()

  const [categories, setCategories] = useState([])
  const [nameInput, setNameInput] = useState('')
  const [descriptionInput, setDescriptionInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [sourceInput, setSourceInput] = useState('')
  const [isViewCategory, setViewCategory] = useState(false)
  const [isViewSource, setViewSource] = useState(false)
  const [isPreviewCard, setIsPreviewCard] = useState(false)
  const [categoryLCheck, setCategoryLCheck] = useState(false)
  const [isRadioSelected, setIsRadioSelected] = useState(false)
  const [viewCat, setViewCat] = useState(false)
  const [catImages, setCatImages] = useState()
  const [holdCatImage, setHoldCatImage] = useState()
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [holdInfos, setHoldInfos] = useState([
    {qty: "", cost: "", details: ""}
  ])
  const [images, setImages] = useState([
    {"file": "image_01", "image_url": assets.image_two},
    {"file": "image_02", "image_url": assets.react_image}

  ])
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      category: '',
      source: '',
      infos: [],
      thumbnails: [],
      categoryImage: {}
    })
  

  const clearForm = ()=>{
    setFormData({
      name: '',
      description: '',
      category: '',
      source: '',
      infos: [],
      thumbnails: [],
      categoryImage: {}
    })
  }
  const handleShow = (e, value, input)=>{
        if(e.key === 'Enter' && input.trim()){
            console.log(value, ':', input);
        }
  }

  const handleChange = (e, field, index)=>{
    setFormData((prev)=>({...prev, 
      infos: prev.infos.map((info, i)=> index === i ? {...info, [field]: e.target.value}: info)
    }))
  }

  const addNewBlock = ()=>{
    setFormData((prev)=>({...prev, infos: {qty: "", cost: "", details: ""} }))   
  }

  const handleInsertImage = (e)=>{
    const files = e.target.files;
    const update = []
    if(!files) return
    for(let i=0; i < files.length; i++){
        update.push({file: files[i], image_url: URL.createObjectURL(files[i])})
    } 
    setFormData((prev)=>({...prev, thumbnails: [...prev.thumbnails, ...update]}))
    e.target.value=""
  }

  const handleInsertCategoryImage = (e)=>{
    const file = e.target.files[0]
    const update = {file, image_url: URL.createObjectURL(file)}
    if(!file) return;
    setFormData((prev)=>({...prev, categoryImage: update}))
    e.target.value=""
    

  }
  const handleDeleteImage = (index) =>{
    setFormData((prev)=>({...prev, thumbnails: prev.thumbnails.filter((_, i)=> i !== index)}))
  }

  const handleEditImage = (e, index)=>{
    const file= e.target.files[0]
    if(!file) return;
    const update = {image_url: URL.createObjectURL(file), file}
    setFormData((prev)=>({...prev, thumbnails: 
      prev.thumbnails.map((img, i)=> i === index ? update : img)}))
  }

  const handleRadio = (e, input, type)=>{
    if(type.includes('cat')){
        setTimeout(() => {
          setFormData((prev)=>({...prev, category: input}))
          setViewCategory(false)
          setCategoryLCheck(false)
          setIsRadioSelected(true)
        }, 300);
    }
    else if(type.includes('source')) {
        setTimeout(() => {
          setFormData((prev)=>({...prev, source: input}))
          setViewSource(false)
        }, 300);
    }
    else {
      console.log('error');
      return null
    }
    
    
  }

  const allCategories = async () =>{
    try {
      const response = await axios.get(`${API_URL}/categories`)
      setCategories(response.data)
    } catch (error) {
      console.log(`Unable to get all categories: ${error.message}`);
    }
  }

  
  useEffect(()=>{
    allCategories()
  }, [])

  useEffect(()=>{
    const handle = (event) => {
        if(ref.current && !ref.current.contains(event.target)){
            setViewCategory(false)
            setViewSource(false)
        }
    }

    document.addEventListener('mousedown',handle)
    return (()=>{
        document.removeEventListener('mousedown', handle)
    })
    }, [])

  return (
    <div className='flex flex-col h-full w-full p-1'>

      {/*-----------------------------------------
        items
      -----------------------------------------*/}
        <div className='flex flex-col gap-2'>
          <div className=''>
            <div className='w-full flex justify-between items-center'>
              <p className='text-blue-500'>Item</p>
              <div className='w-full font-medium text-sm text-white flex justify-end items-center gap-3 px-2 py-1'>
                <button onClick={()=>(clearForm())} className='bg-red-500 border-none w-20 h-7 md:w-25 md:h-8 rounded-md cursor-pointer'>Clear</button>
                <button onClick={()=>(clearForm())} className='bg-green-500 border-none w-20 h-7 md:w-25 md:h-8 p-1 rounded-md cursor-pointer'>Submit</button>
              </div>

            </div>
            {/* name */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Name <span className='text-red-500'>*</span></h2>
            <input 
            type='text' onKeyDown={(e)=>(handleShow(e, 'Name', formData.name))} value={formData.name} placeholder='Enter the item name ...' onChange={((e)=>(setNameInput(e.target.value)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* description */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Description</h2>
            <textarea 
            onKeyDown={(e)=>(handleShow(e, 'Description', formData.description))} value={formData.description} placeholder='Enter the item name ...' 
            onChange={((e)=>(setFormData((prev)=>({...prev, description: e.target.value}))))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            />
          </div>
          {/* category */}
          <div className='flex  gap-2 w-full p-1 relative'>
            <div className='flex flex-col h-fit gap-1 font-medium'>
              <div className='flex gap-1 font-medium'>
                  <p className=''>Category</p>
                  <span className='text-red-500'>*</span>
              </div>
              <div className='flex text-[10px] items-center justify-between px-1'>
                <label className='flex items-center gap-1'>
                    <input type='checkbox' name='whichCat' onChange={(e)=>(setViewCat(e.target.checked))} checked={viewCat} className='cursor-pointer'/>
                    Default
                </label> 
              </div>
            </div>
                <div className='flex flex-col lg:flex-row lg:items-center gap-1 w-full'>
              {!viewCat && (                  
                  <div className='lg:flex-1 flex items-center justify-center gap-2'>
                    <label className='w-full flex items-center '>
                    <textarea placeholder='select' readOnly value={formData.category} onClick={()=>(setViewCategory(!isViewCategory))} 
                    className='w-full h-full border border-gray-500 cursor-pointer text-gray-500 px-1 rounded-sm'/>
                    </label>
                  </div>
              )}
              {viewCat && (
                  <div className={`lg:flex-1 flex gap-2 flex-col`}>
                        <label className='w-full flex items-center'>
                          <textarea type='text' 
                          className={`focus:ring-2 h-full w-full border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` } 
                          placeholder='Custom name ...' value={formData?.category} onChange={(e)=>(setFormData((prev)=>({...prev, category: e.target.value})))}/>
                        </label>
                        <label className='flex items-center justify-center w-full'>
                          <div className='h-20 lg:h-30 w-full bg-white rounded-md border text-gray-500 text-sm border-gray-300'>
                            {formData?.categoryImage?.image_url ? (<img src={formData?.categoryImage?.image_url} alt='category preview' className='object-cover h-full w-full'/>):
                            (<p className='text-center h-full flex items-center justify-center gap-2'><Pointer size='20' /><span>Select image</span></p>)}
                          </div>
                            {/* <img src={formData?.categoryImage?.image_url} alt={formData?.categoryImage ? 'category preview':'Select image'} className='object-cover h-20 lg:h-30 w-full rounded-md border text-gray-500 text-sm border-gray-300'/> */}
                            <input type='file' accept='image/*' onChange={(e)=>(handleInsertCategoryImage(e))} className='hidden'/>
                        </label>
                  </div>
              )}
            </div>
            {isViewCategory && (
                <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/5 transition-all duration-500 ease-in-out w-full h-screen z-53'>
                  <div className='bg-ed-500 h-full w-full flex justify-center relative'>
                   <div ref={ref} className='absolute top-43 w-64 transition-all duration-500 ease-in-out max-h-100 overflow-y-auto bg-white rounded-lg border border-blue-300 text-gray-800 p-2 flex flex-col gap-1'>
                        {categories.map((cat, index)=>(
                        <label key={cat.category_id} onClick={(e)=>(handleRadio(e, cat.category_name, 'cat'))} className={`flex gap-1 hover:bg-blue-100 px-1 rounded-md break-all`}>
                            <input
                            type='radio' value={cat.category_name} name='category' required={index === 0}/>
                            {cat.category_name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
            )} 
          </div>
            {/* source */}
          <div className='flex gap-2 p-1 relative'>
            <div className='flex gap-2'>
              <p className='font-medium'>Source</p>
              <button onClick={()=>(setViewSource(!isViewSource))} className='border border-gray-500 min-w-30 cursor-pointer text-gray-500 px-1 rounded-sm'>
                {formData.source? formData.source : 'select'}
              </button>
            </div>
            {isViewSource && (
                <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/10 transition-all duration-500 ease-in-out w-full h-screen z-100'>
                  <div className='bg-ed-500 h-full w-full flex justify-center relative'>
                   <div ref={ref} className='absolute top-71 w-64 transition-all duration-500 ease-in-out max-h-100 overflow-y-auto bg-white rounded-lg border border-blue-300 text-gray-800 p-2 flex flex-col gap-1'>
                        {sources?.map((s)=>(
                        <label key={s.id} onClick={(e)=>(handleRadio(e, s.name, 'source'))} className={`flex gap-1 hover:bg-blue-100 px-1 rounded-md break-all`}>
                            <input
                            type='radio' onChange={(e)=>(setFormData((prev)=>({...prev, source:e.target.value})))} value={s.name} name='source' />
                            {s.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
            )} 
          </div>
          
          </div>
        </div>

      {/*-----------------------------------------
        infos
      -----------------------------------------*/}
      <div>
      <div className='flex flex-col'>
          <p className='text-blue-500'>Infos ({formData.infos?.length})</p>
          {formData.infos?.map((i, index)=>(
            <div key={index} className={`border-t border-blue-200 transition-all duration-700 ease-in`}>
          {/* Qty */}
          <div className='flex gap-2 p-1'>
            <h2 className='flex gap-1 font-medium'>Quantity <span className='text-red-500'>*</span></h2>
            <input 
            type='number' min={1} step={1} value={i.qty} placeholder='Quantity' onChange={((e)=>(handleChange(e.target.value, 'qty', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* cost */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Cost <span className='text-red-500'>*</span></h2>
            <input 
            type='number' value={i.cost} min={0} placeholder='Cost' onChange={((e)=>(handleChange(e.target.value, 'cost', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* details */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Details</h2>
            <textarea
            type='text' value={i.details} placeholder='Details ' onChange={((e)=>(handleChange(e.target.value, 'details', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            />
          </div>
          <div className={`w-full ${i.qty && i.cost && i.details && holdInfos.length - 1 === index ? 'block': 'hidden'} transitiion-all duration-800 ease-in flex justify-end items-center bg-red-5000`}>
            <PlusCircle onClick={()=>(addNewBlock())} className='text-blue-500 transitiion-all duration-900 ease-in' />
          </div>
          </div>
          ))}
        </div>
      </div>


      {/*-----------------------------------------
        thumbnails
      -----------------------------------------*/}

        <div className='w-full'>
          <div className='flex items-center justify-between '>
            <p className='text-blue-500'>Thumbnails ({formData?.thumbnails.length}) <span className='text-red-500'>*</span></p>
            <label
              className='flex flex-col items-center justify-center rounded-md text-green-500'>
                  <input type='file' multiple accept='image/*' className='hidden'
                  onChange={(e)=>(handleInsertImage(e))} />
                  <PlusCircleIcon className=' font-extralight text-sm'/>
            </label>          
          </div>
          <div className='flex border border-gray-200 p-1 gap-3 w-full m-1 h-60 overflow-x-auto'>
            {formData?.thumbnails?.length > 0 ? (
              <div className='flex gap-2 p-1'>
                {formData.thumbnails?.reverse().map((i, index)=>(
                <div key={index} className='relative flex flex-col items-center justify-center w-50 rounded-md text-gray-600 border border-gray-400 bg-white'>
                    <img onClick={()=>(setSelectedImageIndex(index), setIsPreviewCard(true))} src={i?.image_url} alt='preview' className='w-full h-full object-cover border border-gray-200'/>
                    <div className='absolute top-0 left-0 flex justify-end gap-2 p-2 items-center right-0 w-full h-5'>
                      <X onClick={()=>(handleDeleteImage(index))} size='25' className='text-red-500'/>
                      <label>
                        <Edit2 size='20' className='text-green-500'/>
                      <input onChange={(e)=>(handleEditImage(e, index))} multiple type='file' accept='image/*' className='bg-red-500 hidden w-5' />
                      </label>
                    </div>
                 </div>
                ))}
            </div>
            ):
            (<div className='w-full flex items-center justify-center gap-2 text-gray-400'>
              <CircleAlert size={20} />
              <p>Empty</p>
            </div>)}
          </div>
        </div>
        {isPreviewCard && images[selectedImageIndex] && <PreviewImage image={images[selectedImageIndex].image_url} setIsOpen={setIsPreviewCard}/>}  
    </div>
  )
}


export default CreateItems
