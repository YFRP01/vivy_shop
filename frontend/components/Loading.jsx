import { Loader } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
        <div className='flex items-center justify-center h-full w-full'>
          <div className='flex gap-1 text-gray-500 items-center justify-center'>
            <Loader size={20}/> <p>Loading...</p>
          </div>
      </div>
  )
}

export default Loading
