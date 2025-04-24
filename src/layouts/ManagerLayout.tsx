import React from "react";
import { Layout, Menu, Button } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  LogoutOutlined, 
} from "@ant-design/icons";
import styles from "./Admin.module.scss";

const { Header, Sider, Content } = Layout;

const ManagerLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
    window.location.reload();
  };

  const menuItems = [
    {
      key: "products",
      icon: <AppstoreOutlined />,
      label: <Link to="/manager/products">Товары</Link>,
    },
    {
      key: "categories",
      icon: <AppstoreOutlined />,
      label: <Link to="/manager/categories">Категории</Link>,
    },
    {
      key: "suppliers",
      icon: <AppstoreOutlined />,
      label: <Link to="/manager/suppliers">Поставщики</Link>,
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/manager/orders">Заказы</Link>,
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: <Link to="/manager/users">Пользователи</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className={styles.logo}>«ООО СКАУТ»</div>
        <Menu theme="dark" mode="inline" items={menuItems} />
        <div className={styles.logoutContainer}>
          <Button
            type="primary"
            onClick={handleLogout}
            icon={<LogoutOutlined />} 
            className={styles.logoutButton}
          />
        </div>
      </Sider>
      <Layout>
        <Header className={styles.header}></Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
