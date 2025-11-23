
---

# 📌 **SellProxy (Backend)**

Este projeto segue uma arquitetura modular inspirada em Clean Architecture, com separação por domínios, uso de Orchestrators, DTOs, Repositories, Services e integração com Mercado Pago e DataImpulse.

---

# 🚀 **Tecnologias Utilizadas**

### **Backend**

* **Node.js** + **TypeScript**
* **Express**
* **Prisma ORM**
* **PostgreSQL** (via Docker)
* **bcrypt** (hash de senha)
* **JWT** (autenticação)
* **Zod** (validação)
* **Mercado Pago SDK**
* **Axios** (requests externos)
* **Docker Compose**

### **Arquitetura**
### ✔ Principais padrões usados

* **Modular Monolith**
* **Repository Pattern**
* **Service Layer**
* **Orchestrator Pattern**
* **DTO Pattern**
* **Dependency Injection (Containers)**
* **Global Error Handling**
* **Middleware Layer**
* **Integration Layer (Mercado Pago / DataImpulse)**

---

# 🧩 **Estrutura Atual do Projeto**

```
/src
 ├── core
 │    ├── middlewares
 │    │     ├── auth.middleware.ts
 │    │     ├── validate.ts
 │    ├── errors
 │          ├── AppError.ts
 │          ├── errorHandler.ts
 │
 ├── modules
 │    ├── auth
 │    │     ├── AuthController.ts
 │    │     ├── AuthService.ts
 │    │     ├── AuthRepository.ts
 │    │     ├── AuthOrchestrator.ts
 │    │     ├── AuthContainer.ts
 │    │     ├── AuthRoutes.ts
 │    │     ├── dtos/
 │    │
 │    ├── proxy
 │    │     ├── ProxyController.ts
 │    │     ├── ProxyService.ts
 │    │     ├── ProxyContainer.ts
 │    │     ├── ProxyOrchestrator.ts
 │    │     ├── ProxyRepository.ts
 │    │     ├── ProxyRoutes.ts
 │    │
 │    ├── payments
 │    │     ├── PaymentController.ts
 │    │     ├── PaymentService.ts
 │    │     ├── PaymentRepository.ts
 │    │     ├── PaymentOrchestrator.ts
 │    │     ├── PaymentRoutes.ts
 │    │     ├── PaymentContainer.ts
 │    │     ├── mercadopago/createPixPayment.ts
 │    │
 │    ├── logs
 │    │      ├── LogsController.ts
 │    │      ├── LogsService.ts
 │    │
 │    ├── user
 │    │     ├── UserController.ts
 │    │     ├── UserService.ts
 │    │     ├── UserRepository.ts
 │    │     ├── UserOrchestrator.ts
 │    │     ├── UserContainer.ts
 │    │     ├── UserRoutes.ts
 │    │     ├── dtos/
 │
 ├── shared
 │     ├── prisma/client.ts
 │     ├── utils/
 │
 ├── config
 │     ├── prisma/client.ts
 │
 │
 ├── server.ts
```

---

# 🧠 **Padrões de Arquitetura**

### ✅ **1. Repository Pattern**

Cada módulo tem seu próprio repositório:

* `AuthRepository.ts`
* `ProxyRepository.ts`
* `PaymentRepository.ts`

→ **Objetivo:** Centralizar acesso ao banco e isolar Prisma da regra de negócio.

---

### ✅ **2. Service Layer Pattern**

Serviços contendo apenas **lógica de negócio pura**, sem Express, sem banco direto.

→ Exemplo:

* Autenticação (login)
* Criar usuário proxy
* Criar compra PIX
* Validar cupom
* Ver histórico de compras

---

### ✅ **3. Orchestrator Pattern**

foi criado **orquestradores para operações complexas**, como:

### 🔹 `AuthOrchestrator`

Fluxo do login:

1. Autentica usuário
2. Cria usuário no Proxy automaticamente (se precisar)
3. Gera token
4. Gera logs

### 🔹 `UserOrchestrator`

Fluxo do registro:

1. Registrar usuario usuário
2. Cria usuário no Proxy automaticamente (se precisar)
3. Gera token
4. Gera logs


### 🔹 `PaymentOrchestrator`

Fluxos:

* Criar compra (createPurchase)
* Processar compra via PIX
* Processar webhook do Mercado Pago
* Consumir proxyService + paymentService juntos

→ O orquestrador coordena **vários serviços** sem os serviços conhecerem entre si.

---

# ⚠️ **4. Error Handling Global (AppError + Middleware)**

Foi implementado:

### **`AppError`**

```ts
class AppError {
  constructor(
     public message: string,
     public statusCode = 400
  ) {}
}
```

### **`errorHandler` middleware**

Captura erros lançados no service/orchestrator:

```ts
app.use((err, req, res, next) => {
   if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
   }

   return res.status(500).json({ message: "Internal server error" });
});
```


---

# 👮‍♂️ **6. Middlewares**

foi implementado:

* `authenticateToken` → valida JWT
* `validate()` → valida request body via Zod

---

# 🧾 **7. DTOs (Data Transfer Objects)**

Criados para padronizar body, params e retorno das rotas.

### Ex:

* `UserLoginDTO`

---

# 📚 **8. Logs Centralizados**

foi implementado um sistema de logs com:

* `createLog()`
* `LogsService`
* `LogsController`
* Logs de login, pagamento, webhook, erros, etc.

eles serão gravados em um banco de dados(temporario)

---

# 💰 **9. Integração com Mercado Pago**

foi implementado:

* Criar pagamento PIX
* Buscar pagamento
* Webhook para confirmação
* Adicionar GB ao usuário após pagamento aprovado
* Limpar cooldown após sucesso

---

# 🔒 **10. Sistema completo de autenticação**

* Login
* Criação de cookie seguro
* Refresh implícito
* Bloqueio de usuário
* Logs de tentativa de login

---

# 🧩 **11. Cupom de Desconto**

foi implementado:

* Validação de cupom
* Cupom de uso único
* Cupom com minGb
* Cupom com validade
* Cupom por usuário

---

**📜 Licença**

MIT — fique livre para usar e expandir.