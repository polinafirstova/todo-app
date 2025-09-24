import { createSlice } from '@reduxjs/toolkit';

// Начальное состояние для аутентификации
const initialState = {
    user: null, // Данные пользователя
    isLoading: true, // Флаг загрузки
    error: null, // Ошибка аутентификации
};

// Слайс для управления состоянием аутентификации
const authSlice = createSlice({
    name: 'auth', // Имя слайса
    initialState, // Начальное состояние
    reducers: {
        // Установка данных пользователя
        setUser(state, action) {
            state.user = action.payload;
            state.error = null;
            state.isLoading = false;
        },
        // Удаление данных пользователя
        clearUser(state) {
            state.user = null;
            state.error = null;
            state.isLoading = false;
        },
        // Установка состояния загрузки
        setAuthLoading(state, action) {
            state.isLoading = action.payload;
        },
        // Установка ошибки аутентификации
        setAuthError(state, action) {
            state.error = action.payload;
            state.user = null;
            state.isLoading = false;
        }
    },
});

export const { setUser, clearUser, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;