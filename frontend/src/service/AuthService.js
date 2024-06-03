import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './const'

export const authAPI = createApi({
    reducerPath: 'authAPI',
    baseQuery: baseQuery,
    tagTypes: [],
    endpoints: (build) => ({
        login: build.mutation({
            query: (body) =>( {
                url: `api/auth/signin`,
                method: 'POST',
                body: body
            }),
        }),
        register: build.mutation({
            query: (body) =>( {
                url: `api/auth/signup`,
                method: 'POST',
                body: body
            }),
        }),
    })
})