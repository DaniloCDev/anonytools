// hooks/useLogs.ts
"use client"

import { useState, useEffect } from "react"

type LogType = {
  id: number
  action: string
  user: string
  admin: string | null
  timestamp: string
  type: "info" | "success" | "warning" | "error"
  details: string
  ip: string
}

export default function useLogs() {
  const [logs, setLogs] = useState<LogType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/sistem/logs", {
            credentials:"include"
        })

        if (!res.ok) throw new Error("Erro ao buscar logs")

        const data = await res.json()
        setLogs(data)
      } catch (err: any) {
        setError(err.message || "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  return { logs, loading, error }
}
