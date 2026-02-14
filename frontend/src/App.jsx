import React from "react"
import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import ItemDetails from "../pages/ItemDetails"
import Ordered from "../pages/Ordered"
import Favourites from "../pages/Favourites"
import CreateItems from "../pages/developerPages/CreateItems"
import ListItems from "../pages/developerPages/ListItems"
import DeveloperLayout from "../components/layouts/developerLayout"
import MainLayout from "../components/layouts/MainLayout"
import Navbar from '../components/Navbar'
import HandleCategories from "../pages/developerPages/HandleCategories"
import EditItem from "../pages/developerPages/EditItem"
const App = () => {

  return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="mt-17.5">
          <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />}/>
            <Route path='/item/:id' element={<ItemDetails />}/>
            <Route path="/favourites" element={<Favourites />}/>
            <Route path="/ordered" element={<Ordered />}/>          
          </Route>
          <Route path='/developer' element={<DeveloperLayout />}>
            <Route index element={<CreateItems />} />
            <Route path='/developer/items' element={<ListItems />} />
            <Route path='/developer/item/:id' element={<EditItem />} />
            <Route path='/developer/categories' element={<HandleCategories />} />
          </Route>
        </Routes>
        </div>
      </div>
  )
}

export default App
