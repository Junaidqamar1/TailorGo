import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

 
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include' 
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data) // e.g. { name, email, role: "customer" or "tailor" }
        }
      } catch (e) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  function login(userData) {
    setUser(userData) // just store user info, token is already in cookie
  }

  async function logout() {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)