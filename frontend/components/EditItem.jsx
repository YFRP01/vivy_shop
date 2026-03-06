import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { API_URL, BASE_URL } from '../api'
import { sources } from '../src/assets/assets'
import { AlertCircle, ChevronDown, ChevronUp, CircleAlert, Columns, Edit, Edit2, FlipVertical, Plus, PlusCircle, PlusCircleIcon, Pointer, Trash, X, XCircle } from 'lucide-react'
import PreviewImage from './PreviewImage'

const EditItem = ({itemId}) => {

  const ref = useRef()
  const startIndex = 1
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState('')
  const [errorForm, setErrorForm] = useState(null)
  const [isViewCategoryModal, setViewCategoryModal] = useState(false)
  const [isViewSource, setViewSource] = useState(false)
  const [isPreviewCard, setIsPreviewCard] = useState(false)
  const [displayNum, setDisplayNum] = useState(startIndex)
  const [viewCat, setViewCat] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [handWrittenCategoryName, setHandWrittenCategoryName] = useState('')
  const [handWrittenCategoryThumbnail, setHandWrittenCategoryThumbnail] = useState('')
  const [errorMessage, setErrorMessage] = useState({info:"", thumbnail: "", item: ""})
  const [selectInfosType, setSelectedInfosType] = useState('new')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: null,
    source: null,
    infos: [],
    thumbnails: []
  })
  const [backUpData, setBackupData] = useState(JSON.parse(JSON.stringify(formData)))
  
  const [newInfoData, setNewInfoData] = useState([
    {
      id: "",
      qty: "",
      cost: "",
      details: ""
    }
  ])

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
    const files = Array.from(e.target.files || []);
    const update = []
    if(!files) return
    for(let i=0; i < files.length; i++){
        update.push({image_id:"", image: URL.createObjectURL(files[i]), file: files[i]})
    } 
    setFormData((prev)=>({...prev, thumbnails: [...prev.thumbnails, ...update]}))
    e.target.value=""
  }

  const handleInsertCategoryImage = (e)=>{
    const file = e.target.files[0]
    if(!file) return
    setHandWrittenCategoryThumbnail(file)
    e.target.value=""
  }

  const handleDeleteImage = (index) =>{
        setFormData((prev)=>({...prev, thumbnails: prev.thumbnails.filter((_, i)=> i !== index)}))
  }

  const handleEditImage = (e, index)=>{
    const file= e.target.files[0]
    if(!file) return;
    const update = {image_id:"", image: URL.createObjectURL(file), file}  
    setFormData((prev)=>({...prev, thumbnails: prev.thumbnails.map((img, i)=>( i === index ? update : img))}))
  }

  const handleRadio = (e, input, type)=>{
    if(type.includes('cat')){
        setFormData(prev=>({...prev, 
          category: input, 
        }))
        setTimeout(() => {
          setViewCategoryModal(false)
        }, 300)
    }
    else if(type.includes('source')) {
        setTimeout(() => {
          setFormData(prev=>({...prev, source: input}))
          setViewSource(false)
        }, 300)
    }
    else {
      console.log('Error in handleRadio: type not recognized -', type);
      return null
    }
  }

  const addNewBlock = ()=>{
    if(isValid(newInfoData[newInfoData.length-1])){
        setNewInfoData((prev)=>([...prev, {id: "", qty: "", cost: "", details: ""}]))
        setErrorMessage({info:"", thumbnail: "", item: ""})
    }
    else setErrorMessage((prev)=>({...prev, info: "Empty field found!"}))
  }

  const handleDelInfo = (index) =>{
    const update = formData?.infos.filter((_, i)=> i !== index)
    setFormData(prev=>({...prev, infos: update}))
    setErrorMessage({info:"", thumbnail: "", item: ""})
  }

  const handleNewDelInfo = (index) =>{
    const updateNew = newInfoData.filter((_, i)=> i !== index)
    if(newInfoData.length < 2){
      setErrorMessage(prev=>({...prev, info: "Fill this info or leave it empty"}))
    }
    else {
      setNewInfoData(updateNew)
      setErrorMessage({info:"", thumbnail: "", item: ""})
    }
  }

  const handleInfoMore = () =>{
    if(displayNum === startIndex) setDisplayNum(formData?.infos.length); 
    else setDisplayNum(startIndex);      
  }

  const handleInfoType = (selectedInf) =>{
    setSelectedInfosType(selectedInf)
  }

  const handleCategoryRadio = () =>{
      setViewCategoryModal(!isViewCategoryModal)
  }

  const resetForm = ()=>{
    setFormData(JSON.parse(JSON.stringify(backUpData)))
    setNewInfoData([{id: "", qty: "", cost: "", details: ""}])
    setViewCategoryModal(false)
    setHandWrittenCategoryName('')
    setHandWrittenCategoryThumbnail('')
    setErrorMessage({info:"", thumbnail: "", item: ""})
    setViewSource(false)
    setIsPreviewCard(false)
    setViewCat(false)
    setSelectedImageIndex(null)
    setDisplayNum(startIndex)
    setErrorForm({status: true, message: "Reset successful", type: "reset"})
  }

  const ItemDetails = async()=>{
    try {
      const response = await axios.get(`${API_URL}/items/developer/${itemId}`)
      const data = response.data[0]        
      const newData = {
          name: data.name || '',
          description: data.description || '',
          category: data.category || null,
          source: data.source || null,
          infos: data.infos || [],
          thumbnails: data.thumbnails || []
        }
        setFormData(JSON.parse(JSON.stringify(newData)))
        setBackupData(JSON.parse(JSON.stringify(newData)))
      } 
      catch (error) {
      console.log(`Unable to fetch the item details: ${error}`)
    }
  }

    const isValid = (elt)=>{
      return (
        elt.qty && elt.qty !== null && elt.qty !== "" &&
        elt.cost && elt.cost !== null && elt.cost !== "" &&
        elt.details && elt.details !== null && elt.details !== ""
      )
    }    
  
  const SubmitForm = ()=>{
    setErrorForm(null)

    //handle category
    if(viewCat) {
        if(handWrittenCategoryName.trim() && handWrittenCategoryThumbnail) {
          setFormData(prev=>({...prev, category: {id: "", name: handWrittenCategoryName, image: handWrittenCategoryThumbnail}}))
        }
        else {setErrorMessage(prev=>({...prev, item: "Empty category fields detected for creation"}))}
    }

    //handle info 
    let fillNewInfo = []
    let mainInfoArray = formData?.infos

    const isDuplicate = (newInfo)=>{
      return(
        mainInfoArray.some((info)=> info.qty === newInfo.qty && info.cost === newInfo.cost && info.details === newInfo.details)
      )
    }
    //map
    newInfoData.forEach((info, index)=>{
      if(isValid(info)){
          if(!isDuplicate(info)){
                mainInfoArray.push(info)
                setErrorMessage(prev=>({...prev, info: "New info insert successfull"}))
              }
          else {
              setErrorMessage(prev=>({...prev, info: `Item at index ${index+formData?.infos?.length || null} already existing. Duplicate items deleted`}))
            }
        }      
      else{
        fillNewInfo.push(info)
        setErrorForm(prev=>({...prev, info: "Incomplete infos identified"}))
      }
    })
    setFormData(prev=>({...prev, infos: [...mainInfoArray]}))  
    setNewInfoData([])
    setNewInfoData(([...fillNewInfo]))
  }
  
  const allCategories = async () =>{
    setLoading('')
    try {
      const response = await axios.get(`${API_URL}/categories`)
      setCategories(response.data)
    } catch (error) {
      console.log(`Unable to get all categories: ${error.message}`);
    }
    finally{
      setLoading('')
    }
  }

  const putSubmitItem = async () =>{
    try {
      const response = await axios.put(`${API_URL}/developer/full/${itemId}`)
      setErrorForm(response.data)
    } catch (error) {
      setErrorForm(error)
      console.log(error)
    }
  }

  useEffect(()=>{
    ItemDetails()
  },[itemId])

  useEffect(()=>{
    const lastElement = newInfoData[newInfoData.length-1]
    if(lastElement?.qty && lastElement?.cost && lastElement?.details)
      addNewBlock()
  },[newInfoData])
  
  useEffect(()=>{
        allCategories()
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
   

  return (
    <div className='flex flex-col h-full gap-2 w-full px-2 md:px-30 lg:px-30 xl:px-40'>

      {errorForm && (<div className={` font-bold text-center ${errorForm?.type === 'submit' && errorForm?.status && 'bg-green-100 text-green-500'} ${errorForm?.type === 'submit' && !errorForm?.status && 'bg-red-100 text-red-500'} ${errorForm?.type === 'reset' && 'text-yellow-500 bg-yellow-100'}`}>
        {errorForm?.message}
      </div>)}
      {/*-----------------------------------------
        items
      -----------------------------------------*/}
        <div className='flex flex-col gap-2'>
          <div className=''>
            <div className='w-full flex justify-between items-center'>
              <p className='text-blue-500'>Item</p>
              <div className='w-full font-medium text-sm text-white flex justify-end items-center gap-3 px-2 py-1'>
                <button onClick={resetForm} className='bg-orange-400 border-none w-20 h-7 md:w-25 md:h-8 rounded-md cursor-pointer'>Reset</button>
                <button onClick={SubmitForm} className='bg-green-500 border-none w-20 h-7 md:w-25 md:h-8 p-1 rounded-md cursor-pointer'>Submit</button>
              </div>
            </div>
            {/* name */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Name <span className='text-red-500'>*</span></h2>
            <input 
            type='text' value={formData?.name} placeholder={formData?.name} 
            onChange={((e)=>(setFormData((prev)=>({...prev, name: e.target.value}))))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* description */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Description</h2>
            <textarea 
            onKeyDown={(e)=>(handleShow(e, 'Description', formData?.description))} 
            value={formData?.description} placeholder={formData?.description} onChange={((e)=>(setFormData((prev)=>({...prev, description: e.target.value}))))} 
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
                    Create
                </label> 
              </div>
            </div>
            <div className='flex flex-col lg:flex-row lg:items-center gap-1 w-full'>
              {/* {viewCat && ( */}
              <div className={`lg:flex-1` }>
                {!viewCat && (
                <div className={`space-y-2`}>
                  <label className='w-full flex items-center '>
                    <input type='text' placeholder={formData?.category} readOnly value={formData?.category?.name} onClick={()=>(handleCategoryRadio())} 
                    className='w-full h-full border border-gray-500 cursor-pointer text-gray-800 px-1 rounded-sm'/>
                  </label>
                  <label className='flex items-center justify-center w-full'>
                    <div className='h-20 lg:h-30 w-full rounded-md border text-gray-500 text-sm border-gray-300'>
                      {formData?.category?.image ? (
                        <img src={`${BASE_URL}${formData?.category?.image}`} alt={`${formData?.category?.name} preview`} className='object-cover h-full w-full'/>)
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
                    placeholder='Custom name ...' value={handWrittenCategoryName} onChange={(e)=>(setHandWrittenCategoryName(e.target.value))}/>
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
                      <label key={cat.id} onClick={(e)=>(handleRadio(e, cat, 'cat'))} 
                        className={`flex gap-1 hover:bg-blue-100 px-1 rounded-md break-all`}>
                          <input
                          type='radio' value={cat.category_name} name='category' required={index === 0}/>
                          {cat.name}
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
                {formData?.source ? formData?.source?.name : formData?.source?.name}
              </button>
            </div>
            {isViewSource && (
                <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/10 transition-all duration-500 ease-in-out w-full h-screen z-100'>
                  <div className='bg-ed-500 h-full w-full flex justify-center relative'>
                   <div ref={ref} className='absolute top-71 w-64 transition-all duration-500 ease-in-out max-h-100 overflow-y-auto bg-white rounded-lg border border-blue-300 text-gray-800 p-2 flex flex-col gap-1'>
                        {sources?.map((s)=>(
                        <label key={s.id} onClick={(e)=>(handleRadio(e, s, 'source'))} className={`flex gap-1 hover:bg-blue-100 px-1 rounded-md break-all`}>
                            <input
                            type='radio' placeholder={'source name'+s.name} value={s.name} name='source' />
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
              <p>Infos (<span className='text-green-500'>{formData?.infos?.length || 0}</span>)</p>
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
            {formData?.infos?.length>0 && <div className='flex items-center justify-center text-blue-500'>
            {formData?.infos?.length > startIndex &&
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
          {errorMessage?.info && (
            <div className='bg-red-50 text-red-500 flex gap-1 items-center justify-center transition-all duration-200 ease-in-out '>
                <AlertCircle className='' size={15}/>
                <p className='text-center'>{errorMessage?.info}</p>
            </div>          
          )}
          {newInfoData?.map((i, index)=>(
            <div key={index} className={`border-t relative border-blue-200 transition-all duration-700 ease-in-out`}>
              <div className='flex justify-between px-2 p-1 text-sm'>
                <p className='bg-blue-400 border border-gray-600 text-white p-1 w-5 h-5 flex items-center justify-center rounded-full'>{formData?.infos?.length+index+1 || 0}</p>
                <Trash onClick={()=>(handleNewDelInfo(index))} className='text-red-500 text-center w-5 h-5 cursor-pointer'/>
              </div>
         
          {/* Qty */}
          <div className='flex gap-2 p-1'>
            <h2 className='flex gap-1 font-medium'>Quantity <span className='text-red-500'>*</span></h2>
            <input 
            type='number' min={1} step={1} value={i?.qty} placeholder='Quantity' onChange={((e)=>(handleNewInfoChange(e, 'qty', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* cost */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Cost <span className='text-red-500'>*</span></h2>
            <input 
            type='number' value={i?.cost} min={0} placeholder='Cost' onChange={((e)=>(handleNewInfoChange(e, 'cost', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* details */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Details</h2>
            <textarea
            type='text' value={i?.details} placeholder='Details ' onChange={((e)=>(handleNewInfoChange(e, 'details', index)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            />
          </div>
          </div>
          ))}
        </div>)}
        </div>

      </div>

      {/*-----------------------------------------
        thumbnails
      -----------------------------------------*/}

      <div className='w-full'>
          <div className='flex items-center justify-between '>
            <p className='text-blue-500'>Thumbnails (<span className='text-green-500'>{formData?.thumbnails?.length || 0})</span> <span className='text-red-500'>*</span></p>
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
                {formData?.thumbnails?.map((i, index)=>(
                <div key={index} className='relative flex flex-col items-center justify-center w-50 rounded-md text-gray-600 border border-gray-400 bg-white'>
                    <img onClick={()=>(setSelectedImageIndex(index), setIsPreviewCard(true))} 
                    src={i?.image_id ? `${BASE_URL}/${i?.image}` : i?.image} alt={`preview ${index+1}`} className='w-full h-full object-cover border border-gray-200'/>
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
          {isPreviewCard && formData?.thumbnails[selectedImageIndex]?.image && <PreviewImage image={formData?.thumbnails[selectedImageIndex]?.image} setIsOpen={setIsPreviewCard}/>}  
    </div>
  )
}

export default EditItem