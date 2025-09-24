import { ConfigProvider, theme as antdTheme } from 'antd';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AuthListener from './components/AuthListener';
import './config/firebase';
import './index.css';
import MainLayout from './layouts/MainLayout';
import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';

// Корневой компонент приложения
const Root = () => {
  // Состояние для текущей темы (light/dark)
  const [currentTheme, setCurrentTheme] = React.useState(() => {
    // Сохраненная тема из localStorage или светлая тема по умолчанию
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Функция для переключения темы
  const toggleTheme = () => {
    setCurrentTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Выбор алгоритма темы для Ant Design в зависимости от текущей темы
  const antThemeAlgorithm =
    currentTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  // Эффект для применения класса темы к body
  useEffect(() => {
    document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
  }, [currentTheme]);

  return (
    <ConfigProvider
      theme={{
        algorithm: antThemeAlgorithm, // Устанавка алгоритма темы для Ant Design
      }}
    >
      <Provider store={store}> {/* Redux */}
        <AuthListener /> {/* Компонент для прослушивания состояния аутентификации */}
        <BrowserRouter> {/* Маршрутизация */}
          <MainLayout toggleTheme={toggleTheme} currentTheme={currentTheme}> {/* Основной макет приложения */}
            <App /> {/* Основной компонент приложения */}
          </MainLayout>
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  );
};

// Корневой элемент React 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

reportWebVitals();