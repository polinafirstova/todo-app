import { Checkbox, DatePicker, Flex, Form, Input, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import FormItem from '../common/FormItem';

const { Option } = Select;
const { TextArea } = Input;

const initialFormData = { // Начальные значения для формы
    title: '',
    description: '',
    priority: 'medium',
    createdAt: dayjs(),
};

// Форма для создания и редактирования задач
export default function TaskForm({ initialValues, onSubmit, onDelete, onCancel }) {
    // Хук для управления формой Ant Design
    const [form] = Form.useForm();
    // Состояние для отметки задачи как выполненной
    const [completed, setCompleted] = useState(false);
    // Состояние для отображения модального окна подтверждения удаления
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

    // Эффект для инициализации формы при монтировании или изменении initialValues
    useEffect(() => {
        // Если переданы начальные значения, заполнить форму начальными значениями
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                title: initialValues.title,
                description: initialValues.description || '',
                completed: initialValues.completed,
                priority: initialValues.priority,
                createdAt: dayjs(initialValues.createdAt),
            });
            setCompleted(initialValues.completed);
        } else {
            // Если начальные значения не переданы (новая задача), заполнить форму значениями по умолчанию
            form.setFieldsValue(initialFormData);
            if (!form.getFieldValue('createdAt')) {
                form.setFieldsValue({ createdAt: dayjs() }); // Установка текущей даты
            }
            setCompleted(false);
        }
    }, [initialValues, form]);

    // Функция для отправки формы
    const handleSubmit = () => {
        // Валидация полей формы
        form.validateFields()
            .then(values => {
                // Если валидация прошла успешно, создать объект с данными задачи
                const taskData = {
                    title: values.title,
                    description: values.description || '',
                    completed: values.completed,
                    priority: values.priority,
                    createdAt: values.createdAt ? values.createdAt.toISOString() : dayjs().toISOString(),
                };
                onSubmit(taskData);
                // Сброс формы
                form.resetFields();
                setCompleted(false);
            })
            .catch(errorInfo => {
                // Если валидация не прошла, вывод информации об ошибке в консоль
                console.log('Validate Failed:', errorInfo);
            });
    };

    // Функция для отображения модального окна подтверждения удаления
    const showDeleteModal = () => {
        setIsDeleteConfirmVisible(true);
    };

    // Функция для обработки подтверждения удаления
    const handleConfirmDelete = () => {
        if (onDelete && initialValues && initialValues.id) {
            onDelete(initialValues.id);
        }
        setIsDeleteConfirmVisible(false);
        onCancel();
    };

    // Функция для обработки отмены удаления
    const handleCancelDelete = () => {
        setIsDeleteConfirmVisible(false);
    };

    return (
        <>
            <Form form={form} layout="vertical" style={{ textAlign: 'center' }}>
                <FormItem
                    label="Задача"
                    name="title"
                    rules={[{ required: true, message: 'Введите текст задачи!' }]}
                >
                    <Input placeholder="Введите название задачи" />
                </FormItem>
                <FormItem
                    label="Описание"
                    name="description"
                >
                    <TextArea rows={4} placeholder="Введите описание задачи" />
                </FormItem>
                <Flex justify="space-between" gap={16}>
                    <FormItem
                        label="Приоритет"
                        name="priority"
                        rules={[{ required: true }]}
                        style={{ width: '48%' }}
                    >
                        {/* Выпадающий список для выбора приоритета */}
                        <Select placeholder="Выберите приоритет">
                            <Option value="low">Низкий</Option>
                            <Option value="medium">Средний</Option>
                            <Option value="high">Высокий</Option>
                        </Select>
                    </FormItem>
                    {/* Состояние "выполнено" отображается только при редактировании существующей задачи */}
                    {initialValues && (
                        <FormItem
                            label="Выполнено"
                            name="completed"
                            valuePropName="checked"
                            style={{ width: '48%', display: 'flex', alignItems: 'center' }}
                        >
                            <Checkbox onChange={(e) => setCompleted(e.target.checked)}>
                                Отметить как выполненную
                            </Checkbox>
                        </FormItem>
                    )}
                </Flex>
                {/* Скрытое поле для даты создания */}
                <FormItem
                    name="createdAt"
                    hidden={true}
                    initialValue={dayjs()}
                    rules={[{ required: true, message: 'Выберите дату создания!' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder="Выберите дату"
                        format="DD.MM.YYYY"
                    />
                </FormItem>
                <Flex justify={`${initialValues ? 'space-between' : 'center'}`} align="center" gap={16} >
                    {/* Кнопка "Удалить" отображается только при редактировании существующей задачи */}
                    {initialValues && (
                        <Button
                            onClick={showDeleteModal}
                            type="text"
                            danger
                            style={{ flexGrow: 1, textAlign: 'left', paddingLeft: 0, width: '48%' }}
                        >
                            Удалить
                        </Button>
                    )}
                    <Button type="primary" onClick={handleSubmit}
                        style={{ width: '48%' }}
                    >
                        Сохранить
                    </Button>
                </Flex>
            </Form>
            {/* Модальное окно подтверждения удаления */}
            <Modal
                title="Подтверждение удаления"
                open={isDeleteConfirmVisible}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                okText="Удалить"
                cancelText="Отмена"
                okButtonProps={{ danger: true }}
            >
                Вы уверены, что хотите удалить задачу "{initialValues?.text}"?
            </Modal>
        </>
    );
};