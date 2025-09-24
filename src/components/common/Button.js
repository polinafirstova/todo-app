import { Button as AntdButton } from 'antd';

const buttonStyles = {
    width: '100%',
};

// Обертка над кнопкой Ant Design с предустановленными стилями
export default function Button({ children, ...props }) {
    return (
        <AntdButton
            type='primary'
            className="custom-form-button"
            style={buttonStyles}
            {...props}
        >
            {children}
        </AntdButton>
    );
};