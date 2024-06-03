import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './const'

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: baseQuery,
    tagTypes: [],
    endpoints: (build) => ({
        fetchAllUsers: build.query({
            query: () =>( {
                url: `api/auth/users`,
            }),
        }),
        checkUser: build.query({
            query: () =>( {
                url: `api/auth/check`,
            }),
        }),
        getUserInfo: build.query({
            query: () =>( {
                url: `api/auth/user`,
            }),
        }),
        removeUser: build.mutation({
            query: (body) =>( {
                url: `api/auth/drop`,
                method: 'DELETE',
                body: body
            }),
        }),
        resetPassword: build.mutation({
            query: (body) =>( {
                url: `api/auth/reset`,
                method: 'POST',
                body: body
            }),
        }),
    })
})