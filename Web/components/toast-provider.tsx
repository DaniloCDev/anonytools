"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { CheckCircle, X, AlertCircle, Info } from "lucide-react"

interface Toast {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case "info":
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getColorClasses = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "border-green-500/30 bg-green-500/10"
      case "error":
        return "border-red-500/30 bg-red-500/10"
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/10"
      case "info":
        return "border-blue-500/30 bg-blue-500/10"
    }
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`glass border ${getColorClasses(toast.type)} rounded-lg p-4 min-w-80 max-w-md animate-in slide-in-from-right duration-300`}
          >
            <div className="flex items-start gap-3">
              {getIcon(toast.type)}
              <div className="flex-1">
                <h4 className="font-semibold text-white">{toast.title}</h4>
                {toast.message && <p className="text-sm text-gray-300 mt-1">{toast.message}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
