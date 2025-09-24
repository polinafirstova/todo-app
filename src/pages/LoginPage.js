import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import FormItem from '../components/common/FormItem';
import Input from '../components/common/Input';
import LoginForm from '../components/forms/LoginForm';
import { auth } from '../config/firebase';
import { setAuthError, setAuthLoading, setUser } from '../features/authSlice';

// Страница входа в систему
export default function LoginPage() {
    // Хуки для навигации, диспетчера Redux и состояния загрузки
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authLoading = useSelector(state => state.auth.isLoading);
    // Текущий пользователь из Redux
    const user = useSelector(state => state.auth.user);

    // Эффект для перенаправления на главную страницу, если пользователь уже авторизован
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    // Функция для обработки успешной отправки формы
    const onFinish = async (values) => {
        dispatch(setAuthLoading(true)); // Состояние загрузки

        try {
            // Вход с помощью Firebase
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            // Сохранение данных пользователя в Redux
            dispatch(setUser({ uid: user.uid, email: user.email }));

            // Отображение уведомления об успешном входе
            notification.success({
                message: 'Вход выполнен успешно!',
                placement: 'topRight',
            });

            // Перенаправление на главную страницу
            navigate('/');
        } catch (error) {
            console.error("Ошибка входа:", error.message);
            // Сохранение ошибки в Redux
            dispatch(setAuthError(error.message));

            // Отображение уведомления об ошибке
            notification.error({
                message: 'Ошибка входа',
                description: error.message,
            });
        } finally {
            // Сброс состояния загрузки
            dispatch(setAuthLoading(false));
        }
    };

    // Функция для обработки ошибок валидации формы
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);

        // Отображение уведомления об ошибке валидации
        notification.error({
            message: 'Ошибка валидации',
            description: 'Пожалуйста, проверьте введенные данные.',
            placement: 'topRight',
        });
    };

    return (
        <LoginForm
            title='Вход в систему'
            name="loginForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <FormItem
                label="Электронная почта"
                name="email"
                rules={[
                    { required: true, message: 'Пожалуйста, введите ваш Email!' },
                    { type: 'email', message: 'Некорректный формат Email!' },
                ]}
            >
                <Input prefix={<MailOutlined />} placeholder="Email" />
            </FormItem>
            <FormItem
                label="Пароль"
                name="password"
                rules={[
                    { required: true, message: 'Пожалуйста, введите ваш пароль!' },
                ]}
            >
                <Input password prefix={<LockOutlined />} placeholder="Пароль" />
            </FormItem>
            <FormItem>
                <Button block type="primary" htmlType="submit" loading={authLoading}>
                    Войти
                </Button>
            </FormItem>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                Нет аккаунта?
                <Button type="link" onClick={() => navigate('/register')}>
                    Зарегистрироваться
                </Button>
            </div>
        </LoginForm>
    );
}