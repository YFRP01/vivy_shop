import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { API_URL } from '../../api'
import { sources } from '../../src/assets/assets'
import { ChevronDown, ChevronUp, Edit, Edit2, Plus, PlusCircle, X } from 'lucide-react'
import PreviewImage from '../../components/PreviewImage'
import { useParams } from 'react-router-dom'

const EditItem = () => {

  const {id} = useParams()
  const ref = useRef()

  const beginIndex = 3
  const [categories, setCategories] = useState([])
  const [nameInput, setNameInput] = useState('')
  const [descriptionInput, setDescriptionInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [sourceInput, setSourceInput] = useState('')
  const [isViewCategory, setViewCategory] = useState(false)
  const [isViewSource, setViewSource] = useState(false)
  const [isPreviewCard, setIsPreviewCard] = useState(false)
  const [displayNum, setDisplayNum] = useState(beginIndex)
  const [viewCat, setViewCat] = useState(false)
  const [catImages, setCatImages] = useState()
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [holdInfos, setHoldInfos] = useState([])
  const [images, setImages] = useState([])
  const [infoBackup, setInfoBackup] = useState([])

  const getDetails = async()=>{
    try {
        const response = await axios.get(`${API_URL}/items/developer/${id}`)
        const temp = response.data[0]
        setHoldInfos(temp.infos)
        setInfoBackup(temp.infos)
        setImages(temp.thumbnails)
        setNameInput(temp.name)
        setDescriptionInput(temp.description)
        setSourceInput(temp.source)
        setCategoryInput(temp.category)
        setCatImages(temp.category_image)
        
    } catch (error) {
        console.log(`${error.message}`);
    }
  }

  
  const clearForm = ()=>{
      setNameInput('')
      setDescriptionInput('')
      setCategoryInput('')
      setSourceInput('')
      setHoldInfos([{qty: "", cost: "", details: ""}])
      setImages([])
      setCatImages({})
  }
  const handleShow = (e, value, input)=>{
        if(e.key === 'Enter' && input.trim()){
            console.log(value, ':', input);
        }
  }

  const handleChange = (e, field, index)=>{
    const update = [...holdInfos];
    update[index][field] = e;
    setHoldInfos(update)
  }

  const addNewBlock = ()=>{
    setHoldInfos([...holdInfos, {qty: "", cost: "", details: ""}]); 
    setDisplayNum(holdInfos.length + 1)
  }

  const handleInsertImage = (e)=>{
    const files = e.target.files;
    const update = []
    if(!files) return
    for(let i=0; i < files.length; i++){
        update.push({file: files[i], image_url: URL.createObjectURL(files[i])})
    } 
    setImages((prev)=>[...prev, ...update])
    e.target.value=""
  }

  const handleInsertCategoryImage = (e)=>{
    const file = e.target.files[0]
    const update = {file, image_url: URL.createObjectURL(file)}
    if(!file) return;
    setCatImages(update)
    e.target.value=""
    

  }
  const handleDeleteImage = (index) =>{
    setImages((prev)=>prev.filter((_, i)=> i !== index))
  }

  const handleEditImage = (e, index)=>{
    const file= e.target.files[0]
    if(!file) return;
    const update = {image_url: URL.createObjectURL(file), file}
    setImages((prev)=>prev.map((img, i)=>( i=== index ? update : img)))
  }

  const handleRadio = (e, input, type)=>{
    if(type.includes('cat')){
        setTimeout(() => {
          setCategoryInput(input)
          setViewCategory(false)
        }, 300);
    }
    else if(type.includes('source')) {
        setTimeout(() => {
          setSourceInput(input)
          setViewSource(false)
        }, 300);
    }
    else {
      console.log('error');
      return null
    }
  }

  const handleInfoMore = () =>{
        if(displayNum === beginIndex) setDisplayNum(holdInfos.length); 
        else setDisplayNum(beginIndex);      
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
    getDetails()
  }, [id])
  
  useEffect(()=>{
    allCategories()
    holdInfos
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
    <div className='flex flex-col h-full w-full px-2 md:px-30 lg:px-50 xl:px-70'>

      {/*-----------------------------------------
        items
      -----------------------------------------*/}
        <div className='flex flex-col gap-2'>
          <div className=''>
            <div className='w-full flex justify-between items-center'>
              <p className='text-blue-500'>Item</p>
              <div className='w-full font-medium text-sm text-white flex justify-end items-center gap-3 px-2 py-1'>
                <button onClick={()=>(setHoldInfos([]), setHoldInfos(infoBackup))} className='bg-orange-400 border-none w-20 h-7 md:w-25 md:h-8 rounded-md cursor-pointer'>Reset</button>
                <button onClick={()=>(clearForm())} className='bg-green-500 border-none w-20 h-7 md:w-25 md:h-8 p-1 rounded-md cursor-pointer'>Submit</button>
              </div>

            </div>
            {/* name */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Name <span className='text-red-500'>*</span></h2>
            <input 
            type='text' value={nameInput} placeholder='Enter the item name ...' onChange={((e)=>(setNameInput(e.target.value)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            required/>
          </div>
          {/* description */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Description</h2>
            <textarea 
            onKeyDown={(e)=>(handleShow(e, 'Description', descriptionInput))} value={descriptionInput} placeholder='Enter the item name ...' onChange={((e)=>(setDescriptionInput(e.target.value)))} 
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
                    <textarea placeholder='select' readOnly value={categoryInput} onClick={()=>(setViewCategory(!isViewCategory))} 
                    className='w-full h-full border border-gray-500 cursor-pointer text-gray-500 px-1 rounded-sm'/>
                    </label>
                  </div>
              )}
              {viewCat && (
                  <div className={`lg:flex-1 flex gap-2 flex-col`}>
                        <label className='w-full flex items-center'>
                          <textarea type='text' 
                          className={`focus:ring-2 h-full w-full border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` } 
                          placeholder='Custom name ...' value={categoryInput} onChange={(e)=>(setCategoryInput(e.target.value))}/>
                        </label>
                        <label className='flex items-center justify-center w-full'>
                            <img src={catImages?.image_url} alt={catImages ? 'category preview':'Select image'} className='object-cover h-20 lg:h-30 w-full rounded-md border text-gray-500 text-sm border-gray-300'/>
                            <input type='file' accept='image/*' onChange={(e)=>(handleInsertCategoryImage(e))} className='hidden'/>
                        </label>
                  </div>
              )}
            </div>
            {isViewCategory && (
                <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/5 transition-all duration-500 ease-in-out w-full h-screen z-53'>
                  <div className='bg-ed-500 h-full w-full flex justify-center relative'>
                   <div ref={ref} className='absolute top-63 w-64 transition-all duration-500 ease-in-out max-h-100 overflow-y-auto bg-white rounded-lg border border-blue-300 text-gray-800 p-2 flex flex-col gap-1'>
                        {categories.map((cat, index)=>(
                        <label key={cat.category_id} onClick={(e)=>(handleRadio(e, cat.category_name, 'cat'))} className={`flex gap-1 hover:bg-blue-100 px-1 rounded-md break-all`}>
                            <input
                            type='radio' onChange={(e)=>(setCategoryInput(e.target.value))} value={cat.category_name} name='category' required={index === 0}/>
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
                {sourceInput? sourceInput:'select'}
              </button>
            </div>
            {isViewSource && (
                <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/10 transition-all duration-500 ease-in-out w-full h-screen z-100'>
                  <div className='bg-ed-500 h-full w-full flex justify-center relative'>
                   <div ref={ref} className='absolute top-71 w-64 transition-all duration-500 ease-in-out max-h-100 overflow-y-auto bg-white rounded-lg border border-blue-300 text-gray-800 p-2 flex flex-col gap-1'>
                        {sources?.map((s)=>(
                        <label key={s.id} onClick={(e)=>(handleRadio(e, s.name, 'source'))} className={`flex gap-1 hover:bg-blue-100 px-1 rounded-md break-all`}>
                            <input
                            type='radio' onChange={(e)=>(setSourceInput(e.target.value))} value={s.name} name='source' />
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
          <p className='text-blue-500'>Infos ({holdInfos.length})</p>
          {holdInfos?.slice(0,displayNum).map((i, index)=>(
            <div key={index} className={`border-t border-blue-200 transition-all duration-700 ease-in-out`}>
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
          </div>
          ))}
        </div>
        <div className='flex items-center gap-5 p-2 justify-center'>
            <button onClick={()=>(addNewBlock())} className='bg-blue-100 h-fit gap-1 p-2 text-blue-500 rounded-lg outline transitiion-all duration-800 ease-in bg-red-5000 flex items-center justify-center'>          
                <PlusCircle className='w-5 h-5' />
                Add More Infos
            </button>
          {holdInfos.length>0 && <div className='flex items-center justify-center text-blue-500'>
            <button onClick={()=>(handleInfoMore())} className='flex gap-1 items-center justify-center p-2 bg-blue-500 text-white rounded-lg outline'>
                {displayNum !== beginIndex ? 
                (<span className='flex gap-1 items-center justify-center'>Less <ChevronUp /></span>)
                : 
                (<span className='flex gap-1 items-center justify-center'>More <ChevronDown /></span>)}
            </button>
        </div>}
        </div>
      </div>


      {/*-----------------------------------------
        thumbnails
      -----------------------------------------*/}

        <div className='w-full'>
          <p className='text-blue-500'>Thumbnails ({images.length}) <span className='text-red-500'>*</span></p>
          <div className='flex border border-gray-200 p-1 gap-3 w-full m-1 h-60 overflow-x-auto'>
            <div className='flex gap-2 p-1'>
                {images?.map((i, index)=>(
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
                <label
              className='flex flex-col items-center justify-center w-50 rounded-md text-gray-600 border border-gray-400 bg-blue-100'>
                  <input type='file' multiple accept='image/*' className='hidden'
                  onChange={(e)=>(handleInsertImage(e))} />
                  <Plus size={50} className=' font-extralight text-sm'/>
                  <p>Add Image</p>
              </label>
            </div>
          </div>
        </div>
          {isPreviewCard && images[selectedImageIndex] && <PreviewImage image={images[selectedImageIndex].image_url} setIsOpen={setIsPreviewCard}/>}  
    </div>
  )
}

export default EditItem








// import axios from 'axios'
// import React, { useEffect, useRef, useState } from 'react'
// import { API_URL } from '../../api'
// import { assets, sources } from '../../src/assets/assets'
// import { 
//   ArrowDownCircle, ArrowUpCircle, ChevronDown, ChevronUp, 
//   Edit2, Plus, PlusCircle, X, Save, RotateCcw, Image as ImageIcon,
//   Tag, Package, DollarSign, FileText, Camera, Layers
// } from 'lucide-react'
// import PreviewImage from '../../components/PreviewImage'
// import { useParams } from 'react-router-dom'

// const EditItem = () => {
//   const {id} = useParams()
//   const ref = useRef()
//   const originalDataRef = useRef(null)

//   const beginIndex = 3
//   const [categories, setCategories] = useState([])
//   const [nameInput, setNameInput] = useState('')
//   const [descriptionInput, setDescriptionInput] = useState('')
//   const [categoryInput, setCategoryInput] = useState('')
//   const [sourceInput, setSourceInput] = useState('')
//   const [isViewCategory, setViewCategory] = useState(false)
//   const [isViewSource, setViewSource] = useState(false)
//   const [isPreviewCard, setIsPreviewCard] = useState(false)
//   const [categoryLCheck, setCategoryLCheck] = useState(false)
//   const [isRadioSelected, setIsRadioSelected] = useState(false)
//   const [displayNum, setDisplayNum] = useState(beginIndex)
//   const [viewCat, setViewCat] = useState(false)
//   const [catImages, setCatImages] = useState()
//   const [selectedImageIndex, setSelectedImageIndex] = useState(null)
//   const [holdInfos, setHoldInfos] = useState([])
//   const [images, setImages] = useState([])
//   const [infoBackup, setInfoBackup] = useState([])

//   const getDetails = async() => {
//     try {
//       const response = await axios.get(`${API_URL}/items/developer/${id}`)
//       const temp = response.data[0]
      
//       // Store in ref for reset
//       originalDataRef.current = {
//         name: temp.name,
//         description: temp.description,
//         category: temp.category,
//         source: temp.source,
//         infos: temp.infos,
//         thumbnails: temp.thumbnails,
//         category_image: temp.category_image
//       }
      
//       setHoldInfos(temp.infos)
//       setInfoBackup(temp.infos)
//       setImages(temp.thumbnails?.map(img => ({
//         ...img,
//         image_url: img.image_url || img.image
//       })) || [])
//       setNameInput(temp.name)
//       setDescriptionInput(temp.description)
//       setSourceInput(temp.source)
//       setCategoryInput(temp.category)
//       setCatImages(temp.category_image)
//     } catch (error) {
//       console.log(`${error.message}`);
//     }
//   }

//   const resetAll = () => {
//     if (originalDataRef.current) {
//       const temp = originalDataRef.current
//       setHoldInfos(temp.infos)
//       setImages(temp.thumbnails?.map(img => ({
//         ...img,
//         image_url: img.image_url || img.image
//       })) || [])
//       setNameInput(temp.name)
//       setDescriptionInput(temp.description)
//       setSourceInput(temp.source)
//       setCategoryInput(temp.category)
//       setCatImages(temp.category_image)
//       setCategoryLCheck(false)
//       setIsRadioSelected(false)
//       setDisplayNum(beginIndex)
//     }
//   }
  
//   const clearForm = () => {
//     setNameInput('')
//     setDescriptionInput('')
//     setCategoryInput('')
//     setSourceInput('')
//     setHoldInfos([{qty: "", cost: "", details: ""}])
//     setImages([])
//     setCatImages({})
//     setCategoryLCheck(false)
//   }

//   const handleChange = (e, field, index) => {
//     const update = [...holdInfos];
//     update[index][field] = e;
//     setHoldInfos(update)
//   }

//   const addNewBlock = () => {
//     const newInfos = [...holdInfos, {qty: "", cost: "", details: ""}];
//     setHoldInfos(newInfos);
    
//     // Automatically show the new block
//     if (displayNum !== beginIndex) {
//       setDisplayNum(newInfos.length);
//     }
//   }

//   const handleInsertImage = (e) => {
//     const files = e.target.files;
//     if(!files || files.length === 0) return
    
//     const update = []
//     for(let i=0; i < files.length; i++){
//       update.push({
//         file: files[i], 
//         image_url: URL.createObjectURL(files[i]),
//         isNew: true
//       })
//     } 
//     setImages((prev) => [...prev, ...update])
//     e.target.value = ""
//   }

//   const handleInsertCategoryImage = (e) => {
//     const file = e.target.files[0]
//     if(!file) return;
//     const update = {file, image_url: URL.createObjectURL(file), isNew: true}
//     setCatImages(update)
//     e.target.value = ""
//   }

//   const handleDeleteImage = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index))
//   }

//   const handleEditImage = (e, index) => {
//     const file = e.target.files[0]
//     if(!file) return;
//     const update = {image_url: URL.createObjectURL(file), file, isNew: true}
//     setImages((prev) => prev.map((img, i) => (i === index ? update : img)))
//   }

//   const handleRadio = (e, input, type) => {
//     if(type.includes('cat')){
//       setTimeout(() => {
//         setCategoryInput(input)
//         setViewCategory(false)
//         setCategoryLCheck(false)
//         setIsRadioSelected(true)
//       }, 300);
//     } else if(type.includes('source')) {
//       setTimeout(() => {
//         setSourceInput(input)
//         setViewSource(false)
//       }, 300);
//     }
//   }

//   const handleInfoMore = () => {
//     if(displayNum === beginIndex) setDisplayNum(holdInfos.length); 
//     else setDisplayNum(beginIndex);      
//   }

//   const allCategories = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/categories`)
//       setCategories(response.data)
//     } catch (error) {
//       console.log(`Unable to get all categories: ${error.message}`);
//     }
//   }

//   useEffect(() => {
//     getDetails()
//   }, [id])
  
//   useEffect(() => {
//     allCategories()
//   }, [])

//   useEffect(() => {
//     const handle = (event) => {
//       if(ref.current && !ref.current.contains(event.target)){
//         setViewCategory(false)
//         setViewSource(false)
//       }
//     }

//     document.addEventListener('mousedown', handle)
//     return () => {
//       document.removeEventListener('mousedown', handle)
//     }
//   }, [])

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4'>
//       <div className='max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden'>
        
//         {/* Header */}
//         <div className='bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6'>
//           <h1 className='text-2xl font-bold text-white flex items-center gap-2'>
//             <Layers className='w-6 h-6' />
//             Edit Item #{id}
//           </h1>
//           <p className='text-blue-100 text-sm mt-1'>Update your product information</p>
//         </div>

//         {/* Action Buttons */}
//         <div className='flex justify-end gap-4 px-8 py-4 bg-gray-50 border-b border-gray-200'>
//           <button 
//             onClick={resetAll}
//             className='flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
//           >
//             <RotateCcw size={18} />
//             Reset Changes
//           </button>
//           <button 
//             onClick={clearForm}
//             className='flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
//           >
//             <Save size={18} />
//             Save Item
//           </button>
//         </div>

//         {/* Main Form */}
//         <div className='p-8 space-y-8'>
          
//           {/* Basic Information Section */}
//           <div className='space-y-6'>
//             <div className='flex items-center gap-2 border-b border-blue-200 pb-2'>
//               <Package className='w-5 h-5 text-blue-600' />
//               <h2 className='text-lg font-semibold text-gray-800'>Basic Information</h2>
//             </div>

//             {/* Name Field */}
//             <div className='space-y-2'>
//               <label className='flex items-center gap-1 text-sm font-medium text-gray-700'>
//                 Product Name <span className='text-red-500'>*</span>
//               </label>
//               <input 
//                 type='text' 
//                 value={nameInput} 
//                 placeholder='e.g. Organic Apples, Premium Coffee...' 
//                 onChange={(e) => setNameInput(e.target.value)} 
//                 className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 transition-all'
//                 required
//               />
//             </div>

//             {/* Description Field */}
//             <div className='space-y-2'>
//               <label className='flex items-center gap-1 text-sm font-medium text-gray-700'>
//                 <FileText className='w-4 h-4' />
//                 Description
//               </label>
//               <textarea 
//                 value={descriptionInput} 
//                 placeholder='Describe your product in detail...' 
//                 onChange={(e) => setDescriptionInput(e.target.value)} 
//                 rows={3}
//                 className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 transition-all resize-none'
//               />
//             </div>

//             {/* Category Field */}
//             <div className='space-y-2'>
//               <div className='flex items-center justify-between'>
//                 <label className='flex items-center gap-1 text-sm font-medium text-gray-700'>
//                   <Tag className='w-4 h-4' />
//                   Category <span className='text-red-500'>*</span>
//                 </label>
//                 <div className='flex items-center gap-2 text-xs'>
//                   <label className='flex items-center gap-1 cursor-pointer'>
//                     <input 
//                       type='checkbox' 
//                       onChange={(e) => setViewCat(e.target.checked)} 
//                       checked={viewCat} 
//                       className='rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
//                     />
//                     <span>Custom Category</span>
//                   </label>
//                 </div>
//               </div>

//               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                 {!viewCat ? (
//                   <div className='relative'>
//                     <div 
//                       onClick={() => setViewCategory(true)}
//                       className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer hover:border-blue-400 transition-colors flex items-center justify-between'
//                     >
//                       <span>{categoryInput || 'Select a category'}</span>
//                       <ChevronDown className='w-4 h-4 text-gray-500' />
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <input 
//                       type='text' 
//                       placeholder='Enter custom category...' 
//                       value={categoryInput} 
//                       onChange={(e) => {
//                         setCategoryLCheck(true)
//                         setIsRadioSelected(false)
//                         setCategoryInput(e.target.value)
//                       }} 
//                       className='px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800'
//                     />
//                     <div className='relative h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors'>
//                       {catImages?.image_url ? (
//                         <img 
//                           src={catImages.image_url} 
//                           alt='Category' 
//                           className='w-full h-full object-cover rounded-lg'
//                         />
//                       ) : (
//                         <label className='flex flex-col items-center justify-center w-full h-full cursor-pointer'>
//                           <Camera className='w-8 h-8 text-gray-400' />
//                           <span className='text-xs text-gray-500 mt-1'>Upload icon</span>
//                           <input 
//                             type='file' 
//                             accept='image/*' 
//                             onChange={handleInsertCategoryImage} 
//                             className='hidden'
//                           />
//                         </label>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Source Field */}
//             <div className='space-y-2'>
//               <label className='flex items-center gap-1 text-sm font-medium text-gray-700'>
//                 Source / Supplier
//               </label>
//               <button 
//                 onClick={() => setViewSource(true)}
//                 className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left text-gray-700 hover:border-blue-400 transition-colors flex items-center justify-between'
//               >
//                 <span>{sourceInput || 'Select source'}</span>
//                 <ChevronDown className='w-4 h-4 text-gray-500' />
//               </button>
//             </div>
//           </div>

//           {/* Infos Section */}
//           <div className='space-y-4'>
//             <div className='flex items-center gap-2 border-b border-blue-200 pb-2'>
//               <Package className='w-5 h-5 text-blue-600' />
//               <h2 className='text-lg font-semibold text-gray-800'>Pricing & Quantity ({holdInfos.length})</h2>
//             </div>

//             <div className='space-y-6'>
//               {holdInfos?.slice(0, displayNum).map((info, index) => (
//                 <div 
//                   key={index} 
//                   className='p-5 border border-gray-200 rounded-xl bg-gray-50 relative hover:shadow-md transition-shadow'
//                 >
//                   <div className='absolute -top-2 -left-2 bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-semibold'>
//                     {index + 1}
//                   </div>
                  
//                   <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                     <div className='space-y-2'>
//                       <label className='text-xs font-medium text-gray-600 flex items-center gap-1'>
//                         Quantity <span className='text-red-500'>*</span>
//                       </label>
//                       <input 
//                         type='number' 
//                         min={1} 
//                         value={info.qty} 
//                         placeholder='0' 
//                         onChange={(e) => handleChange(e.target.value, 'qty', index)} 
//                         className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white'
//                       />
//                     </div>
                    
//                     <div className='space-y-2'>
//                       <label className='text-xs font-medium text-gray-600 flex items-center gap-1'>
//                         <DollarSign className='w-3 h-3' />
//                         Cost <span className='text-red-500'>*</span>
//                       </label>
//                       <input 
//                         type='number' 
//                         value={info.cost} 
//                         min={0} 
//                         step='0.01'
//                         placeholder='0.00' 
//                         onChange={(e) => handleChange(e.target.value, 'cost', index)} 
//                         className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white'
//                       />
//                     </div>
                    
//                     <div className='md:col-span-2 space-y-2'>
//                       <label className='text-xs font-medium text-gray-600'>Details</label>
//                       <textarea
//                         value={info.details} 
//                         placeholder='Additional details...' 
//                         onChange={(e) => handleChange(e.target.value, 'details', index)} 
//                         rows={2}
//                         className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white resize-none'
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* Add More Button */}
//               <div className='flex justify-center'>
//                 <button
//                   onClick={addNewBlock}
//                   className='flex items-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-all duration-200 border-2 border-blue-200 hover:border-blue-300'
//                 >
//                   <PlusCircle className='w-5 h-5' />
//                   Add Pricing Option
//                 </button>
//               </div>

//               {/* Toggle View Button */}
//               {holdInfos.length > 3 && (
//                 <div className='flex justify-center mt-4'>
//                   <button
//                     onClick={handleInfoMore}
//                     className='flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors'
//                   >
//                     {displayNum !== beginIndex ? (
//                       <>Show Less <ChevronUp className='w-4 h-4' /></>
//                     ) : (
//                       <>Show All ({holdInfos.length}) <ChevronDown className='w-4 h-4' /></>
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Thumbnails Section */}
//           <div className='space-y-4'>
//             <div className='flex items-center gap-2 border-b border-blue-200 pb-2'>
//               <ImageIcon className='w-5 h-5 text-blue-600' />
//               <h2 className='text-lg font-semibold text-gray-800'>Product Images ({images.length}) <span className='text-red-500'>*</span></h2>
//             </div>

//             <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
//               {images?.map((img, index) => (
//                 <div key={index} className='relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all'>
//                   <img 
//                     src={img.image_url} 
//                     alt={`Product ${index + 1}`} 
//                     className='w-full h-full object-cover cursor-pointer'
//                     onClick={() => {
//                       setSelectedImageIndex(index)
//                       setIsPreviewCard(true)
//                     }}
//                   />
//                   <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
//                     <button
//                       onClick={() => handleDeleteImage(index)}
//                       className='p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors'
//                     >
//                       <X size={16} />
//                     </button>
//                     <label className='p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors cursor-pointer'>
//                       <Edit2 size={16} />
//                       <input 
//                         onChange={(e) => handleEditImage(e, index)} 
//                         type='file' 
//                         accept='image/*' 
//                         className='hidden' 
//                       />
//                     </label>
//                   </div>
//                 </div>
//               ))}

//               {/* Add Image Button */}
//               <label className='aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-blue-600'>
//                 <Plus size={32} />
//                 <span className='text-xs font-medium'>Add Image</span>
//                 <input 
//                   type='file' 
//                   multiple 
//                   accept='image/*' 
//                   onChange={handleInsertImage} 
//                   className='hidden' 
//                 />
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Preview Modal */}
//       {isPreviewCard && images[selectedImageIndex] && (
//         <PreviewImage 
//           image={images[selectedImageIndex].image_url} 
//           setIsOpen={setIsPreviewCard}
//         />
//       )}

//       {/* Category Selection Modal */}
//       {isViewCategory && (
//         <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
//           <div ref={ref} className='bg-white rounded-xl shadow-2xl w-96 max-h-[500px] overflow-hidden'>
//             <div className='bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4'>
//               <h3 className='text-lg font-semibold text-white'>Select Category</h3>
//             </div>
//             <div className='p-4 max-h-[400px] overflow-y-auto'>
//               {categories.map((cat) => (
//                 <label 
//                   key={cat.category_id} 
//                   onClick={() => handleRadio(null, cat.category_name, 'cat')}
//                   className='flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors'
//                 >
//                   <input
//                     type='radio'
//                     name='category'
//                     value={cat.category_name}
//                     checked={categoryInput === cat.category_name}
//                     onChange={() => {}}
//                     className='w-4 h-4 text-blue-600'
//                   />
//                   <span className='text-gray-700'>{cat.category_name}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Source Selection Modal */}
//       {isViewSource && (
//         <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
//           <div ref={ref} className='bg-white rounded-xl shadow-2xl w-96 max-h-[400px] overflow-hidden'>
//             <div className='bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4'>
//               <h3 className='text-lg font-semibold text-white'>Select Source</h3>
//             </div>
//             <div className='p-4 max-h-[300px] overflow-y-auto'>
//               {sources?.map((s) => (
//                 <label 
//                   key={s.id} 
//                   onClick={() => handleRadio(null, s.name, 'source')}
//                   className='flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors'
//                 >
//                   <input
//                     type='radio'
//                     name='source'
//                     value={s.name}
//                     checked={sourceInput === s.name}
//                     onChange={() => {}}
//                     className='w-4 h-4 text-green-600'
//                   />
//                   <span className='text-gray-700'>{s.name}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default EditItem
