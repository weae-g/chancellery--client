import { Spin, Alert, Empty, notification } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaHeart, FaShoppingCart } from "react-icons/fa";
import { GiShoppingBag } from "react-icons/gi";
import styles from "./Favorite.module.scss";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../../../api/WishlistAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const Favorites: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const {
    data: wishlist,
    isLoading,
    error,
    refetch,
  } = useGetWishlistQuery(userId!, {
    skip: !userId,
  });

  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProduct = cart.find((item: any) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    api.success({
      message: 'Товар добавлен в корзину',
      description: `${product.name} успешно добавлен в вашу корзину`,
      placement: 'topRight',
    });
  };

  if (!userId) {
    return (
      <div className={styles.favoritesPage}>
        <div className={styles.authMessage}>
          <div className={styles.authContent}>
            <FaHeart className={styles.authIcon} />
            <h3>Ваш список избранного</h3>
            <p>Войдите в аккаунт, чтобы просматривать избранные товары</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.favoritesPage}>
        <Spin
          size="large"
          style={{ display: "block", margin: "auto", marginTop: 50 }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.favoritesPage}>
        <Alert message="Ошибка при загрузке данных" type="error" showIcon />
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className={styles.favoritesPage}>
        <Empty
          image={<GiShoppingBag className={styles.emptyIcon} />}
          description={
            <div className={styles.emptyMessage}>
              <h3>Ваш список избранного пуст</h3>
              <p>Добавляйте понравившиеся товары, чтобы не потерять их</p>
              <Link to="/catalog" className={styles.emptyButton}>
                Перейти в каталог
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const handleRemove = async (productId: number) => {
    await removeFromWishlist({ userId, productId });
    await refetch();
  };

  return (
    <div className={styles.favoritesPage}>
      {contextHolder}
      
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FaHeart className={styles.titleIcon} /> Избранное
        </h1>
        <p className={styles.subtitle}>
          {wishlist.length} {wishlist.length === 1 ? "товар" : "товаров"} в вашем списке
        </p>
      </div>

      <div className={styles.favoritesGrid}>
        {wishlist.map((item) => (
          <div key={item.product.id} className={styles.favoritesItem}>
            <div className={styles.imageContainer}>
              <img
                src={item.product.image || "/placeholder.jpg"}
                alt={item.product.name}
                className={styles.favoritesImage}
                onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
              />
              <button
                className={styles.removeButton}
                onClick={() => handleRemove(item.product.id)}
                aria-label="Удалить из избранного"
              >
                <FaTrash className={styles.trashIcon} />
              </button>
            </div>

            <div className={styles.favoritesInfo}>
              <h3 className={styles.favoritesName}>{item.product.name}</h3>
              <p className={styles.favoritesDescription}>
                {item.product.description}
              </p>
              
              <div className={styles.bottomRow}>
                <div className={styles.favoritesPrice}>
                  {item.product.price} ₽
                </div>
                <button
                  onClick={() => addToCart(item.product)}
                  className={styles.addToCartButton}
                >
                  <FaShoppingCart className={styles.cartIcon} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;