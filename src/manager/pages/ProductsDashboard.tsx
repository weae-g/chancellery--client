import React from "react";
import { Table, Spin, Alert, Tag, Image } from "antd";
import {
  useGetProductsQuery,
  useGetProductImageQuery,
} from "../../api/ProductAPI";
import Title from "antd/es/typography/Title";

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
  const { data: products, isLoading, isError } = useGetProductsQuery();

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
      <Title level={2} style={{ marginBottom: 16 }}>
        Список товаров
      </Title>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        scroll={{ x: true }}
        bordered
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
    </div>
  );
};

export default ProductDashboard;
