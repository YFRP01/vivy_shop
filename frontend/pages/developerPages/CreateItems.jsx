import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../../api'

const CreateItems = () => {

  const [categories, setCategories] = useState([])
  const [nameInput, setNameInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [sourceInput, setSourceInput] = useState('')


  const handleShow = (e, value, input)=>{
        if(e.key === 'Enter' && input.trim()){
            console.log(value, ':', input);
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
  return (
    <div>
        <form className='flex flex-col gap-2'>
          <p className='text-blue-500'>Item</p>
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Name</h2>
            <input 
            type='text' name='name' onKeyDown={(e)=>(handleShow(e, 'Name', nameInput))} value={nameInput} placeholder='Enter the item name ...' onChange={((e)=>(setNameInput(e.target.value)))} 
            className={`focus:ring-2 flex-1 outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            />
          </div>
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Category</h2>
            {categories.map((cat)=>(
              <label key={cat.category_id}>
                  <input type='radio' value={cat.category_name} name={cat.category_name} />
                  {cat.category_name}
              </label>
            ))}
            {/* <input 
            type='radio' name='category' onKeyDown={(e)=>(handleShow(e, 'Category', categoryInput))} value={categoryInput} placeholder='Enter the item category ...' onChange={((e)=>()} 
            className={`focus:ring-2 outline-none ring-blue-500 bg-gray-600 px-2 text-gray-800` }
            /> */}
          </div>
     
        </form>
        <div>
          <p className='text-blue-500'>Infos</p>
        </div>
        <div>
          <p className='text-blue-500'>Thumbnails</p>
        </div>
    </div>
  )
}

export default CreateItems
