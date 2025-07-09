import { randomUUID } from 'crypto';

export async function createPixPayment({ amount, description, payerEmail }: {
  amount: number;
  description: string;
  payerEmail: string;
}) {
  const idempotencyKey = randomUUID();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s

  try {
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key":idempotencyKey
      },
      body: JSON.stringify({
        transaction_amount: 1,
        description,
        payer: { email: payerEmail },
        payment_method_id: "pix",
      }),
      signal: controller.signal,  // adiciona o signal aqui
    });


    clearTimeout(timeoutId);

    if (!response.ok) {
      // tratamento de erro
      const errorData = await response.json().catch(() => null);
      const errorMsg = errorData?.message || `Erro HTTP ${response.status}`;
      console.log(response)
      throw new Error(`Erro ao criar pagamento: ${errorMsg}`);
    }

    const data = await response.json();
    return {
      paymentId: data.id,
      qrCode: data.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: data.point_of_interaction.transaction_data.qr_code_base64,
      amount: data.transaction_amount,
    };

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Erro: tempo de requisição esgotado (timeout)');
    }
    throw error;
  }
}
