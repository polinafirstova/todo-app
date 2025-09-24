import { Modal } from 'antd';
import TaskForm from './forms/TaskForm';

// Модальное окно для создания и редактирования задач
export default function TaskModalForm({ visible, onClose, onSave, initialData, onDelete }) {

    // Функция для обработки сохранения задачи
    const handleSave = (taskData) => {
        onSave(taskData);
    };

    return (
        <Modal
            title={initialData ? "Редактировать задачу" : "Добавить новую задачу"}
            open={visible}
            onCancel={onClose}
            destroyOnHidden
            width={520}
            footer={null}
            style={{ textAlign: 'center' }}
        >
            {/* Форма для создания/редактирования задач */}
            <TaskForm
                initialValues={initialData}
                onSubmit={handleSave}
                onCancel={onClose}
                onDelete={onDelete}
            />
        </Modal>
    );
};