import axios from 'axios';

export const dataImpulseClient = axios.create({
  baseURL: process.env.BASE_URL_PROVIDED,
  headers: {
    Authorization: `Bearer ${process.env.DATAIMPULSE_API_KEY}`,
    'Content-Type': 'application/json',
  },
});
