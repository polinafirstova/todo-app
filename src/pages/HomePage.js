import { notification, Typography } from 'antd';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskControls from '../components/TaskControls';
import TaskList from '../components/TaskList';
import TaskModalForm from '../components/TaskModalForm';
import { db } from '../config/firebase';
import {
    addTask as addTaskAction,
    clearTasks,
    deleteTask as deleteTaskAction,
    setTasks,
    toggleTaskStatus as toggleTaskStatusAction,
    updateTask as updateTaskAction
} from '../features/taskSlice';

const { Title } = Typography;
const { useNotification } = notification;

// Главная страница
export default function HomePage() {
    // Хук useNotification для отображения уведомлений
    const [api, contextHolder] = useNotification();

    // Локальное состояние компонента
    const [filter, setFilter] = useState('all'); // Фильтр задач
    const [searchTerm, setSearchTerm] = useState(''); // Поисковый запрос
    const [isModalVisible, setIsModalVisible] = useState(false); // Видимость модального окна
    const [editingTask, setEditingTask] = useState(null); // Редактируемая задача

    // Хуки Redux
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth); // Данные пользователя
    const { tasks, error } = useSelector(state => state.task); // Список задач и ошибки
    const [taskListLoading, setTaskListLoadingHomePage] = useState(false); // Состояние загрузки списка задач

    // Ссылка на коллекцию задач в Firestore
    const tasksCollectionRef = useMemo(() => {
        return user ? collection(db, 'tasks') : null;
    }, [user]);

    // Эффект для подписки на обновления задач в Firestore
    useEffect(() => {
        let unsubscribe;

        if (user && tasksCollectionRef) {
            setTaskListLoadingHomePage(true);

            // Запрос к Firestore
            const q = query(
                tasksCollectionRef,
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );

            // Подписка на обновления задач
            unsubscribe = onSnapshot(q, (snapshot) => {
                try {
                    // Обработка полученные данные
                    const fetchedTasks = snapshot.docs.map(doc => {
                        const data = doc.data();
                        let createdAt = null;
                        if (data.createdAt) {
                            let dateObj = null;
                            if (data.createdAt.seconds !== undefined && data.createdAt.nanoseconds !== undefined) {
                                dateObj = new Date(data.createdAt.seconds * 1000 + data.createdAt.nanoseconds / 1000000);
                            } else if (data.createdAt instanceof Date) {
                                dateObj = data.createdAt;
                            } else if (typeof data.createdAt === 'string') {
                                dateObj = new Date(data.createdAt);
                            }
                            if (dateObj && !isNaN(dateObj.getTime())) {
                                createdAt = dateObj.toISOString();
                            } else {
                                createdAt = data.createdAt;
                            }
                        }

                        let updatedAt = null;
                        if (data.updatedAt) {
                            let dateObj = null;
                            if (data.updatedAt.seconds !== undefined && data.updatedAt.nanoseconds !== undefined) {
                                dateObj = new Date(data.updatedAt.seconds * 1000 + data.updatedAt.nanoseconds / 1000000);
                            } else if (data.updatedAt instanceof Date) {
                                dateObj = data.updatedAt;
                            } else if (typeof data.updatedAt === 'string') {
                                dateObj = new Date(data.updatedAt);
                            }
                            if (dateObj && !isNaN(dateObj.getTime())) {
                                updatedAt = dateObj.toISOString();
                            } else {
                                updatedAt = data.updatedAt;
                            }
                        }

                        return {
                            id: doc.id,
                            ...data,
                            createdAt: createdAt,
                            updatedAt: updatedAt,
                        };
                    });
                    dispatch(setTasks(fetchedTasks));
                } catch (innerError) {
                    console.error("Error processing snapshot:", innerError);
                } finally {
                    setTaskListLoadingHomePage(false);
                }
            }, (error) => {
                console.error("Ошибка при подписке на обновления задач:", error);
                api.error({
                    message: 'Ошибка при загрузке задач',
                    description: error.message,
                    placement: 'topRight',
                });
                setTaskListLoadingHomePage(false);
            });
        } else {
            dispatch(clearTasks());
            setTaskListLoadingHomePage(false);
        }

        // Очистка подписки при размонтировании компонента
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user, tasksCollectionRef, dispatch, api]);

    // Функция для добавления новой задачи
    const handleAddTask = useCallback(async (newTaskData) => {
        if (!user) {
            api.error({ message: 'Вы не залогинены!', placement: 'topRight' });
            return;
        }
        try {
            await dispatch(addTaskAction({ userId: user.uid, newTaskData }));
            api.success({
                message: 'Задача успешно добавлена',
                description: `Задача "${newTaskData.title.substring(0, 30)}..." успешно добавлена.`,
                placement: 'topRight',
            });
        } catch (error) {
            console.error("Ошибка при добавлении задачи:", error);
            api.error({
                message: 'Ошибка при добавлении задачи',
                description: error.message,
                placement: 'topRight',
            });
        }
    }, [dispatch, user, api]);

    // Функция для обновления задачи
    const handleUpdateTask = useCallback(async (taskId, updatedTaskData) => {
        try {
            await dispatch(updateTaskAction({ taskId, updatedTaskData }));
            api.success({
                message: 'Задача успешно обновлена',
                description: `Задача "${updatedTaskData.title.substring(0, 30)}..." обновлена.`,
                placement: 'topRight',
            });
        } catch (error) {
            console.error("Ошибка при обновлении задачи:", error);
            api.error({
                message: 'Ошибка при обновлении задачи',
                description: error.message,
                placement: 'topRight',
            });
        }
    }, [dispatch, api]);

    // Функция для удаления задачи
    const handleDeleteTask = useCallback(async (taskId) => {
        try {
            await dispatch(deleteTaskAction(taskId));
            api.success({
                message: 'Задача успешно удалена',
                description: `Задача удалена.`,
                placement: 'topRight',
            });
        } catch (error) {
            console.error("Ошибка при удалении задачи:", error);
            api.error({
                message: 'Ошибка при удалении задачи',
                description: error.message,
                placement: 'topRight',
            });
        }
    }, [dispatch, api]);

    // Функция для переключения статуса задачи
    const handleToggleTaskStatus = useCallback(async (taskId) => {
        try {
            await dispatch(toggleTaskStatusAction(taskId));
        } catch (error) {
            console.error("Ошибка при изменении статуса задачи:", error);
            api.error({
                message: 'Ошибка при изменении статуса задачи',
                description: error.message,
                placement: 'topRight',
            });
        }
    }, [dispatch, api]);

    // Функция для открытия модального окна добавления задачи
    const handleOpenAddTaskModal = () => {
        setEditingTask(null);
        setIsModalVisible(true);
    };

    // Функция для открытия модального окна редактирования задачи
    const handleOpenEditTaskModal = (task) => {
        setEditingTask(task);
        setIsModalVisible(true);
    };

    // Функция для закрытия модального окна
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingTask(null);
    };

    // Функция для сохранения задачи (добавление или обновление)
    const handleSaveTask = async (taskData) => {
        handleCloseModal();
        if (editingTask) {
            await handleUpdateTask(editingTask.id, taskData);
        } else {
            await handleAddTask(taskData);
        }
    };

    // Функция для фильтрации задач
    const filteredTasks = () => {
        let filtered = tasks.filter(task => {
            const matchesSearch = task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase());
            let matchesFilter = filter === 'all';
            if (filter === 'active') {
                matchesFilter = !task.completed;
            } else if (filter === 'completed') {
                matchesFilter = task.completed;
            }
            return matchesFilter && matchesSearch;
        });

        // Сортировка задач: сначала активные, затем завершенные
        filtered.sort((a, b) => {
            if (a.completed && !b.completed) {
                return 1;
            }
            if (!a.completed && b.completed) {
                return -1;
            }
            return 0;
        });

        return filtered;
    };

    return (
        <>
            {contextHolder}
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Список задач</Title>
            <TaskControls
                filter={filter}
                onFilterChange={setFilter}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddTask={handleOpenAddTaskModal}
            />
            <TaskList
                tasks={filteredTasks()}
                onEdit={handleOpenEditTaskModal}
                onDelete={handleDeleteTask}
                onToggleStatus={handleToggleTaskStatus}
                filter={filter}
                searchTerm={searchTerm}
                taskListLoading={taskListLoading}
            />
            <TaskModalForm
                visible={isModalVisible}
                onClose={handleCloseModal}
                onSave={handleSaveTask}
                initialData={editingTask}
                onDelete={handleDeleteTask}
            />
        </>
    );
}