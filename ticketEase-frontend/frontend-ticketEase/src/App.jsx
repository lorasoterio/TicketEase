import { useState } from 'react'
import MainDashboard from './pages/MainDashboard'
export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MainDashboard />

    </>
  )
}


