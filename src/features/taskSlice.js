import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Асинхронное действие для получения задач пользователя
export const fetchTasks = createAsyncThunk(
    'task/fetchTasks',
    async (userId, { rejectWithValue }) => {
        try {
            const tasksCollectionRef = collection(db, 'tasks');
            const q = query(
                tasksCollectionRef,
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            return new Promise((resolve, reject) => {
                onSnapshot(q, (snapshot) => {
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
                    resolve({ tasks: fetchedTasks });
                }, (error) => {
                    reject(error);
                });
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Асинхронное действие для добавления новой задачи
export const addTask = createAsyncThunk(
    'task/addTask',
    async ({ userId, newTaskData }, { rejectWithValue }) => {
        try {
            const tasksCollectionRef = collection(db, 'tasks');
            await addDoc(tasksCollectionRef, {
                title: newTaskData.title,
                description: newTaskData.description || '',
                completed: false,
                priority: newTaskData.priority || 'medium',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                userId: userId,
            });
            return;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Асинхронное действие для обновления задачи
export const updateTask = createAsyncThunk(
    'task/updateTask',
    async ({ taskId, updatedTaskData }, { rejectWithValue }) => {
        try {
            const taskDoc = doc(db, 'tasks', taskId);
            await updateDoc(taskDoc, {
                title: updatedTaskData.title,
                description: updatedTaskData.description || '',
                completed: updatedTaskData.completed,
                priority: updatedTaskData.priority,
                updatedAt: serverTimestamp(),
            });
            return;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Асинхронное действие для удаления задачи
export const deleteTask = createAsyncThunk(
    'task/deleteTask',
    async (taskId, { rejectWithValue }) => {
        try {
            const taskDoc = doc(db, 'tasks', taskId);
            await deleteDoc(taskDoc);
            return taskId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Асинхронное действие для переключения статуса задачи
export const toggleTaskStatus = createAsyncThunk(
    'task/toggleTaskStatus',
    async (taskId, { rejectWithValue, getState }) => {
        try {
            const taskDoc = doc(db, 'tasks', taskId);
            const { tasks } = getState().task;
            const taskToToggle = tasks.find(task => task.id === taskId);
            const newCompleted = !taskToToggle.completed;

            await updateDoc(taskDoc, {
                completed: newCompleted,
                updatedAt: serverTimestamp(),
            });
            return { taskId, newCompleted };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Начальное состояние слайса задач
const initialState = {
    tasks: [],
    taskListLoading: false,
    error: null,
};

// Слайс для управления состоянием задач
const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        // Очистка списка задач
        clearTasks: (state) => {
            state.tasks = [];
        },
        // Установка списка задач
        setTasks: (state, action) => {
            state.tasks = action.payload;
        },
        // Установка состояния загрузки списка задач
        setTaskListLoading: (state, action) => {
            state.taskListLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Обработка начала загрузки задач
            .addCase(fetchTasks.pending, (state) => {
                state.taskListLoading = true;
                state.error = null;
            })
            // Обработка успешной загрузки задач
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.tasks = action.payload.tasks;
                if (state.unsubscribe) {
                    state.unsubscribe();
                }
                state.unsubscribe = action.payload.unsubscribe;
                state.error = null;
            })
            // Обработка ошибки загрузки задач
            .addCase(fetchTasks.rejected, (state, action) => {
                state.error = action.payload;
                if (state.unsubscribe) {
                    state.unsubscribe();
                }
                state.unsubscribe = null;
            })
            // Обработка успешного добавления задачи
            .addCase(addTask.fulfilled, (state) => {
                state.error = null;
            })
            // Обработка ошибки добавления задачи
            .addCase(addTask.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Обработка успешного обновления задачи
            .addCase(updateTask.fulfilled, (state) => {
                state.error = null;
            })
            // Обработка ошибки обновления задачи
            .addCase(updateTask.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Обработка успешного удаления задачи
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
                state.error = null;
            })
            // Обработка ошибки удаления задачи
            .addCase(deleteTask.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Обработка успешного переключения статуса задачи
            .addCase(toggleTaskStatus.fulfilled, (state, action) => {
                const { taskId, newCompleted } = action.payload;
                const task = state.tasks.find(task => task.id === taskId);
                if (task) {
                    task.completed = newCompleted;
                }
                state.error = null;
            })
            // Обработка ошибки переключения статуса задачи
            .addCase(toggleTaskStatus.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearTasks, setTasks, setTaskListLoading } = taskSlice.actions;
export default taskSlice.reducer;