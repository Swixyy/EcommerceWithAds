"use client"

import { ReactNode } from "react"
import { useToast } from "@/components/ui/Toast"
import ToastContainer from "@/components/ui/Toast"

interface ToastProviderProps {
  children: ReactNode
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
