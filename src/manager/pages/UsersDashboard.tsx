import React, { useState } from "react";
import {
  Table,
  Spin,
  Alert,
  Modal,
  Tag,
  Button,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useGetUsersQuery } from "../../api/UserAPI";
import { useGetUserOrdersQuery } from "../../api/OrderAPI";
import Title from "antd/es/typography/Title";


interface User {
  id: number;
  email: string;
  phone: string;
  role: string;
}

interface Order {
  id: number;
  totalPrice: string | number;
  status: string;
  createdAt: string;
  payment: string;
  orderItems: OrderItem[];
}

interface OrderItem {
  id: number;
  product: {
    name: string;
  };
  quantity: number;
  price: string;
}

const UsersDashboard: React.FC = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [isOrdersModalVisible, setIsOrdersModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { data: userOrders, isLoading: isOrdersLoading } =
    useGetUserOrdersQuery(selectedUserId as number, { skip: !selectedUserId });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? dateString
        : date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "green";
      case "pending":
        return "orange";
      case "cancelled":
        return "red";
      default:
        return "blue";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag
          color={
            role === "ADMIN" ? "red" : role === "MANAGER" ? "green" : "blue"
          }>
          {role === "ADMIN"
            ? "Админ"
            : role === "MANAGER"
            ? "Менеджер"
            : "Пользователь"}
        </Tag>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 80,
      render: (_: unknown, record: User) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedUserId(record.id);
            setIsOrdersModalVisible(true);
          }}
        />
      ),
    },
  ];

  const orderColumns = [
    {
      title: "ID заказа",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Сумма",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: string | number) => {
        const formattedPrice = Number(price).toFixed(2);
        return `${formattedPrice} ₽`;
      },
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </Tag>
      ),
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
      render: formatDate,
    },
    {
      title: "Оплата",
      dataIndex: "payment",
      key: "payment",
      render: (payment: string) => (
        <Tag color={payment === "CARD" ? "green" : "blue"}>
          {payment === "CARD" ? "Карта" : "Наличные"}
        </Tag>
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
      <Title level={2} style={{ marginBottom: 16 }}>
         Просмотр пользователей
      </Title>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        scroll={{ x: true }}
        bordered
      />

      <Modal
        title={`Заказы пользователя #${selectedUserId}`}
        open={isOrdersModalVisible}
        onCancel={() => setIsOrdersModalVisible(false)}
        footer={null}
        width={1000}
        destroyOnClose>
        {isOrdersLoading ? (
          <Spin />
        ) : (
          <Table<Order>
            columns={orderColumns}
            dataSource={userOrders}
            rowKey="id"
            scroll={{ x: true }}
            bordered
            expandable={{
              expandedRowRender: (record) => (
                <div>
                  <h4 style={{ marginBottom: 12 }}>Состав заказа:</h4>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {record.orderItems.map((item) => (
                      <li key={item.id} style={{ marginBottom: 8 }}>
                        {item.product.name} - {item.quantity} шт. × {item.price}{" "}
                        ₽
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default UsersDashboard;