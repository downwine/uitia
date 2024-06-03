import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export function RequireAuth({ children }) {
    const isLogin = useSelector((state) => state.app.isLogin);
    const location = useLocation()

    if (!isLogin) {
        return <Navigate to='/login' state={{ from: location }} replace />
    }

    return children
}
