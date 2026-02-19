import React from 'react'

const PageTitle = ({title, sub}) => {
  return (
    <h1 className='text-blue-500 text-2xl capitalize flex items-center gap-1 font-semibold '>
        <span>{title}</span>
        (
        <span className='text-green-500'>{sub}</span>
        )
    </h1>
)
}

export default PageTitle

