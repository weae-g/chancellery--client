import React, { useState, useEffect } from "react";
import {
  Table,
  Spin,
  Alert,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Space,
  Tag,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../api/UserAPI";
import { useRegisterMutation } from "../../api/AuthAPI";
import { useGetUserOrdersQuery } from "../../api/OrderAPI";
import Title from "antd/es/typography/Title";

const { Option } = Select;

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
  const { data: users, isLoading, isError, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [registerUser] = useRegisterMutation();
  const [updateUser] = useUpdateUserMutation();
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOrdersModalVisible, setIsOrdersModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
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
      width: 150,
      render: (_: unknown, record: User) => (
        <Space size="small">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedUserId(record.id);
              setIsOrdersModalVisible(true);
            }}
          />
          <Popconfirm
            title="Удалить пользователя?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
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

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId).unwrap();
      message.success("Пользователь успешно удален");
      refetch();
    } catch (err) {
      message.error("Ошибка при удалении пользователя");
      console.error(err);
    }
  };

  const handleAddUser = () => {
    form.resetFields();
    setIsEditMode(false);
    setEditingUser(null);
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditMode(true);
    form.setFieldsValue({
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: {
    email: string;
    phone: string;
    password?: string;
    role: string;
  }) => {
    try {
      if (isEditMode && editingUser) {
        await updateUser({
          id: editingUser.id,
          data: {
            email: values.email,
            phone: values.phone,
            role: values.role,
          },
        }).unwrap();
        message.success("Пользователь успешно обновлен");
      } else {
        if (!values.password) {
          message.error("Пароль обязателен для нового пользователя");
          return;
        }
        await registerUser({
          email: values.email,
          passwordHash: values.password,
          passwordRepeat: values.password,
          role: values.role,
          phone: values.phone,
        }).unwrap();
        message.success("Пользователь успешно добавлен");
      }
      setIsModalVisible(false);
      refetch();
    } catch (err) {
      message.error(
        `Ошибка при ${isEditMode ? "обновлении" : "добавлении"} пользователя`
      );
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isModalVisible) {
      form.resetFields();
      setEditingUser(null);
      setIsEditMode(false);
    }
  }, [isModalVisible, form]);

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
          Управление пользователями
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
          Добавить пользователя
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        scroll={{ x: true }}
        bordered
      />

      <Modal
        title={
          isEditMode ? "Редактировать пользователя" : "Добавить пользователя"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText="Сохранить"
        cancelText="Отмена"
        footer={null}
        destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Введите email" },
              { type: "email", message: "Неверный формат email" },
            ]}>
            <Input placeholder="example@mail.com" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Телефон"
            rules={[
              { required: true, message: "Введите телефон" },
              {
                pattern: /^\+?[\d\s\-()]{10,15}$/,
                message: "Неверный формат телефона",
              },
            ]}>
            <Input placeholder="+7 (999) 123-45-67" />
          </Form.Item>

          {!isEditMode && (
            <Form.Item
              name="password"
              label="Пароль"
              rules={[
                { required: true, message: "Введите пароль" },
                { min: 6, message: "Минимум 6 символов" },
              ]}>
              <Input.Password placeholder="Не менее 6 символов" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Роль"
            rules={[{ required: true, message: "Выберите роль" }]}>
            <Select placeholder="Выберите роль">
              <Option value="USER">Пользователь</Option>
              <Option value="ADMIN">Администратор</Option>
              <Option value="MANAGER">Менеджер</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isEditMode ? "Обновить" : "Добавить"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

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
