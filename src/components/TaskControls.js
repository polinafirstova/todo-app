import { PlusOutlined } from '@ant-design/icons';
import { Flex, Radio } from 'antd';
import Search from 'antd/es/input/Search';
import './TaskControls.css';
import Button from './common/Button';

// Фильтры для задач
const FilterOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Активные', value: 'active' },
    { label: 'Выполненные', value: 'completed' },
];

// Панель управления задачами (поиск, фильтр, добавление).
export default function TaskControls({ filter, onFilterChange, searchTerm, onSearchChange, onAddTask }) {
    return (
        <div className="task-controls">
            {/* Строка поиска */}
            <div className="search-container">
                <Search
                    placeholder="Поиск по задачам"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    size="large"
                />
            </div>
            <Flex className="controls-row" gap={16} align="center" wrap="wrap">
                {/* Кнопка добавления задачи */}
                <div className="add-button-container">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onAddTask}
                        size="large"
                        block
                    >
                        Добавить
                    </Button>
                </div>
                {/* Фильтры задач */}
                <Flex className="filter-container">
                    <Radio.Group
                        options={FilterOptions}
                        value={filter}
                        onChange={(e) => onFilterChange(e.target.value)}
                        optionType="button"
                        buttonStyle="solid"
                        size="large"
                    />
                </Flex>
            </Flex>
        </div>
    );
};