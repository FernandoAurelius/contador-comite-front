"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Plus, Search, Edit, Trash, Calendar, DollarSign, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface Expense {
  id: string
  date: Date
  description: string
  amount: number
  notes?: string
}

interface ExpensesSectionProps {
  expenses: Expense[]
  onAddExpense: (expense: Expense) => void
}

export default function ExpensesSection({ expenses, onAddExpense }: ExpensesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    date: new Date(),
    description: "",
    amount: 0,
    notes: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleAddExpense = () => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(),
    }
    onAddExpense(expense)
    setNewExpense({
      date: new Date(),
      description: "",
      amount: 0,
      notes: "",
    })
    setIsDialogOpen(false)
  }

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.notes && expense.notes.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Buscar despesas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Nova Despesa</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Despesa</DialogTitle>
              <DialogDescription>Preencha os detalhes da despesa abaixo.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="expense-date">Data</Label>
                <div className="relative">
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {newExpense.date
                          ? format(newExpense.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                          : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newExpense.date}
                        onSelect={(date) => {
                          if (date) {
                            setNewExpense((prev) => ({ ...prev, date }))
                            setIsCalendarOpen(false)
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expense-description">Descrição</Label>
                <Input
                  id="expense-description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Material para decoração"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expense-amount">Valor (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="expense-amount"
                    type="number"
                    value={newExpense.amount || ""}
                    onChange={(e) =>
                      setNewExpense((prev) => ({ ...prev, amount: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="0.00"
                    className="pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expense-notes">Observações (opcional)</Label>
                <Textarea
                  id="expense-notes"
                  value={newExpense.notes || ""}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Detalhes adicionais sobre a despesa..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddExpense} disabled={!newExpense.description || newExpense.amount <= 0}>
                Adicionar Despesa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filteredExpenses.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{format(expense.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      <div>
                        {expense.description}
                        {expense.notes && <p className="text-xs text-gray-500 mt-1">{expense.notes}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">R$ {expense.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma despesa encontrada</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Nenhuma despesa corresponde à sua busca."
              : "Adicione sua primeira despesa para começar a controlar os gastos."}
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Limpar busca
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
