import React, { memo, useCallback } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RequireAuth } from './RequireAuth'
import { RequireUnAuth } from './RequireUnAuth'
import { routeConfig } from './routeConfig'

const AppRouter = () => {
    const renderWithWrapper = useCallback((route) => {
        const element = (
            <div className='page-wrapper'>{route.element}</div>
        )
        return <Route key={route.path} path={route.path} element={route.authOnly ? <RequireAuth>{element}</RequireAuth> :(route.unAuthOnly ? <RequireUnAuth>{element}</RequireUnAuth> :  element)} />
    }, [])

    return <Routes>{Object.values(routeConfig).map(renderWithWrapper)}</Routes>
}

export default memo(AppRouter)
