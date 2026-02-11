import React from "react"
import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import MainLayout from "../components/MainLayout"
import ItemDetails from "../pages/ItemDetails"
import Ordered from "../pages/Ordered"
import Favourites from "../pages/Favourites"

const App = () => {

  return (
      <div className="min-h-screen bg-slate-50">
        {/* <Navbar /> */}
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />}/>
            <Route path='/item/:id' element={<ItemDetails />}/>
            <Route path="/favourites" element={<Favourites />}/>
            <Route path="/ordered" element={<Ordered />}/>          
          </Route>
        </Routes>
      </div>
  )
}

export default App
