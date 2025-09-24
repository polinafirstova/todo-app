import { Card, Form } from 'antd';
import Title from 'antd/es/typography/Title';

// Карточка с формой для логина
export default function LoginForm({ children, ...props }) {
    return (
        <Card title={
            <Title level={2}
                style={{
                    textAlign: 'center',
                    marginBottom: 0
                }}>
                {props.title}
            </Title>}
            style={{
                width: 360,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Тень для Card
                margin: 'auto',
            }}>
            <Form
                className="custom-form"
                layout="vertical" // Вертикальное расположение элементов
                {...props}>
                {children}
            </Form>
        </Card>
    );
};