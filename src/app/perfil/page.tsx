"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Calendar, Target, Activity, ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface UserProfile {
  name: string
  email: string
  phone: string
  birthDate: string
  gender: string
  height: string
  currentWeight: string
  targetWeight: string
  activityLevel: string
  goal: string
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    height: "",
    currentWeight: "",
    targetWeight: "",
    activityLevel: "",
    goal: "",
  })

  const [isSaved, setIsSaved] = useState(false)

  // Carregar perfil do localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("calorieTracker_profile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("calorieTracker_profile", JSON.stringify(profile))
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)

    // Calcular e atualizar metas baseadas no perfil
    if (profile.currentWeight && profile.height && profile.activityLevel && profile.goal) {
      const calculatedGoals = calculateDailyGoals(profile)
      localStorage.setItem("calorieTracker_goals", JSON.stringify(calculatedGoals))
    }
  }

  const calculateDailyGoals = (profile: UserProfile) => {
    const weight = parseFloat(profile.currentWeight)
    const height = parseFloat(profile.height)
    
    // Fórmula simplificada de Harris-Benedict
    let bmr = 10 * weight + 6.25 * height - 5 * 25 + 5 // Assumindo 25 anos como média

    // Multiplicador de atividade
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    }

    const tdee = bmr * (activityMultipliers[profile.activityLevel] || 1.2)

    // Ajustar baseado no objetivo
    let calories = tdee
    if (profile.goal === "lose") calories -= 500
    if (profile.goal === "gain") calories += 500

    return {
      calories: Math.round(calories),
      protein: Math.round(weight * 2), // 2g por kg
      carbs: Math.round((calories * 0.4) / 4), // 40% das calorias
      fat: Math.round((calories * 0.3) / 9), // 30% das calorias
    }
  }

  const updateField = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Informações Pessoais */}
          <Card className="shadow-lg border-2 border-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Preencha os seus dados pessoais para personalizar a sua experiência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="João Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="joao@exemplo.pt"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+351 912 345 678"
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => updateField("birthDate", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gender">Género</Label>
                <Select value={profile.gender} onValueChange={(value) => updateField("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Dados Físicos */}
          <Card className="shadow-lg border-2 border-teal-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                Dados Físicos
              </CardTitle>
              <CardDescription>
                Estas informações ajudam a calcular as suas necessidades calóricas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => updateField("height", e.target.value)}
                    placeholder="175"
                  />
                </div>
                <div>
                  <Label htmlFor="currentWeight">Peso Atual (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    value={profile.currentWeight}
                    onChange={(e) => updateField("currentWeight", e.target.value)}
                    placeholder="70"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="targetWeight">Peso Objetivo (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  value={profile.targetWeight}
                  onChange={(e) => updateField("targetWeight", e.target.value)}
                  placeholder="65"
                />
              </div>
            </CardContent>
          </Card>

          {/* Objetivos e Atividade */}
          <Card className="shadow-lg border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Objetivos e Atividade
              </CardTitle>
              <CardDescription>
                Defina o seu objetivo e nível de atividade física
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goal">Objetivo Principal</Label>
                <Select value={profile.goal} onValueChange={(value) => updateField("goal", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o seu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Perder Peso</SelectItem>
                    <SelectItem value="maintain">Manter Peso</SelectItem>
                    <SelectItem value="gain">Ganhar Peso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="activityLevel">Nível de Atividade Física</Label>
                <Select
                  value={profile.activityLevel}
                  onValueChange={(value) => updateField("activityLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível de atividade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">
                      Sedentário (pouco ou nenhum exercício)
                    </SelectItem>
                    <SelectItem value="light">
                      Levemente ativo (exercício leve 1-3 dias/semana)
                    </SelectItem>
                    <SelectItem value="moderate">
                      Moderadamente ativo (exercício moderado 3-5 dias/semana)
                    </SelectItem>
                    <SelectItem value="active">
                      Muito ativo (exercício intenso 6-7 dias/semana)
                    </SelectItem>
                    <SelectItem value="veryActive">
                      Extremamente ativo (exercício muito intenso, trabalho físico)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Botão Guardar */}
          <div className="flex justify-end gap-4">
            {isSaved && (
              <div className="flex items-center gap-2 text-emerald-600 font-medium">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                Perfil guardado com sucesso!
              </div>
            )}
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Perfil
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
