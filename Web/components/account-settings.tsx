"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/toast-provider"
import { Lock } from "lucide-react"

export function AccountSettings() {
  const { addToast } = useToast()

  const [formData, setFormData] = useState({
    lastPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      addToast({
        type: "error",
        title: "Erro!",
        message: "As senhas não coincidem",
        duration: 3000,
      })
      return
    }

    try {
      const response = await fetch("/api/user/ChangeUserPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastPassword: formData.lastPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao trocar senha.")
      }

      addToast({
        type: "success",
        title: "Senha alterada!",
        message: "Sua senha foi alterada com sucesso.",
        duration: 3000,
      })

      setFormData({
        lastPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Erro!",
        message: error.message || "Erro ao alterar a senha.",
        duration: 3000,
      })
    }
  }

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Alterar Senha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input
              id="current-password"
              type="password"
              value={formData.lastPassword}
              onChange={(e) => setFormData({ ...formData, lastPassword: e.target.value })}
              className="glass"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="glass"
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleChangePassword}
          variant="outline"
          className="glass glass-hover border-white/20 bg-transparent"
        >
          <Lock className="w-4 h-4 mr-2" />
          Alterar Senha
        </Button>
      </CardContent>
    </Card>
  )
}
