import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { API_URL } from '../../api'
import { sources } from '../../src/assets/assets'

const CreateItems = () => {

  const ref = useRef()

  const [categories, setCategories] = useState([])
  const [nameInput, setNameInput] = useState('')
  const [descriptionInput, setDescriptionInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('Choose')
  const [sourceInput, setSourceInput] = useState('Source')
  const [isViewCategory, setViewCategory] = useState(false)
  const [isViewSource, setViewSource] = useState(false)

  const handleShow = (e, value, input)=>{
        if(e.key === 'Enter' && input.trim()){
            console.log(value, ':', input);
        }
  }

  const handleRadio = (e, input, type)=>{
    if(type === 'cat'){
      setCategoryInput(input)
      setViewCategory(false)
    }
    else if(type === 'source') {
      setSourceInput(input)
      setViewSource(false)
    }
    else {
      console.log('error');
      return null
    }
    
    console.log(`Category: ${input}`);
    
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
        }
    }

    addEventListener('mouseup',handle)
    return (()=>{
        removeEventListener('mousedown', handle)
    })
    }, [])

  return (
    <div className='flex flex-col flex-wrap'>
        {/*items*/}
        <div className='flex flex-col gap-2'>
          <div className=''>
          <p className='text-blue-500'>Item</p>
            {/* name */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Name</h2>
            <input 
            type='text' onKeyDown={(e)=>(handleShow(e, 'Name', nameInput))} value={nameInput} placeholder='Enter the item name ...' onChange={((e)=>(setNameInput(e.target.value)))} 
            className={`focus:ring-2 flex-1 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            />
          </div>
          {/* description */}
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Description</h2>
            <input 
            type='text' onKeyDown={(e)=>(handleShow(e, 'Description', descriptionInput))} value={descriptionInput} placeholder='Enter the item name ...' onChange={((e)=>(setDescriptionInput(e.target.value)))} 
            className={`focus:ring-2 flex-1 h-15 border border-gray-300 rounded-sm outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            />
          </div>
          {/* category */}
          <div className='flex gap-2 p-1 relative'>
            <div className='flex gap-2'>
              <p className='font-medium'>Category</p>
              <button onClick={()=>(setViewCategory(!isViewCategory))} className='border border-gray-500 cursor-pointer text-gray-500 px-1 rounded-sm'>
                {categoryInput}
              </button>
            </div>
            {isViewCategory && (
                <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/5 transition-all duration-500 ease-in-out w-screen h-screen z-100'>
                  <div className='bg-ed-500 h-full w-full flex justify-center relative'>
                   <div ref={ref} className='absolute top-60 w-64 transition-all duration-500 ease-in-out h-100 overflow-y-auto bg-white rounded-lg border border-blue-300 text-gray-800 p-2 flex flex-col gap-1'>
                        {categories.map((cat)=>(
                        <label key={cat.category_id} onClick={(e)=>(handleRadio(e, cat.category_name, 'cat'))} className={`flex gap-1 hover:bg-blue-100 px-1 rounded-md break-all`}>
                            <input
                            type='radio' onChange={(e)=>(setCategoryInput(e.target.value))} value={cat.category_name} name='category' />
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
              <button onClick={()=>(setSourceInput(!isViewSource))} className='border border-gray-500 cursor-pointer text-gray-500 px-1 rounded-sm'>
                {sourceInput}
              </button>
            </div>
            {isViewSource && (
                <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/5 transition-all duration-500 ease-in-out w-screen h-screen z-100'>
                  <div className='bg-ed-500 h-full w-full flex justify-center relative'>
                   <div /*ref={ref}*/ className='absolute top-60 w-64 transition-all duration-500 ease-in-out h-100 overflow-y-auto bg-white rounded-lg border border-blue-300 text-gray-800 p-2 flex flex-col gap-1'>
                        {sources.map((s)=>(
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

                      {/* <input 
            type='radio' name='category' onKeyDown={(e)=>(handleShow(e, 'Category', categoryInput))} value={categoryInput} placeholder='Enter the item category ...' onChange={((e)=>()} 
            className={`focus:ring-2 outline-none ring-blue-500 bg-gray-600 px-2 text-gray-800` }
            /> */}

        </div>
        <div>
          <p className='text-blue-500'>Infos</p>
        </div>
        <div>
          <p className='text-blue-500'>Thumbnails</p>
        </div>
      </div>
    </div>
  )
}

export default CreateItems
