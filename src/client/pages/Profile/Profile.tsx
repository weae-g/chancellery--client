import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useGetUserOrdersQuery } from "../../../api/OrderAPI";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiLogOut,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import { Spin, Card, Tag, Modal, Table, Divider } from "antd";
import styles from "./Profile.module.scss";
import { FaArrowRight } from "react-icons/fa";

const Profile = () => {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const {
    data: orders,
    isLoading,
    isError,
  } = useGetUserOrdersQuery(userId!, {
    skip: userId === null,
  });

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "завершен":
        return "green";
      case "в обработке":
        return "orange";
      case "отменен":
        return "red";
      default:
        return "blue";
    }
  };

  const showOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const columns = [
    {
      title: "Товар",
      dataIndex: ["product", "name"],
      key: "name",
    },
    {
      title: "Категория",
      dataIndex: ["product", "category", "name"],
      key: "category",
    },
    {
      title: "Количество",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      render: (price: string) => `${price} ₽`,
    },
    {
      title: "Сумма",
      key: "total",
      render: (_: any, record: any) =>
        `${(parseFloat(record.price) * record.quantity).toFixed(2)} ₽`,
    },
  ];

  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <Card className={styles.errorCard}>
          <h2>Доступ ограничен</h2>
          <p>Пожалуйста, войдите в свою учетную запись</p>
          <button
            onClick={() => navigate("/auth/login")}
            className={styles.loginButton}>
            Войти
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <div className={styles.userAvatar}>
          <FiUser size={48} />
        </div>
        <h1 className={styles.title}>Личный кабинет</h1>
      </div>

      <div className={styles.profileContent}>
        <Card className={styles.infoCard} title="Контактная информация">
          <div className={styles.infoItem}>
            <FiPhone className={styles.infoIcon} />
            <span className={styles.infoText}>{user.phone}</span>
          </div>
          <div className={styles.infoItem}>
            <FiMail className={styles.infoIcon} />
            <span className={styles.infoText}>{user.email}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FiLogOut className={styles.logoutIcon} />
            Выйти из аккаунта
          </button>
        </Card>

        <div className={styles.ordersSection}>
          <h2 className={styles.ordersTitle}>
            <FiCheckCircle className={styles.titleIcon} />
            История заказов
          </h2>

          {isLoading && (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
            </div>
          )}

          {isError && (
            <Card className={styles.errorCard}>
              <p>Ошибка при загрузке заказов. Попробуйте позже.</p>
            </Card>
          )}

          {orders && orders.length > 0 ? (
            <div className={styles.ordersGrid}>
              {orders.map((order) => (
                <Card key={order.id} className={styles.orderCard} hoverable>
                  <div className={styles.orderHeader}>
                    <h3>Заказ #{order.id}</h3>
                    <Tag color={getStatusColor(order.status)}>
                      {order.status}
                    </Tag>
                  </div>

                  <div className={styles.orderDetails}>
                    <div className={styles.detailItem}>
                      <FiDollarSign className={styles.detailIcon} />
                      <span>{order.totalPrice} ₽</span>
                    </div>
                    <div className={styles.detailItem}>
                      <FiClock className={styles.detailIcon} />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => showOrderDetails(order)}
                    className={styles.detailsButton}>
                    Подробнее
                  </button>
                </Card>
              ))}
            </div>
          ) : (
            !isLoading && (
              <Card className={styles.emptyCard}>
                <p>У вас пока нет заказов</p>
                <button
                  onClick={() => navigate("/catalog")}
                  className={styles.catalogButton}>
                  Перейти в каталог
                  <FaArrowRight className={styles.arrowIcon} />
                </button>
              </Card>
            )
          )}
        </div>
      </div>

      {/* Модальное окно с деталями заказа */}
      <Modal
        title={`Детали заказа #${selectedOrder?.id}`}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
        className={styles.orderModal}>
        {selectedOrder && (
          <div className={styles.modalContent}>
            <div className={styles.orderSummary}>
              <div className={styles.summaryItem}>
                <FiClock className={styles.summaryIcon} />
                <div>
                  <h4>Дата заказа</h4>
                  <p>
                    {new Date(selectedOrder.createdAt).toLocaleString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className={styles.summaryItem}>
                <FiDollarSign className={styles.summaryIcon} />
                <div>
                  <h4>Сумма заказа</h4>
                  <p>{selectedOrder.totalPrice} ₽</p>
                </div>
              </div>

              <div className={styles.summaryItem}>
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Tag>
              </div>
            </div>

            <Divider />

            <h3 className={styles.sectionTitle}>
              <FiShoppingBag className={styles.sectionIcon} />
              Состав заказа
            </h3>

            <Table
              columns={columns}
              dataSource={selectedOrder.orderItems}
              rowKey="id"
              pagination={false}
              className={styles.orderItemsTable}
            />

            <Divider />

            <h3 className={styles.sectionTitle}>
              <FiTruck className={styles.sectionIcon} />
              Доставка и оплата
            </h3>

            <div className={styles.paymentInfo}>
              <p>
                <strong>Способ оплаты:</strong>{" "}
                {selectedOrder.payment === "card"
                  ? "Картой онлайн"
                  : selectedOrder.payment}
              </p>
              <p>
                <strong>Статус оплаты:</strong>{" "}
                {selectedOrder.confirmedAt ? "Оплачено" : "Не оплачено"}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Profile;
