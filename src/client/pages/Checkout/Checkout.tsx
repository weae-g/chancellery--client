import { Spin, Alert, Radio, Card, Button, Divider, notification, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Checkout.module.scss";
import { RootState } from "../../../store";
import { useCreateOrderMutation } from "../../../api/OrderAPI";
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | {};
}

const MAX_QUANTITY = 50; // Максимальное количество одного товара

const paymentMethods = [
  {
    value: "card",
    label: "Картой онлайн",
    icon: <CreditCardOutlined />,
    description: "Оплата банковской картой Visa, Mastercard, Мир",
  },
  {
    value: "sbp",
    label: "СБП",
    icon: <BankOutlined />,
    description: "Оплата через Систему Быстрых Платежей",
  },
  {
    value: "cash",
    label: "Наличные",
    icon: <WalletOutlined />,
    description: "Оплата наличными при получении",
  },
];

const Checkout: React.FC = () => {
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [createOrder, { isLoading, isError }] = useCreateOrderMutation();
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const [showMaxQuantityNotification, setShowMaxQuantityNotification] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  useEffect(() => {
    if (showSuccessNotification) {
      notificationApi.success({
        message: (
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            <CheckCircleOutlined
              style={{ color: "#52c41a", marginRight: "8px" }}
            />
            Заказ успешно оформлен!
          </span>
        ),
        description: (
          <div style={{ marginTop: "8px" }}>
            <p>Спасибо за ваш заказ!</p>
            <p>Мы свяжемся с вами в ближайшее время для подтверждения.</p>
          </div>
        ),
        placement: "topRight",
        duration: 8,
        style: {
          width: "350px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      });
      setShowSuccessNotification(false);
    }
  }, [showSuccessNotification]);

  useEffect(() => {
    if (showErrorNotification) {
      notificationApi.error({
        message: "Ошибка оформления заказа",
        description: "Пожалуйста, попробуйте еще раз",
        placement: "topRight",
      });
      setShowErrorNotification(false);
    }
  }, [showErrorNotification]);

  useEffect(() => {
    if (showWarningNotification) {
      notificationApi.warning({
        message: "Требуется авторизация",
        description: "Войдите в аккаунт для оформления заказа",
        placement: "topRight",
      });
      setShowWarningNotification(false);
    }
  }, [showWarningNotification]);

  useEffect(() => {
    if (showMaxQuantityNotification) {
      notificationApi.warning({
        message: "Максимальное количество",
        description: `Вы можете заказать не более ${MAX_QUANTITY} единиц одного товара`,
        placement: "topRight",
        duration: 3,
      });
      setShowMaxQuantityNotification(false);
    }
  }, [showMaxQuantityNotification]);

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity > MAX_QUANTITY) {
      setShowMaxQuantityNotification(true);
      quantity = MAX_QUANTITY;
    }

    const updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, Math.min(quantity, MAX_QUANTITY)) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrderSubmit = async () => {
    if (!userId) {
      setShowWarningNotification(true);
      return;
    }

    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const orderData = {
      orderItems: orderItems,
      totalPrice: totalPrice,
      payment: paymentMethod,
      status: "pending",
      userId: userId,
    };

    try {
      await createOrder(orderData).unwrap();
      setShowSuccessNotification(true);
      localStorage.removeItem("cart");
      setCart([]);
    } catch (error) {
      setShowErrorNotification(true);
      console.error("Ошибка при оформлении заказа:", error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.checkoutPage}>
        <Spin
          size="large"
          style={{ display: "block", margin: "auto", marginTop: 50 }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.checkoutPage}>
        <Alert
          message="Ошибка при загрузке данных"
          type="error"
          showIcon
          banner
        />
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      {notificationContextHolder}

      <div className={styles.header}>
        <h1>Оформление заказа</h1>
        <Divider />
      </div>

      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <ShoppingCartOutlined className={styles.emptyCartIcon} />
          <h3>Ваша корзина пуста</h3>
          <p>Добавьте товары в корзину, чтобы продолжить</p>
          <Button
            type="primary"
            className={styles.catalogButton}
            onClick={() => (window.location.href = "/catalog")}>
            Перейти в каталог
          </Button>
        </div>
      ) : (
        <div className={styles.checkoutContent}>
          <div className={styles.cartSection}>
            <Card title="Ваш заказ" className={styles.cartCard}>
              <div className={styles.cartList}>
                {cart.map((item) => {
                  const isImageEmpty =
                    item.image &&
                    typeof item.image === "object" &&
                    Object.keys(item.image).length === 0;
                  const imageSrc =
                    isImageEmpty || !item.image
                      ? "/placeholder.jpg"
                      : typeof item.image === "string"
                      ? item.image
                      : "/placeholder.jpg";

                  return (
                    <div key={item.id} className={styles.cartItem}>
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className={styles.cartItemImage}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                          e.currentTarget.onerror = null;
                        }}
                      />
                      <div className={styles.itemDetails}>
                        <h3>{item.name}</h3>
                        <p className={styles.price}>
                          {item.price.toLocaleString()} ₽
                        </p>
                        <div className={styles.itemControls}>
                          <InputNumber
                            min={1}
                            max={MAX_QUANTITY}
                            value={item.quantity}
                            onChange={(value) => updateQuantity(item.id, Number(value))}
                            className={styles.quantityInput}
                          />
                          <Button
                            danger
                            onClick={() => removeFromCart(item.id)}
                            className={styles.removeButton}>
                            Удалить
                          </Button>
                        </div>
                        {item.quantity === MAX_QUANTITY && (
                          <div className={styles.maxQuantityWarning}>
                            Максимальное количество: {MAX_QUANTITY} шт.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className={styles.paymentSection}>
            <Card title="Способ оплаты" className={styles.paymentCard}>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                className={styles.paymentMethods}>
                {paymentMethods.map((method) => (
                  <Radio
                    key={method.value}
                    value={method.value}
                    className={styles.paymentMethod}>
                    <div className={styles.paymentMethodContent}>
                      <span className={styles.paymentIcon}>{method.icon}</span>
                      <div>
                        <div className={styles.paymentLabel}>
                          {method.label}
                        </div>
                        <div className={styles.paymentDescription}>
                          {method.description}
                        </div>
                      </div>
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            </Card>

            <Card className={styles.summaryCard}>
              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <span>Товары {cart.length} шт. </span>
                </div>
                <Divider className={styles.summaryDivider} />
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Итого: </span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
                <Divider className={styles.summaryDivider} />
                <Button
                  type="primary"
                  size="large"
                  className={styles.checkoutButton}
                  onClick={handleOrderSubmit}
                  loading={isLoading}
                  block>
                  Оформить заказ
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;