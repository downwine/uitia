import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BaseUrl = 'http://127.0.0.1:8000/'
export const baseQuery = fetchBaseQuery({
    baseUrl: BaseUrl,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = localStorage.getItem('access');
  
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
  
      return headers;
    },
  });