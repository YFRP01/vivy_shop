import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { API_URL, BASE_URL } from '../api'
import { sources } from '../src/assets/assets'
import { AlertCircle, ChevronDown, ChevronUp, CircleAlert, Columns, Edit, Edit2, FlipVertical, Plus, PlusCircle, PlusCircleIcon, Pointer, Trash, X, XCircle } from 'lucide-react'
import PreviewImage from './PreviewImage'

const EditItem = ({itemId, selectedItem}) => {

  const ref = useRef()
  const startIndex = 1
  const [categories, setCategories] = useState([])
  const [isViewCategoryModal, setViewCategoryModal] = useState(false)
  const [isViewSource, setViewSource] = useState(false)
  const [isPreviewCard, setIsPreviewCard] = useState(false)
  const [displayNum, setDisplayNum] = useState(startIndex)
  const [viewCat, setViewCat] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [handWrittenCategory, setHandWrittenCategory] = useState('')
  const [handWrittenCategoryThumbnail, setHandWrittenCategoryThumbnail] = useState('')
  const [infoError, setInfoError] = useState('')
  const [selectInfosType, setSelectedInfosType] = useState('new')
  const [backUpData, setBackupData] = useState(null)
  const [formData, setFormData] = useState({
    name: selectedItem.name,
    description: selectedItem.description,
    category: selectedItem.category,
    source: selectedItem.source,
    infos: [],
    thumbnails: [],
    categoryImage: categories[categories.findIndex((it)=> it.category_name === selectedItem.category)]?.image
  })
  const [newInfoData, setNewInfoData] = useState([
    {
      qty: "",
      cost: "",
      details: ""
    }
  ])

  const getDetails = async()=>{
    try {
        const response = await axios.get(`${API_URL}/items/developer/${itemId}`)
        const temp = response.data[0]
        const newData = {
          name: temp.name,
          description: temp.description,
          category: temp.category,
          source: temp.source,
          infos: temp.infos,
          thumbnails: temp.thumbnails,
          category_image: temp.category_image
        }
        setFormData(newData)
        setBackupData(newData)
    } catch (error) {
        console.log(`${error.message}`);
    }
  }

  console.log(backUpData);

  const resetForm = ()=>{
    setFormData({
    name: selectedItem.name,
    description: selectedItem.description,
    category: selectedItem.category,
    source: selectedItem.source,
    infos: backUpData?.infos,
    thumbnails: [],
    categoryImage: categories[categories.findIndex((it)=> it.category_name === selectedItem.category)]?.image
    })
    setNewInfoData([{qty: "", cost: "", details: ""}])
    setViewCategoryModal(false)
    setHandWrittenCategory('')
    setHandWrittenCategoryThumbnail('')
    setInfoError('')
    setSelectedInfosType('new')
    setViewSource(false)
    setIsPreviewCard(false)
    setViewCat(false)
    setSelectedImageIndex(null)
    setDisplayNum(startIndex)
  }

  const handleShow = (e, value, input)=>{
        if(e.key === 'Enter' && input.trim()){
            console.log(value, ':', input);
        }
  }

  const handleChange = (e, field, index)=>{
    const val = e.target.value
    setFormData((prev)=> ({...prev, 
    infos: prev.infos.map((info, i) => 
        i === index 
            ? { ...info, [field]: val }
            : info
    )}))  
  }

  const handleNewInfoChange = (e, field, index)=>{
    const val = e.target.value
    setNewInfoData((prev)=> (prev.map((item, i)=> index === i ? 
        {...item, 
          [field]: val
        }
          : item 
    )))    
  }

  const handleInsertImage = (e)=>{
    const files = e.target.files;
    const update = []
    if(!files) return
    for(let i=0; i < files.length; i++){
        update.push(URL.createObjectURL(files[i]))
    } 
    setFormData((prev)=>({...prev, thumbnails: [...prev.thumbnails, ...update]}))
    e.target.value=""
  }

  const handleInsertCategoryImage = (e)=>{
    const file = e.target.files[0]
    // const update = {file, image_url: URL.createObjectURL(file)}
    if(!file) return
    setHandWrittenCategoryThumbnail(URL.createObjectURL(file))
    // setFormData((prev=>({...prev, categoryImage: URL.createObjectURL(file)})))
    e.target.value=""
  }

  const handleDeleteImage = (index) =>{
        setFormData((prev)=>({...prev, thumbnails: prev.thumbnails.filter((_, i)=> i !== index)}))
  }

  const handleEditImage = (e, index)=>{
    const file= e.target.files[0]
    if(!file) return;
    const update = {image_url: URL.createObjectURL(file), file}
    setFormData((prev)=>({...prev, thumbnails: prev.thumbnails.map((img, i)=>( i === index ? update : img))}))
  }

  const handleRadio = (e, input, type, index)=>{
    if(type.includes('cat')){
        setFormData(prev=>({...prev, 
          category: input, 
          categoryImage: categories[index]?.image
        }))
        setTimeout(() => {
          setViewCategoryModal(false)
        }, 300);
    }
    else if(type.includes('source')) {
        setTimeout(() => {
          setFormData(prev=>({...prev, source: input}))
          setViewSource(false)
        }, 300);
    }
    else {
      console.log('Error in handleRadio: type not recognized -', type);
      return null
    }
  }

  const addNewBlock = ()=>{
    if(newInfoData[newInfoData.length-1]?.cost && newInfoData[newInfoData.length-1]?.details && newInfoData[newInfoData.length-1]?.qty){
        setNewInfoData((prev)=>([...prev, {qty: "", cost: "", details: ""}]))
        setInfoError('')
    }
    else setInfoError('Empty field found!')
  }

  const handleDelInfo = (index) =>{
    const update = formData.infos.filter((_, i)=> i !== index)
    setFormData(prev=>({...prev, infos: update}))
    setInfoError('')
  }

  const handleNewDelInfo = (index) =>{
    const updateNew = newInfoData.filter((_, i)=> i !== index)
    if(newInfoData.length < 2){
      setInfoError(`Fill this info or leave it empty`)
    }
    else {
      setNewInfoData(updateNew)
      setInfoError('')
    }
  }

  const handleInfoMore = () =>{
    if(displayNum === startIndex) setDisplayNum(formData.infos.length); 
    else setDisplayNum(startIndex);      
  }

  const handleInfoType = (selectedInf) =>{
    setSelectedInfosType(selectedInf)
  }

  const handleCategoryRadio = () =>{
      setViewCategoryModal(!isViewCategoryModal)
      // setFormData((prev)=>({...prev, 
      //   category: '', 
      //   categoryImage: {}
      // }))  
  }

  const catImageBySelectedCategory = ()=>{
    const index = categories.findIndex((cat)=>cat.category_name === formData.category)
    setFormData((prev)=>({...prev, categoryImage: categories[index]?.image}))
  }
 
  const allCategories = async () =>{
    try {
      const response = await axios.get(`${API_URL}/categories`)
      setCategories(response.data)
    } catch (error) {
      console.log(`Unable to get all categories: ${error.message}`);
    }
  }

  const getInfos = async()=>{
    try {
      const response = await axios.get(`${API_URL}/infos/${itemId}`)
      const holdInfos = response.data
      setFormData((prev)=>({...prev, infos: holdInfos}))
    } catch (error) {
      console.log(`Unable to get the infos ${error.message}`);
    }
  } 

  const getThumbnails = async()=>{
    try {
      const response = await axios.get(`${API_URL}/thumbnails/developer/${itemId}`)  
      setFormData((prev)=>({...prev, thumbnails: response.data}))
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(()=>{
    getDetails()
    getThumbnails()
    getInfos()  
  }, [itemId])
  
  useEffect(()=>{
    allCategories()
    formData.infos
  }, [])

  useEffect(()=>{
    const handle = (event) => {
        if(ref.current && !ref.current.contains(event.target)){
            setViewCategoryModal(false)
            setViewSource(false)
        }
    }

    window.document.addEventListener('mousedown',handle)
    return (()=>{
        window.document.removeEventListener('mousedown', handle)
    })
    }, []) 

    useEffect(()=>{
      catImageBySelectedCategory()
    },[formData.category])
   

  return (
    <div className='flex flex-col h-full gap-2 w-full px-2 md:px-30 lg:px-30 xl:px-40'>

      {/*-----------------------------------------
        items
      -----------------------------------------*/}
        <div className='flex flex-col gap-2'>
          <div className=''>
            <div className='w-full flex justify-between items-center'>
              <p className='text-blue-500'>Item</p>
              <div className='w-full font-medium text-sm text-white flex justify-end items-center gap-3 px-2 py-1'>
                <button onClick={resetForm} className='bg-orange-400 border-none w-20 h-7 md:w-25 md:h-8 rounded-md cursor-pointer'>Reset</button>
                <button onClick={resetForm} className='bg-green-500 border-none w-20 h-7 md:w-25 md:h-8 p-1 rounded-md cursor-pointer'>Submit</button>
              </div>
            </div>
            {/* name */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Name <span className='text-red-500'>*</span></h2>
            <input 
            type='text' value={formData?.name} placeholder={selectedItem?.name} 
            onChange={((e)=>(setFormData((prev)=>({...prev, name: e.target.value}))))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* description */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Description</h2>
            <textarea 
            onKeyDown={(e)=>(handleShow(e, 'Description', formData.description))} 
            value={formData?.description} placeholder={selectedItem.description} onChange={((e)=>(setFormData((prev)=>({...prev, description: e.target.value}))))} 
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
                    <input type='checkbox' name='whichCat' 
                    onChange={(e)=>(setViewCat(e.target.checked))} checked={viewCat} className='cursor-pointer'/>
                    Default
                </label> 
              </div>
            </div>
            <div className='flex flex-col lg:flex-row lg:items-center gap-1 w-full'>
              {/* {viewCat && ( */}
              <div className={`lg:flex-1` }>
                {!viewCat && (
                <div className={`space-y-2`}>
                  <label className='w-full flex items-center '>
                    <input type='text' placeholder={selectedItem.category} readOnly value={formData?.category} onClick={()=>(handleCategoryRadio())} 
                    className='w-full h-full border border-gray-500 cursor-pointer text-gray-800 px-1 rounded-sm'/>
                  </label>
                  <label className='flex items-center justify-center w-full'>
                    <div className='h-20 lg:h-30 w-full bg-white rounded-md border text-gray-500 text-sm border-gray-300'>
                      {formData?.categoryImage ? (
                        <img src={`${BASE_URL}${formData?.categoryImage}`} alt={`${formData.category} preview`} className='object-cover h-full w-full'/>)
                        :
                      (<p className='text-center h-full flex items-center justify-center gap-1'>
                        <AlertCircle size={15} /><span>No category image found</span>
                      </p>)}
                    </div>
                      {/* <input type='file' accept='image/*' onChange={(e)=>(handleInsertCategoryImage(e))} className='hidden'/> */}
                  </label>
                </div>
                )}

              {viewCat && (
                  <div className={`space-y-2`}>
                  <label className='w-full flex items-center'>
                    <input type='text' 
                    className={`focus:ring-2 h-full w-full border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` } 
                    placeholder='Custom name ...' value={handWrittenCategory} onChange={(e)=>(setHandWrittenCategory(e.target.value))}/>
                  </label>
                  <label className='flex items-center justify-center w-full'>
                      <div className='h-20 lg:h-30 w-full bg-white rounded-md border text-gray-500 text-sm border-gray-300'>
                        {handWrittenCategoryThumbnail ? (<img src={handWrittenCategoryThumbnail} alt='category preview' className='object-cover h-full w-full'/>):
                        (<p className='text-center h-full flex items-center justify-center gap-2'>
                          <Pointer size='20' />
                          <span>Select image</span></p>
                        )}
                      </div>
                      <input type='file' accept='image/*' onChange={(e)=>(handleInsertCategoryImage(e))} className='hidden'/>
                  </label>
                  </div>
                )}
              </div>
            </div>
            {isViewCategoryModal && (
              <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/5 transition-all duration-500 ease-in-out w-full h-screen z-53'>
                <div className='bg-ed-500 h-full w-full flex justify-center relative'>
                  <div ref={ref} className='absolute top-43 w-64 transition-all duration-500 ease-in-out max-h-100 overflow-y-auto bg-white rounded-lg border border-blue-300 text-gray-800 p-2 flex flex-col gap-1'>
                      {categories.map((cat, index)=>(
                      <label key={cat.category_id} onClick={(e)=>(handleRadio(e, cat.category_name, 'cat', index))} 
                        className={`flex gap-1 hover:bg-blue-100 px-1 rounded-md break-all`}>
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
                {formData.source? formData.source : selectedItem.source}
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
          <div className='text-blue-500'>
              <p>Infos (<span className='text-green-500'>{formData?.infos?.length}</span>)</p>
              <div className='flex text-sm '>
                    <p onClick={()=>(handleInfoType('new'))} className={`${selectInfosType === 'new' ? ' border-b text-white bg-blue-500 hover:bg-blue-700':'hover:bg-blue-100'} cursor-pointer transition-colors duration-200 ease-in flex-1 text-center`}>Add</p>
                    <p onClick={()=>(handleInfoType('old'))} className={`${selectInfosType === 'old' ? ' border-b text-white bg-blue-500 hover:bg-blue-700':'hover:bg-blue-100'} cursor-pointer transition-colors duration-200 ease-in flex-1 text-center`}>Ancient</p>
              </div>
          </div>

          {/* old */}
          
        {selectInfosType === 'old' &&
        (<div>
          {formData?.infos?.slice(0,displayNum).map((i, index)=>(
            <div key={index} className={`border-t relative border-blue-200 transition-all duration-700 ease-in-out`}>
              <div className='flex justify-between px-2 p-1 text-sm'>
                <p className='bg-blue-400 border border-gray-600 text-white p-1 w-5 h-5 flex items-center justify-center rounded-full'>{index+1}</p>
                <Trash onClick={()=>(handleDelInfo(index))} className='text-red-500 text-center w-5 h-5 cursor-pointer'/>
              </div>
         
          {/* Qty */}
          <div className='flex gap-2 p-1'>
            <h2 className='flex gap-1 font-medium'>Quantity <span className='text-red-500'>*</span></h2>
            <input 
            type='number' min={1} step={1} value={i.qty} placeholder='Quantity' onChange={((e)=>(handleChange(e, 'qty', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* cost */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Cost <span className='text-red-500'>*</span></h2>
            <input 
            type='number' value={i.cost} min={0} placeholder='Cost' onChange={((e)=>(handleChange(e, 'cost', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* details */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Details</h2>
            <textarea
            type='text' value={i.details} placeholder='Details ' onChange={((e)=>(handleChange(e, 'details', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            />
          </div>
          </div>
          ))}
          <div className='flex items-center gap-5 p-2 justify-center'>
            {formData.infos?.length>0 && <div className='flex items-center justify-center text-blue-500'>
            {formData.infos?.length > startIndex &&
              <button onClick={()=>(handleInfoMore())} className='flex gap-1 items-center justify-center p-2 bg-blue-500 text-white rounded-lg outline'>
                  {displayNum !== startIndex ? 
                  (<span className='flex gap-1 items-center justify-center'>Less <ChevronUp /></span>)
                  : 
                  (<span className='flex gap-1 items-center justify-center'>More <ChevronDown /></span>)}
              </button>
            }
          </div>}
          </div>
        </div>)}

        {/* new */}

        {selectInfosType === 'new' &&
        (<div className='space-y-2 py-2'>
          {infoError && (
            <div className='bg-red-50 text-red-500 flex gap-1 items-center justify-center transition-all duration-200 ease-in-out '>
                <AlertCircle className='' size={15}/>
                <p className='text-center'>{infoError}</p>
            </div>          
          )}
          {newInfoData?.map((i, index)=>(
            <div key={index} className={`border-t relative border-blue-200 transition-all duration-700 ease-in-out`}>
              <div className='flex justify-between px-2 p-1 text-sm'>
                <p className='bg-blue-400 border border-gray-600 text-white p-1 w-5 h-5 flex items-center justify-center rounded-full'>{formData?.infos?.length+index+1}</p>
                <Trash onClick={()=>(handleNewDelInfo(index))} className='text-red-500 text-center w-5 h-5 cursor-pointer'/>
              </div>
         
          {/* Qty */}
          <div className='flex gap-2 p-1'>
            <h2 className='flex gap-1 font-medium'>Quantity <span className='text-red-500'>*</span></h2>
            <input 
            type='number' min={1} step={1} value={i.qty} placeholder='Quantity' onChange={((e)=>(handleNewInfoChange(e, 'qty', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* cost */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Cost <span className='text-red-500'>*</span></h2>
            <input 
            type='number' value={i.cost} min={0} placeholder='Cost' onChange={((e)=>(handleNewInfoChange(e, 'cost', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* details */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Details</h2>
            <textarea
            type='text' value={i.details} placeholder='Details ' onChange={((e)=>(handleNewInfoChange(e, 'details', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            />
          </div>
          </div>
          ))}
            <button onClick={()=>(addNewBlock())} className='bg-blue-100 mx-auto m-2 h-fit gap-1 p-2 text-blue-500 rounded-lg outline transitiion-all duration-800 ease-in bg-red-5000 flex items-center justify-center'>          
                <PlusCircle className='w-5 h-5' />
                Add More Infos
            </button>
        </div>)}
        </div>

      </div>


      {/*-----------------------------------------
        thumbnails
      -----------------------------------------*/}

      <div className='w-full'>
          <div className='flex items-center justify-between '>
            <p className='text-blue-500'>Thumbnails (<span className='text-green-500'>{formData?.thumbnails.length})</span> <span className='text-red-500'>*</span></p>
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
                {formData.thumbnails?.map((i, index)=>(
                <div key={index} className='relative flex flex-col items-center justify-center w-50 rounded-md text-gray-600 border border-gray-400 bg-white'>
                    <img onClick={()=>(setSelectedImageIndex(index), setIsPreviewCard(true))} 
                    src={`${BASE_URL}${i}`} alt={`preview ${index+1}`} className='w-full h-full object-cover border border-gray-200'/>
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
          {isPreviewCard && formData.thumbnails[selectedImageIndex] && <PreviewImage image={formData.thumbnails[selectedImageIndex]} setIsOpen={setIsPreviewCard}/>}  
    </div>
  )
}

export default EditItem