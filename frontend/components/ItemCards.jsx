import React from 'react'

const ItemCards = ({array}) => {
  return (
    <div>
      <div className='relative flex flex-col'>
            <div>
                {/* <img src={array.thumbnail} className='object-cover '/> */}
            </div>
            <div>
                <h1 className=''>{array}</h1>
            </div>
      </div>
    </div>
  )
}

export default ItemCards