"use client"

import { useState, useEffect } from "react"
import { Plus, Flame, Target, TrendingUp, Apple, Coffee, Utensils, Cookie, ChevronDown, ChevronUp, Trash2, User, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Tipos
interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  meal: "breakfast" | "lunch" | "dinner" | "snack"
  time: string
}

interface DailyGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

// Alimentos comuns portugueses
const commonFoods = [
  { name: "Pão de trigo (1 fatia)", calories: 80, protein: 3, carbs: 15, fat: 1 },
  { name: "Arroz branco cozido (100g)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Batata cozida (100g)", calories: 87, protein: 2, carbs: 20, fat: 0.1 },
  { name: "Frango grelhado (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Bacalhau cozido (100g)", calories: 82, protein: 18, carbs: 0, fat: 0.7 },
  { name: "Ovo cozido (1 unidade)", calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: "Queijo fresco (50g)", calories: 70, protein: 6, carbs: 2, fat: 4 },
  { name: "Iogurte natural (125g)", calories: 75, protein: 5, carbs: 7, fat: 3 },
  { name: "Banana (1 média)", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: "Maçã (1 média)", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: "Café com leite (200ml)", calories: 60, protein: 3, carbs: 5, fat: 3 },
  { name: "Pastel de nata (1 unidade)", calories: 200, protein: 3, carbs: 25, fat: 10 },
]

