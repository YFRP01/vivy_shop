import React from 'react'

const PopUp = ({message, isPop}) => {
  return (
    <div className={`${isPop ? 'translate-y-4':'-translate-y-25'}  transition-all duration-700 ease-in-out w-full fixed z-51 top-0 left-0 right-0 h-20`}>
        <div className='w-90 relative mx-auto space-y-5 rounded-2xl bg-red-50 border border-red-500/60 '>
            <div className=' w-full p-5 text-sm flex justify-center items-center mx-auto'>
                <p className='font-semibold'>{message}</p>
            </div>
                <p className='absolute bottom-1 right-3 text-sm text-gray-500'>Press any key to continue</p>
        </div>
    </div>
      
  )
}

export default PopUp
