import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          credentials: "include", 
        })

        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          router.push("/login")
        }
      } catch (err) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  return { isAuthenticated, loading }
}