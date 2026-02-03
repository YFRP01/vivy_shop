import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Rough from '../pages/Rough'
import Home from "../pages/Home"
import MainLayout from "../components/MainLayout"

const App = () => {

  return (
      <div className="h-screen w-screen">
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />}/>
          </Route>
        </Routes>
      </div>
  )
}

export default App
