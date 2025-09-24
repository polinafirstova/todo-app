import { ClockCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Checkbox, Modal, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import './TaskItem.css';

// Информация о задаче
export default function TaskItem({ task, onEdit, onDelete, onToggleStatus }) {
    // Состояние для отображения модального окна подтверждения удаления
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    // Функция для переключения статуса задачи (выполнена/не выполнена)
    const handleToggle = () => {
        onToggleStatus(task.id);
    };

    // Функция для вызова редактирования задачи
    const handleEdit = () => {
        onEdit(task);
    };

    // Функция для отображения модального окна подтверждения удаления
    const showDeleteConfirm = () => {
        setIsDeleteModalVisible(true);
    };

    // Функция для обработки подтверждения удаления
    const handleOk = () => {
        onDelete(task.id);
        setIsDeleteModalVisible(false);
    };

    // Функция для обработки отмены удаления
    const handleCancel = () => {
        setIsDeleteModalVisible(false);
    };

    // Форматирование даты создания задачи
    const formattedDate = task.createdAt
        ? dayjs(new Date(task.createdAt)).format('DD.MM.YYYY HH:mm')
        : 'Нет даты';

    // Класс для приоритета задачи
    const priorityClass = task.priority ? `priority-${task.priority}` : '';

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`} data-testid="task-item">
            <div className="task-content">
                <Checkbox
                    checked={task.completed}
                    onChange={handleToggle}
                    className="task-checkbox"
                />
                <div className="task-details">
                    <div className="task-text">{task.title}</div>
                    {task.description && <div className="task-description">{task.description}</div>}
                    <div className={`task-meta ${priorityClass}`}>
                        <Tooltip title="Дата создания">
                            <ClockCircleOutlined /> {formattedDate}
                        </Tooltip>
                        <Tag>
                            {task.priority === 'low' ? 'Низкий' :
                                task.priority === 'medium' ? 'Средний' :
                                    task.priority === 'high' ? 'Высокий' : ''}
                        </Tag>
                    </div>
                </div>
            </div>
            <div className="task-actions">
                {/* Кнопка редактирования */}
                <Tooltip title="Редактировать">
                    <Button
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={handleEdit}
                        type="text"
                        className="action-button"
                        data-testid="edit-button"
                    />
                </Tooltip>
                {/* Кнопка удаления */}
                <Tooltip title="Удалить">
                    <Button
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={showDeleteConfirm}
                        type="text"
                        danger
                        className="action-button"
                        data-testid="delete-button"
                    />
                </Tooltip>
                {/* Модальное окно подтверждения удаления */}
                <Modal
                    title="Подтверждение удаления"
                    open={isDeleteModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Удалить"
                    cancelText="Отмена"
                    okButtonProps={{ danger: true }}
                >
                    Вы уверены, что хотите удалить эту задачу?
                </Modal>
            </div>
        </div>
    );
};