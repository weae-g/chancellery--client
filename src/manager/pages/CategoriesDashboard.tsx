import React from "react";
import { Table, Spin, Alert, Tag } from "antd";
import { useGetCategoriesQuery } from "../../api/CategoryAPI";
import Title from "antd/es/typography/Title";

interface Category {
  id: number;
  name: string;
  description?: string;
}

const CategoriesDashboard: React.FC = () => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

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
      <Title level={2} style={{ marginBottom: 16 }}>
         Список категорий
      </Title>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        scroll={{ x: true }}
        bordered
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
    </div>
  );
};

export default CategoriesDashboard;
