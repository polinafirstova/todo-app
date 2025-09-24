import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskControls from './TaskControls';

// Мок компонента Search из antd, чтобы изолировать тесты от реального компонента.
jest.mock('antd/es/input/Search', () => ({ placeholder, value, onChange, size }) => (
    <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange({ target: { value: e.target.value } })}
        size={size}
    />
));

// Тесты для компонента TaskControls
describe('TaskControls Component', () => {
    // Поле поиска должно отображаться, при вводе текста вызывается onSearchChange
    test('should render search input and call onSearchChange when typing', async () => {
        const mockOnSearchChange = jest.fn(); // Моковая функция для onSearchChange
        const mockOnFilterChange = jest.fn(); // Моковая функция для onFilterChange
        const mockOnAddTask = jest.fn(); // Моковая функция для onAddTask

        render(
            <TaskControls
                filter="all"
                onFilterChange={mockOnFilterChange}
                searchTerm=""
                onSearchChange={mockOnSearchChange}
                onAddTask={mockOnAddTask}
            />
        );

        // Поиск поля поиска по placeholder
        const searchInput = screen.getByPlaceholderText(/Поиск по задачам/i);
        // Ввод текста в поле поиска
        fireEvent.change(searchInput, { target: { value: 'Новая задача' } });

        // Проверка правильности вызова функции onSearchChange
        expect(mockOnSearchChange).toHaveBeenCalledWith('Новая задача');
    });

    // Кнопка для добавления задачи должна отображаться, при нажатии вызывается onAddTask
    test('should render add button and call onAddTask when clicked', async () => {
        const mockOnSearchChange = jest.f
        const mockOnFilterChange = jest.f
        const mockOnAddTask = jest.f

        render(
            <TaskControls
                filter="all"
                onFilterChange={mockOnFilterChange}
                searchTerm=""
                onSearchChange={mockOnSearchChange}
                onAddTask={mockOnAddTask}
            />
        );

        // Поиск кнопки добавления задачи по тексту
        const addButton = screen.getByRole('button', { name: /Добавить/i });
        await userEvent.click(addButton); // Клик по кнопке добавления

        // Проверка: функция onAddTask должна быть вызвана один раз
        expect(mockOnAddTask).toHaveBeenCalledTimes(1);
    });

    // Фильтры по статусу задачи должны отображаться, при выборе фильтрадолжна вызываться onFilterChange
    test('should render filter options and call onFilterChange when a filter is selected', async () => {
        const mockOnSearchChange = jest.fn();
        const mockOnFilterChange = jest.fn();
        const mockOnAddTask = jest.fn();

        render(
            <TaskControls
                filter="all"
                onFilterChange={mockOnFilterChange}
                searchTerm=""
                onSearchChange={mockOnSearchChange}
                onAddTask={mockOnAddTask}
            />
        );

        // Поиск радиокнопки "Активные" по тексту
        const activeFilterRadio = screen.getByRole('radio', { name: /Активные/i });
        fireEvent.click(activeFilterRadio); // Клик по радиокнопке "Активные"

        // Проверка правильности вызова функции onFilterChange
        expect(mockOnFilterChange).toHaveBeenCalledWith('active');
    });
});