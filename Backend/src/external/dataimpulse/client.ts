import axios from 'axios';
import FormData from 'form-data';

let token = process.env.DATAIMPULSE_API_KEY ?? '';

async function loginAndGetNewToken(): Promise<string> {
  const form = new FormData();
  form.append('login', process.env.DATAIMPULSE_USERNAME ?? '');
  form.append('password', process.env.DATAIMPULSE_PASSWORD ?? '');

  const response = await axios.post<{ token: string }>(
    `${process.env.BASE_URL_PROVIDED}/reseller/user/token/get`,
    form,
    { headers: form.getHeaders() }
  );

  token = response.data.token;
  return token;
}

export const dataImpulseClient = axios.create({
  baseURL: process.env.BASE_URL_PROVIDED,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratar token expirado
dataImpulseClient.interceptors.response.use(
  response => response,
  async error => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === 'Token has expired'
    ) {
      try {
        const newToken = await loginAndGetNewToken();

        // Atualiza headers globais corretamente
        dataImpulseClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Atualiza header da requisição original
        error.config.headers['Authorization'] = `Bearer ${newToken}`;

        // Reenvia a requisição original
        return dataImpulseClient.request(error.config);
      } catch (loginError) {
        return Promise.reject(loginError);
      }
    }

    return Promise.reject(error);
  }
);
