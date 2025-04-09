"use client"

import { useState } from "react"
import { Target, Plus, Edit, Trash } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Goal {
  id: string
  name: string
  value: number
  description?: string
}

interface GoalsSectionProps {
  goals: Goal[]
  currentBalance: number
  onUpdateGoals: (goals: Goal[]) => void
}

export default function GoalsSection({ goals, currentBalance, onUpdateGoals }: GoalsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id">>({
    name: "",
    value: 0,
    description: "",
  })

  const handleAddGoal = () => {
    if (editingGoal) {
      // Update existing goal
      const updatedGoals = goals.map((goal) => (goal.id === editingGoal.id ? { ...editingGoal, ...newGoal } : goal))
      onUpdateGoals(updatedGoals)
    } else {
      // Add new goal
      const goal: Goal = {
        ...newGoal,
        id: Date.now().toString(),
      }
      onUpdateGoals([...goals, goal])
    }

    setNewGoal({
      name: "",
      value: 0,
      description: "",
    })
    setEditingGoal(null)
    setIsDialogOpen(false)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setNewGoal({
      name: goal.name,
      value: goal.value,
      description: goal.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== goalId)
    onUpdateGoals(updatedGoals)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Metas e Objetivos</h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Nova Meta</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGoal ? "Editar Meta" : "Adicionar Nova Meta"}</DialogTitle>
              <DialogDescription>
                {editingGoal
                  ? "Atualize os detalhes da meta abaixo."
                  : "Defina uma nova meta para o comitê de formatura."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-name">Nome da Meta</Label>
                <Input
                  id="goal-name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Meta Principal"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="goal-value">Valor (R$)</Label>
                <Input
                  id="goal-value"
                  type="number"
                  value={newGoal.value || ""}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, value: Number.parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="goal-description">Descrição (opcional)</Label>
                <Textarea
                  id="goal-description"
                  value={newGoal.description || ""}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Detalhes sobre a meta..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setEditingGoal(null)
                  setNewGoal({
                    name: "",
                    value: 0,
                    description: "",
                  })
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddGoal} disabled={!newGoal.name || newGoal.value <= 0}>
                {editingGoal ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {goals.map((goal) => {
          const progressPercentage = goal.value > 0 ? Math.min(Math.round((currentBalance / goal.value) * 100), 100) : 0
          const remainingToGoal = Math.max(goal.value - currentBalance, 0)

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">{goal.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditGoal(goal)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {goal.description && <p className="text-sm text-gray-500 mb-4">{goal.description}</p>}

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <div className="font-medium">R$ {currentBalance.toFixed(2)}</div>
                      <div className="text-gray-500">R$ {goal.value.toFixed(2)}</div>
                    </div>

                    <Progress value={progressPercentage} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-500">Falta:</span> R$ {remainingToGoal.toFixed(2)}
                      </div>
                      <div>
                        <span className="text-gray-500">Progresso:</span> {progressPercentage}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}

        {goals.length === 0 && (
          <div className="md:col-span-2 text-center py-12 bg-gray-50 rounded-lg">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma meta definida</h3>
            <p className="text-gray-500 mb-4">Adicione metas para acompanhar o progresso da arrecadação.</p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Adicionar Meta
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
