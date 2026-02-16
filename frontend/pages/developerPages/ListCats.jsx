import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { API_URL } from '../../api'
import axios from 'axios'

const ListCats = () => {

    const [searchParams] = useSearchParams()
    const [items, setItems] = useState([])
    const category = searchParams.get('category') || 'all';
    const getAll = async()=>{
        try {
            const response = await axios.get(`${API_URL}/categories/developer?category=${category}`)
            setItems(response.data)
        } catch (error) {
            console.log(`Unable to get the saved items ${error.message}`);
        }
    }

    useEffect(()=>{
        getAll()
    }, [])

  return (
    <div>
      {JSON.stringify(items)}
    </div>
  )
}

export default ListCats
