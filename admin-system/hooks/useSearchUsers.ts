import { useEffect, useState } from "react"

type User = {
  id: number
  name: string
  email: string
  plan: string
  status: "active" | "blocked"
  gbsPurchased: number
  gbsUsed: number
  referrals: number
  joinDate: string
  lastLogin: string
}

export function useUserSearch(query: string) {
const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return
      setLoading(true)

      try {

        const res = await fetch(`https://nox24proxy.com.br/api/user/searchUsers?q=${encodeURIComponent(query)}`, {
          credentials: "include", 
        })

        if (res.ok) {
          const data = await res.json()
          setResults(data)
        } else {
          console.error("Erro ao buscar usuários")
        }
      } catch (err) {
        console.error("Erro de rede", err)
      } finally {
        setLoading(false)
      }
    }
    const timeout = setTimeout(() => fetchResults(), 300)

    return () => clearTimeout(timeout)
  }, [query])

  return { results, loading }
}
