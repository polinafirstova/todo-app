import { Input as AntdInput } from 'antd';

const inputStyles = {
    borderRadius: '4px',
};

// Обертка над Input из Ant Design с возможностью отображения поля для пароля
export default function Input(props) {
    const { password, ...restProps } = props;

    return (password
        ? <AntdInput.Password className="custom-input" style={inputStyles} {...restProps} />
        : <AntdInput className="custom-input" style={inputStyles} {...restProps} />
    );
};