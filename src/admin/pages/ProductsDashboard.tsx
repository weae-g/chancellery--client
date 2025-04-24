import React, { useState, useRef, useEffect } from "react";
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
  InputNumber,
  Select,
  Tag,
  Image,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductImageQuery,
} from "../../api/ProductAPI";
import { useGetCategoriesQuery } from "../../api/CategoryAPI";
import { useGetSuppliersQuery } from "../../api/SupplierAPI";
import Title from "antd/es/typography/Title";

const { Option } = Select;

const ProductImage: React.FC<{ productId: number; imageId: number | null }> = ({
  productId,
  imageId,
}) => {
  const { data: imageBlob, isError } = useGetProductImageQuery(productId, {
    skip: !imageId,
  });

  if (!imageId) {
    return (
      <Image
        width={50}
        height={50}
        src="/placeholder.jpg"
        style={{ objectFit: "cover" }}
        preview={false}
      />
    );
  }

  if (isError) {
    return (
      <Image
        width={50}
        height={50}
        src="/placeholder.jpg"
        style={{ objectFit: "cover" }}
        preview={false}
      />
    );
  }

  const imageUrl = imageBlob
    ? URL.createObjectURL(imageBlob)
    : "/placeholder.jpg";

  return (
    <Image
      width={50}
      height={50}
      src={imageUrl}
      style={{ objectFit: "cover" }}
      preview={{ src: imageUrl }}
    />
  );
};

const ProductDashboard: React.FC = () => {
  const { data: products, isLoading, isError, refetch } = useGetProductsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: suppliers } = useGetSuppliersQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const uploadRef = useRef<any>(null);

  useEffect(() => {
    if (editingProduct) {
      // Преобразуем строку цены в число перед установкой в форму
      const initialValues = {
        ...editingProduct,
        price: editingProduct.price ? parseFloat(editingProduct.price) : 0,
        categoryId: editingProduct.category?.id,
        supplierId: editingProduct.supplier?.id,
      };
      form.setFieldsValue(initialValues);
    }
  }, [editingProduct, form]);

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id).unwrap();
      message.success("Товар успешно удален");
      refetch();
    } catch (error) {
      message.error("Ошибка при удалении товара");
      console.error(error);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);

    if (product.imageId) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
        },
      ]);
    } else {
      setFileList([]);
    }

    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFileList([]);
    form.resetFields();
    setIsModalOpen(true);
  };

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Вы можете загрузить только изображение!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Изображение должно быть меньше 5MB!");
    }
    return isImage && isLt5M;
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();

      // Преобразуем числовые значения в строки для FormData
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          const value =
            typeof values[key] === "number"
              ? values[key].toString()
              : values[key];
          formData.append(key, value);
        }
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (editingProduct) {
        await updateProduct({
          id: editingProduct.id,
          formData: formData,
        }).unwrap();
        message.success("Товар успешно обновлен");
      } else {
        await createProduct(formData).unwrap();
        message.success("Товар успешно создан");
      }

      setIsModalOpen(false);
      setFileList([]);
      refetch();
    } catch (error) {
      message.error("Ошибка при сохранении товара");
      console.error(error);
    }
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
      title: "Цена",
      dataIndex: "price",
      key: "price",
      render: (price: string) => `${Number(price)} ₽`,
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
    },
    {
      title: "Категория",
      dataIndex: ["category", "name"],
      key: "category",
      render: (name: string) => <Tag color="green">{name || "Не указана"}</Tag>,
    },
    {
      title: "Поставщик",
      dataIndex: ["supplier", "name"],
      key: "supplier",
      render: (name: string) => <Tag color="orange">{name || "Не указан"}</Tag>,
    },
    {
      title: "Изображение",
      dataIndex: "imageId",
      key: "image",
      width: 120,
      render: (imageId: number | null, record: any) => (
        <ProductImage productId={record.id} imageId={imageId} />
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Удалить товар?"
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
    return <Alert message="Ошибка загрузки товаров" type="error" showIcon />;
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
          Управление товарами
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Добавить товар
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        scroll={{ x: true }}
        bordered
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <Modal
        title={editingProduct ? "Редактировать товар" : "Создать товар"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setFileList([]);
        }}
        onOk={() => form.submit()}
        okText="Сохранить"
        cancelText="Отмена"
        width={800}
        destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Название"
            rules={[
              { required: true, message: "Введите название товара" },
              { max: 100, message: "Максимум 100 символов" },
            ]}>
            <Input placeholder="Введите название товара" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
            rules={[{ max: 500, message: "Максимум 500 символов" }]}>
            <Input.TextArea
              rows={4}
              placeholder="Введите описание товара (необязательно)"
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Цена (₽)"
            rules={[
              { required: true, message: "Введите цену" },
              {
                type: "number",
                min: 0,
                message: "Цена не может быть отрицательной",
              },
            ]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={0.01}
              precision={2}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value: any) => value?.replace(/\$\s?|(,*)/g, "") || ""}
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Количество"
            rules={[
              { required: true, message: "Введите количество" },
              {
                type: "number",
                min: 0,
                message: "Количество не может быть отрицательным",
              },
            ]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Категория"
            rules={[{ required: true, message: "Выберите категорию" }]}>
            <Select placeholder="Выберите категорию">
              {categories?.map((category: any) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="supplierId"
            label="Поставщик"
            rules={[{ required: true, message: "Выберите поставщика" }]}>
            <Select placeholder="Выберите поставщика">
              {suppliers?.map((supplier: any) => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Изображение">
            <Upload
              ref={uploadRef}
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              accept="image/*"
              maxCount={1}>
              {fileList.length >= 1 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Загрузить</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductDashboard;
