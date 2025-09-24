import { Form as AntdForm } from 'antd';

const formItemStyles = {
    marginBottom: '16px',
};

// Обертка над Form.Item из Ant Design с предустановленными стилями
export default function FormItem({ children, ...props }) {
    return (
        <AntdForm.Item className="custom-form-item" style={formItemStyles} {...props}>
            {children}
        </AntdForm.Item>
    );
};