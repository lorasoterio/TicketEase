import { useState } from 'react'
import MainDashboard from './pages/MainDashboard'
import AppRoutes from './routes/AppRoutes'
export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRoutes />

    </>
  )
}