export default function CalorieTrackerApp() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isGoalsDialogOpen, setIsGoalsDialogOpen] = useState(false)
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({
    breakfast: true,
    lunch: true,
    dinner: true,
    snack: true,
  })

  // Form states
  const [selectedMeal, setSelectedMeal] = useState<string>("breakfast")
  const [foodName, setFoodName] = useState("")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [fat, setFat] = useState("")

  // Carregar dados do localStorage
  useEffect(() => {
    const savedFoods = localStorage.getItem("calorieTracker_foods")
    const savedGoals = localStorage.getItem("calorieTracker_goals")
    
    if (savedFoods) setFoods(JSON.parse(savedFoods))
    if (savedGoals) setDailyGoals(JSON.parse(savedGoals))
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem("calorieTracker_foods", JSON.stringify(foods))
  }, [foods])

  useEffect(() => {
    localStorage.setItem("calorieTracker_goals", JSON.stringify(dailyGoals))
  }, [dailyGoals])

  // Calcular totais
  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const addFood = () => {
    if (!foodName || !calories) return

    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: foodName,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      meal: selectedMeal as any,
      time: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
    }

    setFoods([...foods, newFood])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const deleteFood = (id: string) => {
    setFoods(foods.filter((f) => f.id !== id))
  }

  const resetForm = () => {
    setFoodName("")
    setCalories("")
    setProtein("")
    setCarbs("")
    setFat("")
  }

  const selectCommonFood = (food: typeof commonFoods[0]) => {
    setFoodName(food.name)
    setCalories(food.calories.toString())
    setProtein(food.protein.toString())
    setCarbs(food.carbs.toString())
    setFat(food.fat.toString())
  }

  const toggleMeal = (meal: string) => {
    setExpandedMeals((prev) => ({ ...prev, [meal]: !prev[meal] }))
  }

  const getMealFoods = (meal: string) => foods.filter((f) => f.meal === meal)

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case "breakfast":
        return <Coffee className="w-5 h-5" />
      case "lunch":
        return <Utensils className="w-5 h-5" />
      case "dinner":
        return <Apple className="w-5 h-5" />
      case "snack":
        return <Cookie className="w-5 h-5" />
      default:
        return null
    }
  }

  const getMealName = (meal: string) => {
    switch (meal) {
      case "breakfast":
        return "Pequeno-almoço"
      case "lunch":
        return "Almoço"
      case "dinner":
        return "Jantar"
      case "snack":
        return "Lanches"
      default:
        return meal
    }
  }

  const caloriesRemaining = dailyGoals.calories - totals.calories
  const caloriesProgress = (totals.calories / dailyGoals.calories) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CaloriaPT</h1>
                <p className="text-sm text-gray-500">Contador de Calorias</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/perfil">
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Perfil</span>
                </Button>
              </Link>
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 gap-2">
                  <Crown className="w-4 h-4" />
                  <span className="hidden sm:inline">Premium</span>
                </Button>
              </Link>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg">
                    <Plus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Adicionar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Alimento</DialogTitle>
                    <DialogDescription>
                      Registe o que comeu para acompanhar as suas calorias diárias
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 mt-4">
                    {/* Alimentos Comuns */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Alimentos Comuns</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                        {commonFoods.map((food, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            className="justify-start text-left h-auto py-2 hover:bg-emerald-50 hover:border-emerald-300"
                            onClick={() => selectCommonFood(food)}
                          >
                            <div className="text-xs">
                              <div className="font-medium">{food.name}</div>
                              <div className="text-gray-500">{food.calories} kcal</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Formulário */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="meal">Refeição</Label>
                        <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="breakfast">Pequeno-almoço</SelectItem>
                            <SelectItem value="lunch">Almoço</SelectItem>
                            <SelectItem value="dinner">Jantar</SelectItem>
                            <SelectItem value="snack">Lanche</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="foodName">Nome do Alimento</Label>
                        <Input
                          id="foodName"
                          value={foodName}
                          onChange={(e) => setFoodName(e.target.value)}
                          placeholder="Ex: Arroz com frango"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="calories">Calorias (kcal) *</Label>
                          <Input
                            id="calories"
                            type="number"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            placeholder="200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="protein">Proteína (g)</Label>
                          <Input
                            id="protein"
                            type="number"
                            value={protein}
                            onChange={(e) => setProtein(e.target.value)}
                            placeholder="20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="carbs">Hidratos (g)</Label>
                          <Input
                            id="carbs"
                            type="number"
                            value={carbs}
                            onChange={(e) => setCarbs(e.target.value)}
                            placeholder="30"
                          />
                        </div>
                        <div>
                          <Label htmlFor="fat">Gordura (g)</Label>
                          <Input
                            id="fat"
                            type="number"
                            value={fat}
                            onChange={(e) => setFat(e.target.value)}
                            placeholder="10"
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={addFood} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
                      Adicionar à Refeição
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumo de Calorias */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Principal de Calorias */}
            <Card className="border-2 border-emerald-100 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Resumo de Hoje</CardTitle>
                  <Dialog open={isGoalsDialogOpen} onOpenChange={setIsGoalsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Target className="w-4 h-4 mr-2" />
                        Definir Metas
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Metas Diárias</DialogTitle>
                        <DialogDescription>
                          Defina as suas metas nutricionais diárias
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Calorias (kcal)</Label>
                          <Input
                            type="number"
                            value={dailyGoals.calories}
                            onChange={(e) =>
                              setDailyGoals({ ...dailyGoals, calories: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Label>Proteína (g)</Label>
                          <Input
                            type="number"
                            value={dailyGoals.protein}
                            onChange={(e) =>
                              setDailyGoals({ ...dailyGoals, protein: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Label>Hidratos de Carbono (g)</Label>
                          <Input
                            type="number"
                            value={dailyGoals.carbs}
                            onChange={(e) =>
                              setDailyGoals({ ...dailyGoals, carbs: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Label>Gordura (g)</Label>
                          <Input
                            type="number"
                            value={dailyGoals.fat}
                            onChange={(e) =>
                              setDailyGoals({ ...dailyGoals, fat: Number(e.target.value) })
                            }
                          />
                        </div>
                        <Button
                          onClick={() => setIsGoalsDialogOpen(false)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
                        >
                          Guardar Metas
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {caloriesRemaining >= 0 ? caloriesRemaining : 0}
                  </div>
                  <div className="text-gray-500 text-sm">calorias restantes</div>
                  <Progress value={Math.min(caloriesProgress, 100)} className="mt-4 h-3" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">{dailyGoals.calories}</div>
                    <div className="text-xs text-gray-600 mt-1">Meta</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totals.calories}</div>
                    <div className="text-xs text-gray-600 mt-1">Consumidas</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.max(caloriesRemaining, 0)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Restantes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refeições */}
            <div className="space-y-4">
              {["breakfast", "lunch", "dinner", "snack"].map((meal) => {
                const mealFoods = getMealFoods(meal)
                const mealTotals = mealFoods.reduce(
                  (acc, food) => acc + food.calories,
                  0
                )

                return (
                  <Card key={meal} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleMeal(meal)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg text-white">
                            {getMealIcon(meal)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{getMealName(meal)}</CardTitle>
                            <CardDescription>
                              {mealTotals} kcal • {mealFoods.length} alimento(s)
                            </CardDescription>
                          </div>
                        </div>
                        {expandedMeals[meal] ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </CardHeader>

                    {expandedMeals[meal] && (
                      <CardContent>
                        {mealFoods.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            <p>Nenhum alimento registado</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {mealFoods.map((food) => (
                              <div
                                key={food.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{food.name}</div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    {food.time} • {food.calories} kcal
                                    {food.protein > 0 && ` • P: ${food.protein}g`}
                                    {food.carbs > 0 && ` • H: ${food.carbs}g`}
                                    {food.fat > 0 && ` • G: ${food.fat}g`}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteFood(food.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Sidebar - Macros */}
          <div className="space-y-6">
            <Card className="shadow-lg border-2 border-teal-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  Macronutrientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Proteína */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Proteína</span>
                    <span className="text-sm text-gray-600">
                      {totals.protein}g / {dailyGoals.protein}g
                    </span>
                  </div>
                  <Progress
                    value={(totals.protein / dailyGoals.protein) * 100}
                    className="h-2 bg-blue-100"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.max(dailyGoals.protein - totals.protein, 0)}g restantes
                  </div>
                </div>

                {/* Hidratos */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Hidratos</span>
                    <span className="text-sm text-gray-600">
                      {totals.carbs}g / {dailyGoals.carbs}g
                    </span>
                  </div>
                  <Progress
                    value={(totals.carbs / dailyGoals.carbs) * 100}
                    className="h-2 bg-orange-100"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.max(dailyGoals.carbs - totals.carbs, 0)}g restantes
                  </div>
                </div>

                {/* Gordura */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Gordura</span>
                    <span className="text-sm text-gray-600">
                      {totals.fat}g / {dailyGoals.fat}g
                    </span>
                  </div>
                  <Progress
                    value={(totals.fat / dailyGoals.fat) * 100}
                    className="h-2 bg-yellow-100"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.max(dailyGoals.fat - totals.fat, 0)}g restantes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card className="shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">💡 Dica do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-emerald-50">
                  Beba pelo menos 2 litros de água por dia para manter-se hidratado e ajudar no
                  metabolismo!
                </p>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total de alimentos</span>
                  <span className="font-bold text-gray-900">{foods.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Refeições registadas</span>
                  <span className="font-bold text-gray-900">
                    {["breakfast", "lunch", "dinner", "snack"].filter(
                      (meal) => getMealFoods(meal).length > 0
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progresso da meta</span>
                  <span className="font-bold text-emerald-600">
                    {Math.min(Math.round(caloriesProgress), 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
