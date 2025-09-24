import { Col, Layout, Row } from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AuthButton from '../components/AuthButton';
import ThemeSwitcher from '../components/ThemeSwitcher';
import './MainLayout.css';

// Компонент для отображения шапки приложения
const { Header } = Layout;

export default function AppHeader({ toggleTheme, currentTheme }) {
    // Данные пользователя из Redux
    const user = useSelector((state) => state.auth.user);

    // Эффект для применения темы к body
    useEffect(() => {
        document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
    }, [currentTheme]);

    return (
        <Header className="main-header">
            <Row justify="center" align="middle" style={{ width: '100%', height: '100%' }}>
                <Col xs={24} sm={22} md={20} lg={18} xl={16} className="header-content-col">
                    <div className="header-container">
                        <div className="header-left">
                            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                                <h1>TODO App</h1>
                            </Link>
                        </div>
                        <div className="header-right">
                            {/* Отображаение приветствия пользователя, если пользователь авторизован и имеет имя */}
                            {user && user.displayName && (
                                <span className="user-greeting">
                                    Вы зашли как {user.displayName}
                                </span>
                            )}
                            <AuthButton />
                            {/* Переключатель темы */}
                            <ThemeSwitcher toggleTheme={toggleTheme} currentTheme={currentTheme} />
                        </div>
                    </div>
                </Col>
            </Row>
        </Header>
    );
}