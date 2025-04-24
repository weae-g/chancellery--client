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
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../api/CategoryAPI";
import Title from "antd/es/typography/Title";

interface Category {
  id: number;
  name: string;
  description?: string;
}

const CategoriesDashboard: React.FC = () => {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      message.success("Категория успешно удалена");
      refetch();
    } catch (error) {
      message.error("Ошибка при удалении категории");
      console.error(error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, ...values }).unwrap();
        message.success("Категория успешно обновлена");
      } else {
        await createCategory(values).unwrap();
        message.success("Категория успешно создана");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      message.error("Ошибка при сохранении категории");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a: Category, b: Category) => a.id - b.id,
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Действия",
      key: "actions",
      width: 120,
      render: (_: any, record: Category) => (
        <Space size="small">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Удалить категорию?"
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
    return <Alert message="Ошибка загрузки категорий" type="error" showIcon />;
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
          Управление категориями
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Добавить категорию
        </Button>
      </div>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        scroll={{ x: true }}
        bordered
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <Modal
        title={
          editingCategory ? "Редактировать категорию" : "Создать категорию"
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
            label="Название"
            rules={[
              { required: true, message: "Введите название категории" },
              { max: 50, message: "Максимум 50 символов" },
            ]}>
            <Input placeholder="Введите название категории" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Описание"
            rules={[{ max: 200, message: "Максимум 200 символов" }]}>
            <Input.TextArea
              rows={4}
              placeholder="Введите описание категории (необязательно)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesDashboard;
