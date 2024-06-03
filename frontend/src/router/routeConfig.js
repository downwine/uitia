import { LoginPage } from '../pages/LoginPage/LoginPage'
import { MainPage } from '../pages/MainPage/MainPage'
import { ProfilePage } from '../pages/ProfilePage/ProfilePage'
import { RegisterPage } from '../pages/RegisterPage/RegisterPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage/ResetPasswordPage'
import { WeatherPage } from '../pages/WeatherPage/WeatherPage'
import { CalculatorPage } from '../pages/CalculatorPage/CalculatorPage'
import { CrossPage } from '../pages/CrossPage/CrossPage'
import { TodoPage } from '../pages/TodoPage/TodoPage'

export const RoutePath = {
    main_page: '/',
    login: '/login',
    profile: '/profile',
    register: '/register',
    reset_password: '/reset_password',
    calculator: '/calculator',
    weather: '/weather',
    cross: '/cross',
    todo: '/todo',
    not_found: '*',
}

export const routeConfig = {
    main_page: {
        path: RoutePath.main_page,
        element: <MainPage />,
        authOnly: true,
    },
    profile: {
        path: RoutePath.profile,
        element: <ProfilePage />,
        authOnly: true,
    },
    login: {
        path: RoutePath.login,
        element: <LoginPage />,
        unAuthOnly: true,
    },
    register: {
        path: RoutePath.register,
        element: <RegisterPage />,
        unAuthOnly: true,
    },
    reset_password: {
        path: RoutePath.reset_password,
        element: <ResetPasswordPage />,
        unAuthOnly: true,
    },
    calculator: {
        path: RoutePath.calculator,
        element: <CalculatorPage />,
    },
    weather: {
        path: RoutePath.weather,
        element: <WeatherPage />,
    },
    cross: {
        path: RoutePath.cross,
        element: <CrossPage />,
        authOnly: true,
    },
    todo: {
        path: RoutePath.todo,
        element: <TodoPage />,
        authOnly: true,
    },
    not_found: {
        path: RoutePath.not_found,
        element: <div>Страница не найдена</div>,
    },
}
