import { ArrowLeftToLineIcon } from 'lucide-react'
import React from 'react'

const PreviewImage = ({image, setIsOpen}) => {
    
  return (
    <div onClick={()=>(setIsOpen(false))} className={`fixed z-100 w-screen h-screen inset-0 bg-black/90 flex items-center justify-center transition-all duration-3000 ease-in`}>
        <div className='w-full h-full flex flex-col items-center'>
            {/* <div className='flex w-full bg-black shadow-lg p-2'>
                <ArrowLeftToLineIcon onClick={()=>(setIsOpen(false))} size={30} className='text-white cursor-pointer'/>
            </div> */}
            <div className='h-full w-full backdrop-blur-xs flex items-center justify-center'><img src={image} className={`bg-white md:w-[80%] md:h-[80%]`}/> </div>   
        </div> 
    </div>
  )
}

export default PreviewImage
