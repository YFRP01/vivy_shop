import { ArrowLeftToLineIcon } from 'lucide-react'
import React from 'react'

const PreviewImage = ({image, setIsOpen}) => {
    
  return (
    <div className={`fixed z-100 inset-0 bg-black/90 flex items-center justify-center transition-all duration-3000 ease-in`}>
        <div className='w-full p-2 h-full relative flex flex-col items-center p-1 justify-center'>
            <div className='flex w-full absolute top-0 left-0 right-0 shadow-lg p-2'>
                <ArrowLeftToLineIcon onClick={()=>(setIsOpen(false))} size={50} className='text-white cursor-pointer'/>
            </div>
            <img src={image} className={`bg-white md:h-[70%] md:w-[70%]`}/>    
        </div> 
    </div>
  )
}

export default PreviewImage
