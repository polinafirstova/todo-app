import { signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { clearUser } from '../features/authSlice';
import Button from './common/Button';

// Кнопка для авторизации/выхода пользователя
export default function AuthButton() {
    // Хук для отправки экшенов Redux
    const dispatch = useDispatch();
    // Хук для навигации по страницам
    const navigate = useNavigate();
    // Данные пользователя из Redux
    const user = useSelector((state) => state.auth.user);

    // Функция для обработки входа/выхода
    const handleLoginLogout = async () => {
        if (user) {
            // Если пользователь авторизован
            try {
                await signOut(auth); // Выход из Firebase Auth
                dispatch(clearUser()); // Удаление данных пользователя в Redux
                navigate('/login'); // Навигация на страницу логина
                console.log('Пользователь вышел из системы');
            } catch (error) {
                console.error('Ошибка при выходе:', error);
            }
        }
    };

    if (user) {
        // Если пользователь авторизован, отображать кнопку "Выйти"
        return (
            <Button
                onClick={handleLoginLogout}
            >
                Выйти
            </Button>
        );
    }

    return null; // Если пользователь не авторизован, вернуть null 
};