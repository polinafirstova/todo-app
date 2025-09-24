import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Button from '../components/common/Button';
import FormItem from '../components/common/FormItem';
import Input from '../components/common/Input';
import LoginForm from '../components/forms/LoginForm';

import useNotification from 'antd/es/notification/useNotification';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../config/firebase';
import { setAuthError, setAuthLoading, setUser } from '../features/authSlice';

// Страница регистрации нового пользователя
export default function RegisterPage() {
    // Хук useNotification для отображения уведомлений
    const [api, contextHolder] = useNotification();
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
        console.log('Received values of form: ', values);
        dispatch(setAuthLoading(true)); // Состояние загрузки

        try {
            // Создание нового пользователя с помощью Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            // Обновление профилья пользователя, добавляя имя
            await updateProfile(user, {
                displayName: values.name
            });

            // Сохранение данных пользователя в Redux
            dispatch(setUser({ uid: user.uid, email: user.email, displayName: user.displayName || values.name }));

            // Отображение уведомления об успешной регистрации
            api.success({
                message: 'Регистрация прошла успешно!',
                placement: 'topRight',
            });

            // Перенаправление на главную страницу
            navigate('/');
        } catch (error) {
            console.error("Ошибка регистрации:", error.message);
            // Сохранение ошибки в Redux
            dispatch(setAuthError(error.message));

            // Отображение уведомления об ошибке
            api.error({
                message: 'Ошибка регистрации',
                placement: 'topRight',
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
        api.error({
            message: 'Ошибка валидации',
            description: 'Пожалуйста, проверьте введенные данные.',
            placement: 'topRight',
        });
    };

    return (
        <>
            {contextHolder}
            <LoginForm
                title='Регистрация'
                name="registerForm"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <FormItem
                    label="Имя пользователя"
                    name="name"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите ваше имя!' },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
                </FormItem>
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
                        { min: 6, message: 'Пароль должен содержать минимум 6 символов!' },
                    ]}
                >
                    <Input password prefix={<LockOutlined />} placeholder="Пароль" />
                </FormItem>
                <FormItem
                    label="Подтвердите пароль"
                    name="confirmPassword"
                    rules={[
                        { required: true, message: 'Пожалуйста, подтвердите ваш пароль!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Пароли не совпадают!'));
                            },
                        }),
                    ]}
                >
                    <Input password prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" loading={authLoading}>
                        Зарегистрироваться
                    </Button>
                </FormItem>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    Уже есть аккаунт?
                    <Button type="link" onClick={() => navigate('/login')}>
                        Войти
                    </Button>
                </div>
            </LoginForm>
        </>
    );
}