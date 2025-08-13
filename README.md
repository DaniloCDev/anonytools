# Nox24Proxy

Sistema completo de **revenda de proxies** com painel administrativo e integração de pagamentos via **Pix**, focado em automação e ativação imediata para clientes.  
Reduz o tempo de ativação de clientes de **24 horas para poucos minutos**, otimizando o processo e melhorando a experiência do usuário.

## 🚀 Funcionalidades

- 💳 **Integração com Pix** para pagamento instantâneo.
- ⚡ **Ativação automática** do proxy após confirmação do pagamento.
- 📊 **Dashboard administrativo** com estatísticas em tempo real.
- 👥 **Gerenciamento de clientes** (criação, edição, bloqueio/desbloqueio e exclusão).
- 📈 Monitoramento de **uso de tráfego (GB)** por cliente.
- 🔄 Sistema de **renovação** e **adicionar saldo**.
- 🔐 Login seguro para clientes e administradores.
- 🖼 Interface responsiva e moderna (Next.js + TailwindCSS).

## 🛠 Tecnologias Utilizadas

**Frontend**
- Next.js
- React
- TailwindCSS
- Axios

**Backend**
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

**Integrações**
- API Pix
- DataImpulse (provedor de proxy)
- JWT para autenticação
- Docker para ambiente de desenvolvimento

```
🔄 Fluxo de Uso
Cliente se cadastra no painel.

Escolhe a quantidade de GBs desejada.

Realiza o pagamento via Pix.

O sistema confirma automaticamente o pagamento via webhook.

O proxy é ativado automaticamente e os dados são exibidos no painel.


```

---
