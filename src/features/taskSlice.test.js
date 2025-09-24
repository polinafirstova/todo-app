import taskReducer, {
    clearTasks,
    setTaskListLoading,
    setTasks
} from './taskSlice';

// Мок Firebase для изоляции тестов
jest.mock('../config/firebase', () => ({
    db: {
        collection: jest.fn(),
        query: jest.fn(),
        where: jest.fn(),
        orderBy: jest.fn(),
        onSnapshot: jest.fn(),
    },
}));

// Тесты для редьюсера taskSlice
describe('taskSlice Reducer', () => {
    // Начальное состояние
    const initialState = {
        tasks: [],
        taskListLoading: false,
        error: null,
    };

    // Тест для действия clearTasks
    it('should handle clearTasks', () => {
        const nextState = taskReducer({ ...initialState, tasks: [{ id: '1', title: 'Task 1' }] }, clearTasks());
        expect(nextState.tasks).toEqual([]); // Проверка очистки списка задач
    });

    // Тест для действия setTasks
    it('should handle setTasks', () => {
        const payload = [{ id: '1', title: 'Task 1' }, { id: '2', title: 'Task 2' }];
        const nextState = taskReducer(initialState, setTasks(payload));
        expect(nextState.tasks).toEqual(payload); // Проверка установки списка задач
    });

    // Тест для действия setTaskListLoading
    it('should handle setTaskListLoading', () => {
        const payload = true;
        const nextState = taskReducer(initialState, setTaskListLoading(payload));
        expect(nextState.taskListLoading).toBe(payload); // Проверка установки состояния загрузки
    });
});