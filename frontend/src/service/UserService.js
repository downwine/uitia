import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './const'

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: baseQuery,
    tagTypes: [],
    endpoints: (build) => ({
        // получение всех пользователей
        fetchAllUsers: build.query({
            query: () =>( {
                url: `api/auth/users`,
            }),
        }),
        // проверка токена пользователя на сервере
        checkUser: build.query({
            query: () =>( {
                url: `api/auth/check`,
            }),
        }),
        // получение информации о пользователе
        getUserInfo: build.query({
            query: () =>( {
                url: `api/auth/user`,
            }),
        }),
        // удаление пользователя
        removeUser: build.mutation({
            query: (body) =>( {
                url: `api/auth/drop`,
                method: 'DELETE',
                body: body
            }),
        }),
        // сброс пароля
        resetPassword: build.mutation({
            query: (body) =>( {
                url: `api/auth/reset`,
                method: 'POST',
                body: body
            }),
        }),
    })
})