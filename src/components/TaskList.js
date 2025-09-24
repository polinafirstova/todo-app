import { Spin } from 'antd';
import TaskItem from './TaskItem';
import './TaskList.css';

// Список задач
export default function TaskList({ tasks, onEdit, onDelete, onToggleStatus, filter, searchTerm, taskListLoading }) {
    if (taskListLoading) {
        // Если идет загрузка списка задач, отображать спиннер
        return (
            <div className="empty-task-list" data-testid="loading-spinner">
                <Spin size="large" role="alert" aria-label="Загрузка" />
            </div>
        );
    }

    let message = ""; // Сообщение для отображения в пустом списке

    if (searchTerm && tasks.length === 0) {
        // Если есть поисковой запрос и нет результатов, отобразить сообщение
        message = "По вашему запросу ничего не найдено.";
        return <div className="empty-task-list" data-testid="no-results-message">{message}</div>;
    }

    if (tasks.length === 0) {
        // Если список задач пуст
        switch (filter) {
            // Определение сообщения в зависимости от фильтра
            case 'all':
                message = "Список задач пуст.";
                break;
            case 'active':
                message = "Нет активных задач.";
                break;
            case 'completed':
                message = "Нет завершенных задач.";
                break;
            default:
                message = "Список задач пуст.";
                break;
        }
        // Отображение сообщение о пустом списке
        return <div className="empty-task-list" data-testid="empty-message">{message}</div>;
    }

    return (
        <div className="task-list" data-testid="task-list">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                />
            ))}
        </div>
    );
}