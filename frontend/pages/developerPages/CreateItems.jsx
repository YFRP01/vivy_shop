import React, { useState } from 'react'

const CreateItems = () => {

  const [nameInput, setNameInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [sourceInput, setSourceInput] = useState('')


  const handleShow = (e, value, input)=>{
        if(e.key === 'Enter' && input.trim()){
            console.log(value, ':', input);
        }
    }

  return (
    <div>
        <div className='flex flex-col gap-2'>
          <p className='text-blue-500'>Item</p>
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Name</h2>
            <input 
            type='text' onKeyDown={(e)=>(handleShow(e, 'Name', nameInput))} value={nameInput} placeholder='Enter the item name ...' onChange={((e)=>(setNameInput(e.target.value)))} 
            className={`focus:ring-2 flex-1 outline-none ring-blue-500 bg-gray-100 px-2 text-gray-800` }
            />
          </div>
          <div className='flex gap-2 p-1'>
            <h2 className='font-medium'>Category</h2>
            <input 
            type='radio' onKeyDown={(e)=>(handleShow(e, 'Category', categoryInput))} value={categoryInput} placeholder='Enter the item category ...' onChange={((e)=>(setCategoryInput(e.target.value)))} 
            className={`focus:ring-2 outline-none ring-blue-500 bg-gray-600 px-2 text-gray-800` }
            />
          </div>
     
        </div>
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
