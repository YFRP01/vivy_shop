import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Rough from '../pages/Rough'
import Home from "../pages/Home"
import MainLayout from "../components/MainLayout"
import Navbar from "../components/Navbar"
import ItemDetails from "../pages/ItemDetails"
import Ordered from "../pages/Ordered"
import Favourites from "../pages/Favourites"

const App = () => {

  return (
      <div className="min-h-screen bg-slate-500">
        {/* <Navbar /> */}
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />}/>
            <Route path='/item/:id' element={<ItemDetails />}/>
          </Route>
          <Route path="/favourites" element={<Favourites />}/>
          <Route path="/ordered" element={<Ordered />}/>
        </Routes>
      </div>
  )
}

export default App
