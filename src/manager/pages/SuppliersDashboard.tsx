import React from "react";
import {
  Table,
  Spin,
  Alert,
  Tag,
} from "antd";
import { useGetSuppliersQuery } from "../../api/SupplierAPI";
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
  } = useGetSuppliersQuery();

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
         Список поставщиков
      </Title>


      <Table
        dataSource={suppliers}
        columns={columns}
        rowKey="id"
        scroll={{ x: true }}
        bordered
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
    </div>
  );
};

export default SuppliersDashboard;