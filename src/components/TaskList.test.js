import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

// Тесты для компонента TaskList
describe('TaskList Component', () => {
    // Если taskListLoading равен true, должен отображаться спиннер загрузки
    test('should render loading spinner when taskListLoading is true', () => {
        const mockOnEdit = jest.fn(); // Моковая функция для onEdit
        const mockOnDelete = jest.fn(); // Моковая функция для onDelete
        const mockOnToggleStatus = jest.fn(); // Моковая функция для onToggleStatus

        render(
            <TaskList
                tasks={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
                filter="all"
                searchTerm=""
                taskListLoading={true}
            />
        );

        // Проверка отображения спиннера загрузки в документе
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    // Если tasks пуст и filter равен "all" должно отображаться сообщение о пустом списке
    test('should render empty message when tasks is empty and filter is all', () => {
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskList
                tasks={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
                filter="all"
                searchTerm=""
                taskListLoading={false}
            />
        );

        // Проверка на наличие сообщения о пустом списке в документе
        expect(screen.getByTestId('empty-message')).toBeInTheDocument();
        // Провер правильности текста сообщения
        expect(screen.getByText(/Список задач пуст/i)).toBeInTheDocument();
    });

    // Если tasks пуст и filter равен "active" должно отображаться сообщение "Нет активных задач"
    test('should render empty message when tasks is empty and filter is active', () => {
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskList
                tasks={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
                filter="active"
                searchTerm=""
                taskListLoading={false}
            />
        );

        // Проверка наличия сообщения в документе
        expect(screen.getByTestId('empty-message')).toBeInTheDocument();
        // Проверка правильности текста сообщения
        expect(screen.getByText(/Нет активных задач/i)).toBeInTheDocument();
    });

    // Если tasks пуст и filter равен "completed" должно отображаться сообщение "Нет завершенных задач"
    test('should render empty message when tasks is empty and filter is completed', () => {
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskList
                tasks={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
                filter="completed"
                searchTerm=""
                taskListLoading={false}
            />
        );

        // Проверка наличия сообщения в документе
        expect(screen.getByTestId('empty-message')).toBeInTheDocument();
        // Проверка правильности текста сообщения
        expect(screen.getByText(/Нет завершенных задач/i)).toBeInTheDocument();
    });

    // Если searchTerm предоставлен и tasks пуст должно отображаться сообщение об отсутствии результатов поиска
    test('should render no results message when searchTerm is provided and tasks is empty', () => {
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskList
                tasks={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
                filter="all"
                searchTerm="test"
                taskListLoading={false}
            />
        );

        // Проверка наличия сообщения в документе
        expect(screen.getByTestId('no-results-message')).toBeInTheDocument();
        // Проверка правильности текста сообщения
        expect(screen.getByText(/По вашему запросу ничего не найдено/i)).toBeInTheDocument();
    });

    // Если tasks предоставлен должен отображаться список задач 
    test('should render list of tasks when tasks are provided', () => {
        const mockTasks = [ // Моковый список задач
            { id: '1', title: 'Новая задача' }, // Задача 1
            { id: '2', title: 'Новая задача' }, // Задача 2
        ];
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskList
                tasks={mockTasks}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
                filter="all"
                searchTerm=""
                taskListLoading={false}
            />
        );

        // Проверка отображения списка задач в документе
        expect(screen.getByTestId('task-list')).toBeInTheDocument();
        // Поиск всех элементов списка задач
        const taskItems = screen.getAllByTestId('task-item');
        // Проверка количества элементов списка задач
        expect(taskItems).toHaveLength(2);
        // Проверка отображения текста задачи в документе
        expect(screen.getByText('Новая задача')).toBeInTheDocument();
    });
});