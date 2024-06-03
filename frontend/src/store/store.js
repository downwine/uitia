import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { authAPI } from '../service/AuthService'
import { todoAPI } from '../service/TodoService'
import { userAPI } from '../service/UserService'
import appReducer from '../slice/appSlice'

const rootReducer = combineReducers({
    app: appReducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [todoAPI.reducerPath]: todoAPI.reducer,
})


export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(userAPI.middleware, authAPI.middleware, todoAPI.middleware)
    })
}
