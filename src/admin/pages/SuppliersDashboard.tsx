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
  Input,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
} from "../../api/SupplierAPI";
import Title from "antd/es/typography/Title";

interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
}

const SuppliersDashboard: React.FC = () => {
  const {
    data: suppliers,
    isLoading,
    isError,
    refetch,
  } = useGetSuppliersQuery();
  const [createSupplier] = useCreateSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form] = Form.useForm();

  const handleDelete = async (id: number) => {
    try {
      await deleteSupplier(id).unwrap();
      message.success("Поставщик успешно удален");
      refetch();
    } catch (error) {
      message.error("Ошибка при удалении поставщика");
      console.error(error);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    form.setFieldsValue(supplier);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingSupplier(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: Omit<Supplier, "id">) => {
    try {
      if (editingSupplier) {
        await updateSupplier({ id: editingSupplier.id, ...values }).unwrap();
        message.success("Поставщик успешно обновлен");
      } else {
        await createSupplier(values).unwrap();
        message.success("Поставщик успешно создан");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      message.error("Ошибка при сохранении поставщика");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a: Supplier, b: Supplier) => a.id - b.id,
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Действия",
      key: "actions",
      width: 120,
      render: (_: unknown, record: Supplier) => (
        <Space size="small">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Удалить поставщика?"
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
          Управление поставщиками
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Добавить поставщика
        </Button>
      </div>

      <Table
        dataSource={suppliers}
        columns={columns}
        rowKey="id"
        scroll={{ x: true }}
        bordered
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <Modal
        title={
          editingSupplier ? "Редактировать поставщика" : "Создать поставщика"
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Сохранить"
        cancelText="Отмена"
        destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Название компании"
            rules={[
              { required: true, message: "Введите название компании" },
              { max: 100, message: "Максимум 100 символов" },
            ]}>
            <Input placeholder="Введите название компании" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Юридический адрес"
            rules={[
              { required: true, message: "Введите юридический адрес" },
              { max: 200, message: "Максимум 200 символов" },
            ]}>
            <Input placeholder="Введите полный адрес" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Контактный телефон"
            rules={[
              { required: true, message: "Введите контактный телефон" },
              {
                pattern: /^\+?[\d\s\-()]{10,15}$/,
                message: "Введите корректный номер телефона",
              },
            ]}>
            <Input placeholder="+7 (XXX) XXX-XX-XX" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuppliersDashboard;
