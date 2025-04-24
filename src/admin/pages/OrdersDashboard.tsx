import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Spin,
  Alert,
  Modal,
  Form,
  Select,
  Tag,
  Typography,
  Card,
  List,
  Divider,
  Descriptions,
  Badge,
} from "antd";
import {
  DeleteOutlined,
  SyncOutlined,
  ShoppingOutlined,
  UserOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  WalletOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../api/OrderAPI";

const { Option } = Select;
const { Title, Text } = Typography;

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "confirmed":
        return "blue";
      case "shipped":
        return "purple";
      case "delivered":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <ClockCircleOutlined />;
      case "confirmed":
        return <CheckCircleOutlined />;
      case "shipped":
        return <TruckOutlined />;
      case "delivered":
        return <ShoppingOutlined />;
      default:
        return <QuestionOutlined />;
    }
  };

  return (
    <Badge
      status={getStatusColor(status) as any}
      text={
        <Text>
          {getStatusIcon(status)}{" "}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      }
    />
  );
};

const PriceFormatter: React.FC<{ price: string }> = ({ price }) => {
  const formattedPrice = parseFloat(price).toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  });

  return <Text strong>{formattedPrice}</Text>;
};

const OrderDetails: React.FC<{ order: any }> = ({ order }) => {
  const getPaymentIcon = (payment: string) => {
    switch (payment) {
      case "CARD":
        return <CreditCardOutlined />;
      case "SBP":
        return <WalletOutlined />;
      case "CASH":
        return <WalletOutlined />;
      default:
        return <CreditCardOutlined />;
    }
  };

  const getPaymentText = (payment: string) => {
    switch (payment.toLocaleUpperCase()) {
      case "CARD":
        return "Карта";
      case "SBP":
        return "СБП";
      case "CASH":
        return "Наличные";
      default:
        return payment;
    }
  };

  const getPaymentColor = (payment: string) => {
    switch (payment.toLocaleUpperCase()) {
      case "CARD":
        return "green";
      case "SBP":
        return "blue";
      case "CASH":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Card
      title={<Text strong>Детали заказа #{order.id}</Text>}
      bordered={false}
      style={{ margin: "-16px -16px 0", background: "#fafafa" }}
      headStyle={{ borderBottom: "none" }}>
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Пользователь">
          <Space>
            <UserOutlined />
            <Text>{order.user?.email || "Не указан"}</Text>
            {order.user?.phone && <Text>({order.user.phone})</Text>}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Дата заказа">
          <Space>
            <CalendarOutlined />
            <Text>{new Date(order.createdAt).toLocaleString("ru-RU")}</Text>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Способ оплаты">
          <Space>
            {getPaymentIcon(order.payment)}
            <Tag color={getPaymentColor(order.payment)}>
              {getPaymentText(order.payment)}
            </Tag>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Статус">
          <StatusBadge status={order.status} />
        </Descriptions.Item>
        <Descriptions.Item label="Общая стоимость">
          <PriceFormatter price={order.totalPrice} />
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" style={{ marginTop: 16 }}>
        <ShoppingOutlined /> Состав заказа
      </Divider>

      <List
        dataSource={order.orderItems}
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <PriceFormatter price={item.price} />,
              <Text type="secondary">x{item.quantity}</Text>,
              <PriceFormatter
                price={(parseFloat(item.price) * item.quantity).toString()}
              />,
            ]}>
            <List.Item.Meta
              title={<Text>{item.product.name}</Text>}
              description={`Цена за единицу: ${parseFloat(
                item.product.price
              ).toLocaleString("ru-RU", {
                style: "currency",
                currency: "RUB",
                minimumFractionDigits: 2,
              })}`}
            />
          </List.Item>
        )}
        itemLayout="horizontal"
      />
    </Card>
  );
};

const OrderDashboard: React.FC = () => {
  const { data: orders, isLoading, isError, refetch } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id).unwrap();
      message.success("Заказ успешно удален");
      refetch();
    } catch (error) {
      message.error("Ошибка при удалении заказа");
      console.error(error);
    }
  };

  const handleEditStatus = async (values: { status: string }) => {
    if (!editingOrder) return;
    try {
      await updateOrderStatus({
        orderId: editingOrder.id,
        status: values.status,
      }).unwrap();
      message.success("Статус заказа обновлен");
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      message.error("Ошибка при обновлении статуса");
      console.error(error);
    }
  };

  const handleEdit = (order: any) => {
    setEditingOrder(order);
    form.setFieldsValue({ status: order.status });
    setIsModalOpen(true);
  };

  const toggleExpand = (id: number) => {
    setExpandedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id]
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Общая стоимость",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: string) => <PriceFormatter price={price} />,
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <Space>
          <StatusBadge status={status} />
          <Button
            icon={<SyncOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
        </Space>
      ),
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Space>
          <CalendarOutlined />
          <Text>{new Date(date).toLocaleString("ru-RU")}</Text>
        </Space>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 120,
      render: (_: unknown, record: any) => (
        <Space size="small">
          <Popconfirm
            title="Удалить заказ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}>
        <Title level={2} style={{ marginBottom: 16 }}>
          <ShoppingOutlined /> Управление заказами
        </Title>
        <Button
          type="primary"
          icon={<SyncOutlined />}
          onClick={() => refetch()}>
          Обновить
        </Button>
      </div>

      <Table
        dataSource={orders!}
        columns={columns}
        rowKey="id"
        scroll={{ x: true }}
        bordered
        expandable={{
          expandedRowRender: (record) => <OrderDetails order={record} />,
          expandedRowKeys,
          onExpand: (expanded, record) => toggleExpand(record.id),
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <MinusOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <PlusOutlined onClick={(e) => onExpand(record, e)} />
            ),
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Всего ${total} заказов`,
        }}
      />

      <Modal
        title={
          <Space>
            <SyncOutlined />
            <span>Изменение статуса заказа #{editingOrder?.id || ""}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditStatus}
          initialValues={{ status: editingOrder?.status }}>
          <Form.Item
            name="status"
            label="Статус заказа"
            rules={[{ required: true, message: "Выберите статус" }]}>
            <Select>
              <Option value="pending">
                <Space>
                  <ClockCircleOutlined />
                  Ожидает
                </Space>
              </Option>
              <Option value="confirmed">
                <Space>
                  <CheckCircleOutlined />
                  Подтвержден
                </Space>
              </Option>
              <Option value="shipped">
                <Space>
                  <TruckOutlined />
                  Отправлен
                </Space>
              </Option>
              <Option value="delivered">
                <Space>
                  <ShoppingOutlined />
                  Доставлен
                </Space>
              </Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Обновить статус
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderDashboard;