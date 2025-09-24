import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../config/firebase';
import { clearUser, setAuthLoading, setUser } from '../features/authSlice';

// Прослушивание изменения состояния аутентификации Firebase
export default function AuthListener() {
    // Хук для отправки экшенов Redux
    const dispatch = useDispatch();

    // Эффект для прослушивания изменений состояния аутентификации
    useEffect(() => {
        // Состояние загрузки
        dispatch(setAuthLoading(true));

        // Подписка на изменения состояния аутентификации Firebase
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Если пользователь авторизован, отправить экшен для установки данных пользователя в Redux
                dispatch(setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                }));
            } else {
                // Если пользователь не авторизован, отправить экшен для очистки данных пользователя в Redux
                dispatch(clearUser());
            }
            // Выход из состояния загрузки
            dispatch(setAuthLoading(false));
        });

        // Отписки от прослушивания при размонтировании компонента
        return () => unsubscribe();
    }, [dispatch]);

    return null; // Компонент ничего не отображает
};
