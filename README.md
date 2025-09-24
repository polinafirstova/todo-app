# TODO App — Менеджер задач

## Описание

Это простое веб-приложение для управления списком задач. Оно позволяет пользователям регистрироваться, входить в систему и управлять своими задачами. Приложение использует React, Firebase, Ant Design и Redux Toolkit.

## Функциональность

*   Аутентификация пользователей (регистрация, вход, выход)
*   Управление задачами (добавление, редактирование, удаление, отметка как выполненной)
*   Фильтрация и поиск задач
*   Адаптивный дизайн
*   Темная/светлая тема

## Инструкция по запуску

1.  Клонируйте репозиторий:

    ```bash
    git clone https://github.com/polinafirstova/todo-app.git
    ```

2.  Перейдите в папку проекта:

    ```bash
    cd todo-app
    ```

3.  Установите зависимости:

    ```bash
    npm install
    ```

    или

    ```bash
    yarn install
    ```

4.  Создайте файл `.env.local` в корне проекта и добавьте туда свои ключи API Firebase. Пример содержимого файла `.env.local`:

    ```
    REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
    REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
    REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
    ```

5.  Запустите приложение:

    ```bash
    npm start
    ```

    или

    ```bash
    yarn start
    ```