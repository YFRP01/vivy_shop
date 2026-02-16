import { ArrowLeftToLineIcon } from 'lucide-react'
import React from 'react'

const PreviewImage = ({image, setIsOpen}) => {
    
  return (
    <div onClick={()=>(setIsOpen(false))} className={`fixed z-100 w-screen h-screen inset-0 bg-black/90 `}>
        <div className='w-full h-full flex flex-col items-center'>
            <div className='h-full w-full backdrop-blur-xs flex items-center justify-center'>
                {image.file ? (
                  <img src={image.image_url} className={`bg-white md:w-[80%] md:h-[80%]`}/>
                ):
                (<div className='text-white text-lg lg:text-lg'>No Image Found!</div>)}
             </div>   
        </div> 
    </div>
  )
}

export default PreviewImage
