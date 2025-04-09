"use client"

import { ArrowUp, ArrowDown, DollarSign, Target } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface DashboardProps {
  initialCapital: number
  totalRaised: number
  totalSpent: number
  currentBalance: number
  goal: number
}

export default function Dashboard({ initialCapital, totalRaised, totalSpent, currentBalance, goal }: DashboardProps) {
  // Calculate progress percentage
  const progressPercentage = goal > 0 ? Math.min(Math.round((currentBalance / goal) * 100), 100) : 0
  const remainingToGoal = Math.max(goal - currentBalance, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <h1 className="text-2xl font-bold mb-1">Comitê de Formatura 2025</h1>
        <p className="opacity-90">Controle de receitas e despesas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Capital Inicial</p>
                <p className="text-2xl font-bold">R$ {initialCapital.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Arrecadado</p>
                <p className="text-2xl font-bold">R$ {totalRaised.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <ArrowUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Gasto</p>
                <p className="text-2xl font-bold">R$ {totalSpent.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <ArrowDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Saldo Atual</p>
                <p className="text-2xl font-bold">R$ {currentBalance.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 pb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-medium">Progresso para Meta</h3>
            </div>

            <div className="mb-2">
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <span className="text-gray-500">Meta:</span> R$ {goal.toFixed(2)}
              </div>
              <div>
                <span className="text-gray-500">Falta:</span> R$ {remainingToGoal.toFixed(2)}
              </div>
              <div>
                <span className="text-gray-500">Progresso:</span> {progressPercentage}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
