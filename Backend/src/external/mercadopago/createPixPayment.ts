import { randomUUID } from 'crypto'

export async function createPixPayment({ amount, description, payerEmail }: {
  amount: number
  description: string
  payerEmail: string
}) {
  const idempotencyKey = randomUUID()

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      transaction_amount: amount,
      description,
      payment_method_id: "pix",
      payer: { email: payerEmail },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Erro ao criar pagamento: ${error.message || 'desconhecido'}`)
  }

  const data = await response.json()

  return {
    paymentId: data.id,
    qrCode: data.point_of_interaction.transaction_data.qr_code,
    qrCodeBase64: data.point_of_interaction.transaction_data.qr_code_base64,
    amount: data.transaction_amount,
  }
}