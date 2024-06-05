import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './const'

export const todoAPI = createApi({
    reducerPath: 'todoAPI',
    baseQuery: baseQuery,
    tagTypes: ['GET_TODO'], // для повторной отправки запроса после изменения/удаления/добавления todo
    endpoints: (build) => ({
        getTodo: build.query({
            query: (body) =>( {
                url: `api/auth/todo`,
                method: 'GET',
            }),
            providesTags: ['GET_TODO']
        }),
        addTodo: build.mutation({
            query: (body) =>( {
                url: `api/auth/todo/add`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['GET_TODO']
        }),
        deleteTodo: build.mutation({
            query: (id) =>( {
                url: `api/auth/todo/delete/` + id,
                method: 'DELETE',
            }),
            invalidatesTags: ['GET_TODO']
        }),
        completeTodo: build.mutation({
            query: (body) =>( {
                url: `api/auth/todo/complete/` + body.id,
                method: 'PUT',
                body: {is_done: body.is_done}
            }),
            invalidatesTags: ['GET_TODO']
        }),
        changeTodo: build.mutation({
            query: (body) =>( {
                url: `api/auth/todo/change/` + body.id,
                method: 'PUT',
                body: {name: body.name}
            }),
            invalidatesTags: ['GET_TODO']
        }),
    })
})