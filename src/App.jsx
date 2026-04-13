
import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
import Nav from './pages/Nav'
import Hero from './pages/Hero'
// import TailorGrid from './pages/Tailors'
import TailorSection from './pages/Tailors'
import Footer from './pages/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="container">
    <Nav/>
    <Hero/>
    <TailorSection/>
    <Footer/>
    </div>
    </>
  )
}

export default App
