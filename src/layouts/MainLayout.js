import { Col, Layout, Row } from 'antd';
import AppHeader from './AppHeader';
import './MainLayout.css';

// Основной макет приложения
const { Content } = Layout;

export default function MainLayout({ children, toggleTheme, currentTheme }) {
    return (
        <Layout className="main-layout">
            {/* Шапка приложения */}
            <AppHeader toggleTheme={toggleTheme} currentTheme={currentTheme} />
            <Content className="main-content">
                <Row justify="center" align="middle" className="content-row">
                    <Col xs={24} sm={22} md={20} lg={18} xl={16} className="content-col">
                        {/* Дочерние элементы */}
                        {children}
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}