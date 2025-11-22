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

function createDataImpulseClient() {
  if (!process.env.BASE_URL_PROVIDED) {
    throw new Error('BASE_URL_PROVIDED não definido');
  }

  return axios.create({
    baseURL: process.env.BASE_URL_PROVIDED,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export const dataImpulseClient = createDataImpulseClient();

dataImpulseClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === 'Token has expired' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newToken = await loginAndGetNewToken();
      dataImpulseClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return dataImpulseClient.request(originalRequest);
    }

    return Promise.reject(error);
  }
);
