"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { format, addWeeks, subWeeks, startOfWeek, addDays, isAfter, isBefore } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DayCard from "@/components/day-card"
import DayModal from "@/components/day-modal"
import Dashboard from "@/components/dashboard"
import InitialCapitalModal from "@/components/initial-capital-modal"
import ExpensesSection from "@/components/expenses-section"
import GoalsSection from "@/components/goals-section"

// Mock data - in a real app, this would come from a database
const mockData = {
  initialCapital: 0,
  totalRaised: 0,
  totalSpent: 0,
  goals: [{ id: "1", name: "Meta Principal", value: 15000, description: "Meta para a formatura" }],
  expenses: [],
  sales: [],
}

export default function HomeView() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInitialCapitalModalOpen, setIsInitialCapitalModalOpen] = useState(false)
  const [appData, setAppData] = useState(mockData)

  const endDate = new Date(2025, 7, 29) // August 29, 2025

  // Check if initial capital is set
  useEffect(() => {
    // In a real app, you would check localStorage or a database
    if (appData.initialCapital === 0) {
      setIsInitialCapitalModalOpen(true)
    }
  }, [appData.initialCapital])

  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => subWeeks(prev, 1))
  }

  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeek, 1)
    if (isBefore(startOfWeek(nextWeek), endDate)) {
      setCurrentWeek(nextWeek)
    }
  }

  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSetInitialCapital = (value: number) => {
    setAppData((prev) => ({
      ...prev,
      initialCapital: value,
    }))
    setIsInitialCapitalModalOpen(false)
  }

  const handleAddExpense = (expense: any) => {
    setAppData((prev) => ({
      ...prev,
      expenses: [...prev.expenses, expense],
      totalSpent: prev.totalSpent + expense.amount,
    }))
  }

  const handleAddSale = (sale: any) => {
    setAppData((prev) => ({
      ...prev,
      sales: [...prev.sales, sale],
      totalRaised: prev.totalRaised + sale.amount,
    }))
  }

  // Generate the days of the current week
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i))

  // Check if next week button should be disabled
  const isNextWeekDisabled = isAfter(startOfWeek(addWeeks(currentWeek, 1)), endDate)

  // Calculate current balance
  const currentBalance = appData.initialCapital + appData.totalRaised - appData.totalSpent

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Dashboard
        initialCapital={appData.initialCapital}
        totalRaised={appData.totalRaised}
        totalSpent={appData.totalSpent}
        currentBalance={currentBalance}
        goal={appData.goals[0]?.value || 0}
      />

      <Tabs defaultValue="calendar" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <Button
              variant="outline"
              onClick={handlePreviousWeek}
              className="flex items-center gap-1 transition-all hover:gap-2 w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Semana Anterior</span>
              <span className="sm:hidden">Anterior</span>
            </Button>

            <h2 className="text-xl font-medium text-gray-700 text-center">
              {format(weekStart, "dd 'de' MMM", { locale: ptBR })} -{" "}
              {format(addDays(weekStart, 6), "dd 'de' MMM", { locale: ptBR })}
            </h2>

            <Button
              variant="outline"
              onClick={handleNextWeek}
              disabled={isNextWeekDisabled}
              className="flex items-center gap-1 transition-all hover:gap-2 w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Próxima Semana</span>
              <span className="sm:hidden">Próxima</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-6">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
              <div key={index} className="text-center font-medium text-gray-600">
                <span className="hidden sm:inline">{["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][index]}</span>
                <span className="sm:hidden">{day}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={format(weekStart, "yyyy-MM-dd")}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-7 gap-4"
            >
              {weekDays.map((day, index) => (
                <DayCard
                  key={index}
                  date={day}
                  onClick={() => handleDayClick(day)}
                  isDisabled={isAfter(day, endDate)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          <ExpensesSection expenses={appData.expenses} onAddExpense={handleAddExpense} />
        </TabsContent>

        <TabsContent value="goals" className="mt-4">
          <GoalsSection
            goals={appData.goals}
            currentBalance={currentBalance}
            onUpdateGoals={(goals) => setAppData((prev) => ({ ...prev, goals }))}
          />
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {isModalOpen && selectedDay && (
          <DayModal date={selectedDay} onClose={handleCloseModal} onSave={handleAddSale} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInitialCapitalModalOpen && (
          <InitialCapitalModal onClose={() => setIsInitialCapitalModalOpen(false)} onSave={handleSetInitialCapital} />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => {
            setSelectedDay(new Date())
            setIsModalOpen(true)
          }}
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Adicionar venda</span>
        </Button>
      </div>
    </div>
  )
}
