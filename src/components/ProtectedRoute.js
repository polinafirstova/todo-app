import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Защищенные роуты 
export default function ProtectedRoute({ children }) {
    // Данные пользователя и состояние загрузки из Redux
    const { user, isLoading } = useSelector((state) => state.auth);

    // Если идет загрузка данных пользователя, отображать спиннер
    if (isLoading) {
        return <Spin size="large" style={{ margin: 'auto' }} />;
    }

    // Если пользователь не авторизован, перенаправлять на страницу логина
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Если пользователь авторизован, отображать дочерние компоненты
    return (children);
}