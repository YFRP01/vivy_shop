import { AlertCircle } from 'lucide-react'
import React from 'react'

const NotFoundPage = ({type, category, search}) => {
  return (
        <div className='w-full h-full text-gray-600 gap-1 py-80 absolute flex items-center justify-center'>
            <AlertCircle size={20} />
            <span>No {type} item found for the category "{category}" 
              {search && ` and search="${search}"`}.</span>
        </div>
  )
}

export default NotFoundPage
