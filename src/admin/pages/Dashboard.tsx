import React from "react";
import { Card, Col, Row, Statistic, Spin, Alert, List, Typography, Tag } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  DollarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useGetDashboardStatsQuery } from "../../api/DashboardAPI";

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "auto", marginTop: 50 }}
      />
    );
  }

  if (isError) {
    return <Alert message="Ошибка загрузки данных" type="error" showIcon />;
  }

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>Панель управления</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} hoverable>
            <Statistic
              title={<Text strong>Пользователи</Text>}
              value={data?.usersCount || 0}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} hoverable>
            <Statistic
              title={<Text strong>Заказы</Text>}
              value={data?.ordersCount || 0}
              prefix={<ShoppingCartOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} hoverable>
            <Statistic
              title={<Text strong>Товары</Text>}
              value={data?.productsCount || 0}
              prefix={<AppstoreOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ fontSize: 24 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={12}>
          <Card bordered={false} hoverable>
            <Statistic
              title={<Text strong>Общий доход</Text>}
              value={data?.totalRevenue ? formatCurrency(data.totalRevenue) : '0 ₽'}
              prefix={<DollarOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ fontSize: 22, color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Card bordered={false} hoverable>
            <Statistic
              title={<Text strong>Уведомления</Text>}
              value={data?.notificationsCount || 0}
              prefix={<BellOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ fontSize: 22 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card 
            title={<Text strong>Последние заказы</Text>}
            bordered={false}
            hoverable
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={data?.recentOrders || []}
              renderItem={(order: any) => (
                <List.Item
                  style={{ padding: '12px 0' }}
                  actions={[
                    <Text strong>{formatCurrency(order.totalPrice)}</Text>
                  ]}
                >
                  <List.Item.Meta
                    title={<Text strong>Заказ #{order.id}</Text>}
                    description={
                      <>
                        <Tag color={getStatusColor(order.status)}>
                          {order.status}
                        </Tag>
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                          {new Date(order.createdAt).toLocaleString()}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card 
            title={<Text strong>Новые товары</Text>}
            bordered={false}
            hoverable
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={data?.recentProducts || []}
              renderItem={(product: any) => (
                <List.Item
                  style={{ padding: '12px 0' }}
                  actions={[
                    <Text strong>{formatCurrency(product.price)}</Text>
                  ]}
                >
                  <List.Item.Meta
                    title={<Text strong>{product.name}</Text>}
                    description={
                      <>
                        <Text ellipsis style={{ maxWidth: '70%' }}>
                          {product.description}
                        </Text>
                        <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                          {new Date(product.createdAt).toLocaleDateString()}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;