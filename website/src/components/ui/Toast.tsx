"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  onClose?: () => void
}

interface ToastItemProps extends ToastProps {
  onRemove: (id: string) => void
}

function ToastItem({ 
  id, 
  title, 
  description, 
  type = "info", 
  duration = 5000, 
  onRemove 
}: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto remove
    const removeTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onRemove(id), 300)
    }, duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [id, duration, onRemove])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  }

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        "max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn("h-5 w-5", colors[type].split(" ")[2])} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && (
              <p className="text-sm font-medium text-gray-900">
                {title}
              </p>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onRemove(id), 300)
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Toast Container
export default function ToastContainer({ toasts, onRemove }: { 
  toasts: ToastProps[]
  onRemove: (id: string) => void 
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

// Toast Hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const toast = {
    success: (title: string, description?: string) => 
      addToast({ title, description, type: "success" }),
    error: (title: string, description?: string) => 
      addToast({ title, description, type: "error" }),
    warning: (title: string, description?: string) => 
      addToast({ title, description, type: "warning" }),
    info: (title: string, description?: string) => 
      addToast({ title, description, type: "info" })
  }

  return { toasts, toast, removeToast }
}
