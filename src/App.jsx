import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
import Nav from './pages/Nav'
import Hero from './pages/Hero'
import TailorGrid from './pages/Tailors'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Nav/>
    <Hero/>
    <TailorGrid/>
          </>
  )
}

export default App
