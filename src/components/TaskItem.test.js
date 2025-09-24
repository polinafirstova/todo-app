import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from './TaskItem';

// Тесты для компонента TaskItem
describe('TaskItem Component', () => {
    // Правильное отображение заголовка задачи
    test('should render the task title correctly', () => {
        const mockTask = { // Моковый объект задачи
            id: '1',
            title: 'Новая задача',
            description: 'Описание новой задачи',
            createdAt: new Date().toISOString(),
            priority: 'medium',
            completed: false,
        };

        const mockOnEdit = jest.fn(); // Моковая функция для onEdit
        const mockOnDelete = jest.fn(); // Моковая функция для onDelete
        const mockOnToggleStatus = jest.fn(); // Моковая функция для onToggleStatus

        render(
            <TaskItem
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        // Проверка отображения заголовка задачи в документе
        expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    });

    // Описание задачи должно отображаться, если оно предоставлено
    test('should render task description if provided', () => {
        const mockTaskWithDescription = {
            id: '2',
            title: 'Новая задача',
            description: 'Описание новой задачи',
            createdAt: new Date().toISOString(),
            priority: 'low',
            completed: false,
        };
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskItem
                task={mockTaskWithDescription}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        // Проверка отображения описания задачи в документе
        expect(screen.getByText(mockTaskWithDescription.description)).toBeInTheDocument();
    });

    // Описание не должно отображаться, если оно не предоставлено
    test('should not render description if not provided', () => {
        const mockTaskWithoutDescription = {
            id: '3',
            title: 'Новая задача',
            createdAt: new Date().toISOString(),
            priority: 'high',
            completed: false,
        };
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskItem
                task={mockTaskWithoutDescription}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        // Проверка не отображения описания в документе
        expect(screen.queryByText('Описание новой задачи')).not.toBeInTheDocument();
    });

    // При клике на чекбокс должен происходить вызов onToggleStatus
    test('should call onToggleStatus when checkbox is clicked', () => {
        const mockTask = {
            id: '4',
            title: 'Новая задача',
            createdAt: new Date().toISOString(),
            priority: 'low',
            completed: false,
        };
        const mockOnToggleStatus = jest.fn();
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();

        render(
            <TaskItem
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        // Поиск чекбокса по роли
        const checkbox = screen.getByRole('checkbox');

        fireEvent.click(checkbox); // Клик на чекбокс

        // Проверка вызова onToggleStatus один раз
        expect(mockOnToggleStatus).toHaveBeenCalledTimes(1);
        // Проверка правильнояти вызова onToggleStatus
        expect(mockOnToggleStatus).toHaveBeenCalledWith(mockTask.id);
    });

    // Если задача выполнена, элемент должен получить класс "completed"
    test('should apply "completed" class when task is completed', () => {
        const mockCompletedTask = {
            id: '5',
            title: 'Новая задача',
            createdAt: new Date().toISOString(),
            priority: 'medium',
            completed: true,
        };
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskItem
                task={mockCompletedTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        // Поиск элемента задачи по тексту заголовка и классу
        const taskItemElement = screen.getByText(mockCompletedTask.title).closest('.task-item');
        // Проверка, что элемент имеет класс "completed"
        expect(taskItemElement).toHaveClass('completed');
    });

    // Если задача невыполнена, у элемента не должно быть класса "completed"
    test('should not apply "completed" class when task is not completed', () => {
        const mockIncompleteTask = {
            id: '6',
            title: 'Новая задача',
            createdAt: new Date().toISOString(),
            priority: 'low',
            completed: false,
        };
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskItem
                task={mockIncompleteTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        // Поиск элемента задачи по тексту заголовка и классу
        const taskItemElement = screen.getByText(mockIncompleteTask.title).closest('.task-item');
        // Проверка, что элемент не имеет класс "completed"
        expect(taskItemElement).not.toHaveClass('completed');
    });

    // При клике на кнопку редактирования вызов onEdit
    test('should call onEdit with the task object when edit button is clicked', async () => {
        const mockTask = {
            id: '7',
            title: 'Новая задача',
            description: 'Описание новой задачи',
            createdAt: new Date().toISOString(),
            priority: 'high',
            completed: false,
        };
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskItem
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        // Поиск кнопки редактирования по data-testid
        const editButton = screen.getByTestId('edit-button');

        await userEvent.hover(editButton); // Наведение курсора на кнопку редактирования

        await userEvent.click(editButton); // Клик на кнопку редактирования

        // Проверка, что onEdit вызван один раз
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        // Проверка, что onEdit вызван с правильным объектом задачи
        expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    });

    // При нажатии на кнопку удаления должно открываться модальное окно подтверждения удаления
    test('should open delete confirmation modal when delete button is clicked', async () => {
        const mockTask = {
            id: '8',
            title: 'Новая задача',
            createdAt: new Date().toISOString(),
            priority: 'medium',
            completed: false,
        };
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskItem
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        // Поиск кнопки удаления по data-testid
        const deleteButton = screen.getByTestId('delete-button');

        await userEvent.hover(deleteButton); // Наведение курсора на кнопку удаления
        await waitFor(() => screen.getByText(/Удалить/i)); // Ожидание подсказки "Удалить"
        await userEvent.click(deleteButton); // Клик на кнопку удаления

        // Поиск заголовка модального окна
        const modalTitle = screen.getByText('Подтверждение удаления');
        // Проверка, что заголовок отображается в документе
        expect(modalTitle).toBeInTheDocument();
        // Проверка, что кнопка "Отмена" отображается в документе
        expect(screen.getByText('Отмена')).toBeInTheDocument();
    });

    // При клике на кнопку "Отмена" должно закрываться модальное окно и не вызываться onDelete 
    test('should close delete modal and not call onDelete when cancel button is clicked', async () => {
        const mockTask = {
            id: '9',
            title: 'Новая задача',
            createdAt: new Date().toISOString(),
            priority: 'low',
            completed: false,
        };
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskItem
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        const deleteButton = screen.getByTestId('delete-button');
        await userEvent.hover(deleteButton);
        await waitFor(() => screen.getByText(/Удалить/i));
        await userEvent.click(deleteButton);

        const cancelButton = screen.getByRole('button', { name: /Отмена/i });

        await userEvent.click(cancelButton); // Клик на кнопку "Отмена"

        // Проверка, что кнопка "Отмена" больше не отображается
        expect(screen.queryByRole('button', { name: /Отмена/i })).not.toBeInTheDocument();
        // Проверка, что кнопка "Удалить" больше не отображается
        expect(screen.queryByRole('button', { name: /Удалить/i })).not.toBeInTheDocument();
        // Проверка, что функция onDelete не была вызвана
        expect(mockOnDelete).not.toHaveBeenCalled();
    });

    // При нажатии на кнопку удалить должен происходить вызов onDelete с id задачи
    test('should call onDelete with task id when confirm delete button is clicked', async () => {
        const mockTask = {
            id: '10',
            title: 'Новая задача',
            createdAt: new Date().toISOString(),
            priority: 'medium',
            completed: false,
        };
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        render(
            <TaskItem
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        const deleteButton = screen.getByTestId('delete-button');
        await userEvent.hover(deleteButton);
        await waitFor(() => screen.getByText(/Удалить/i));
        await userEvent.click(deleteButton);

        const confirmDeleteButton = screen.getByRole('button', { name: /Удалить/i });

        await userEvent.click(confirmDeleteButton);

        // Проверка, что функция onDelete была вызвана один раз
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        // Проверка, что функция onDelete была вызвана с правильным id задачи
        expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
        // Проверка, что кнопка "Отмена" больше не отображается
        expect(screen.queryByRole('button', { name: /Отмена/i })).not.toBeInTheDocument();
        // Проверка, что кнопка "Удалить" больше не отображается
        expect(screen.queryByRole('button', { name: /Удалить/i })).not.toBeInTheDocument();
    });

    // Элемент task-meta должен получать правильный класс приоритета
    test('should apply correct priority class to task-meta element', () => {
        const mockTaskLowPriority = {
            id: '11',
            title: 'Новая задача',
            createdAt: new Date().toISOString(),
            priority: 'low',
            completed: false,
        };
        const mockTaskMediumPriority = {
            id: '14',
            title: 'Новая задача',
            createdAt: new Date().toISOString(),
            priority: 'medium',
            completed: false,
        };
        const mockTaskHighPriority = {
            id: '15',
            title: 'Новая задача',
            createdAt: new Date().toISOString(),
            priority: 'high',
            completed: false,
        };
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const mockOnToggleStatus = jest.fn();

        const { container: containerLow } = render(
            <TaskItem
                task={mockTaskLowPriority}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );
        const taskMetaLow = containerLow.querySelector('.task-meta'); // Поиск элемент task-meta
        // Проверка, что элемент имеет класс "priority-low"
        expect(taskMetaLow).toHaveClass('priority-low');

        const { container: containerMedium } = render(
            <TaskItem
                task={mockTaskMediumPriority}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );
        const taskMetaMedium = containerMedium.querySelector('.task-meta');
        // Проверка, что элемент имеет класс "priority-medium"
        expect(taskMetaMedium).toHaveClass('priority-medium');

        const { container: containerHigh } = render(
            <TaskItem
                task={mockTaskHighPriority}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );
        const taskMetaHigh = containerHigh.querySelector('.task-meta');
        // Проверка, что элемент имеет класс "priority-high"
        expect(taskMetaHigh).toHaveClass('priority-high');
    });
});