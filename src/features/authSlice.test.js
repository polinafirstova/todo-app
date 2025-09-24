import authReducer, {
    clearUser,
    setAuthError,
    setAuthLoading,
    setUser,
} from './authSlice';

// Тесты для редьюсера authSlice
describe('authSlice Reducer', () => {
    // Начальное состояние
    const initialState = {
        user: null,
        isLoading: true,
        error: null,
    };

    // Тест для действия setUser
    test('should handle setUser', () => {
        const payload = {
            uid: '123',
            email: 'test@example.com',
            displayName: 'Test User',
        };
        const nextState = authReducer(initialState, setUser(payload));
        expect(nextState.user).toEqual(payload); // Проверка, что пользователь установлен
        expect(nextState.error).toBeNull(); // Проверка, что ошибка очищена
        expect(nextState.isLoading).toBe(false); // Проверка, что загрузка завершена
    });

    // Тест для действия clearUser
    test('should handle clearUser', () => {
        const stateWithUser = {
            ...initialState,
            user: { uid: '123', email: 'test@example.com' },
            isLoading: false,
        };
        const nextState = authReducer(stateWithUser, clearUser());
        expect(nextState.user).toBeNull(); // Проверка, что пользователь очищен
        expect(nextState.error).toBeNull(); // Проверка, что ошибка очищена
        expect(nextState.isLoading).toBe(false); // Проверка, что загрузка завершена
    });

    // Тест для действия setAuthLoading
    test('should handle setAuthLoading', () => {
        const payload = false;
        const nextState = authReducer(initialState, setAuthLoading(payload));
        expect(nextState.isLoading).toBe(payload); // Проверка, что состояние загрузки установлено
    });

    // Тест для действия setAuthError
    test('should handle setAuthError', () => {
        const payload = 'Authentication failed';
        const nextState = authReducer(initialState, setAuthError(payload));
        expect(nextState.error).toBe(payload); // Проверка, что ошибка установлена
        expect(nextState.user).toBeNull(); // Проверка, что пользователь очищен
        expect(nextState.isLoading).toBe(false); // Проверка, что загрузка завершена
    });
});

// Тесты для действий authSlice
describe('authSlice Actions', () => {
    // Тест для действия setUser
    test('should create setUser action', () => {
        const payload = {
            uid: '123',
            email: 'test@example.com',
            displayName: 'Test User',
        };
        const action = setUser(payload);
        expect(action.type).toEqual('auth/setUser'); // Проверка типа действия
        expect(action.payload).toEqual(payload); // Проверка полезной нагрузки действия
    });

    // Тест для действия clearUser
    test('should create clearUser action', () => {
        const action = clearUser();
        expect(action.type).toEqual('auth/clearUser'); // Проверка типа действия
    });

    // Тест для действия setAuthLoading
    test('should create setAuthLoading action', () => {
        const payload = true;
        const action = setAuthLoading(payload);
        expect(action.type).toEqual('auth/setAuthLoading'); // Проверка типа действия
        expect(action.payload).toEqual(payload); // Проверка полезной нагрузки действия
    });

    // Тест для действия setAuthError
    test('should create setAuthError action', () => {
        const payload = 'Authentication failed';
        const action = setAuthError(payload);
        expect(action.type).toEqual('auth/setAuthError'); // Проверка типа действия
        expect(action.payload).toEqual(payload); // Проверка полезной нагрузки действия
    });
});