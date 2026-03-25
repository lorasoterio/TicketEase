
import { useEffect } from 'react'
import { supabase } from './supabaseClient' 
import AppRoutes from './routes/AppRoutes'
export default function App() {

    useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from('tickets').select('*')
      console.log('data:', data)
      console.log('error:', error)
    }
    testConnection()
  }, [])
  
  return (
    <>
      <AppRoutes />
    </>
  )
}


