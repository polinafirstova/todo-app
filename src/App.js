import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Основной компонент приложения
export default function App() {
    return (
        <Routes>
            <Route path='/login' element={<LoginPage />}></Route>
            <Route path='/register' element={<RegisterPage />}></Route>
            {/* Защищенный маршрут для главной страницы */}
            <Route path='/' element={
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>
            }></Route>
            {/* Маршрут для всех остальных путей - перенаправляет на главную страницу */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}