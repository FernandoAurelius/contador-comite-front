"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InitialCapitalModalProps {
  onClose: () => void
  onSave: (value: number) => void
}

export default function InitialCapitalModal({ onClose, onSave }: InitialCapitalModalProps) {
  const [value, setValue] = useState("")

  const handleSave = () => {
    const numValue = Number.parseFloat(value) || 0
    onSave(numValue)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Configuração Inicial</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-4">
              <p>
                Bem-vindo ao sistema de controle financeiro do comitê de formatura! Para começar, informe o capital
                inicial disponível.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-capital">Capital Inicial (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="initial-capital"
                  type="number"
                  placeholder="0.00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-gray-500">
                Este valor representa o dinheiro já disponível para o comitê no início do controle.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <Button onClick={handleSave}>Salvar e Continuar</Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
