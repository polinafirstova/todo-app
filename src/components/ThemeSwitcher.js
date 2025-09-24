import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Switch, Tooltip } from 'antd';

// Компонент для переключения темы (светлая/темная)
export default function ThemeSwitcher({ toggleTheme, currentTheme }) {
    return (
        <div className="theme-switcher">
            <Tooltip title="Переключить тему">
                <Switch
                    checkedChildren={<MoonOutlined size={16} />}
                    unCheckedChildren={<SunOutlined size={16} />}
                    checked={currentTheme === 'dark'}
                    onChange={toggleTheme}
                    className="theme-switch"
                    style={{ border: '1px solid white', height: 'auto' }}
                />
            </Tooltip>
        </div>
    );
};