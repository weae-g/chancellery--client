import { Spin, Alert, Tag, Badge, Input, Select, Pagination, Empty, notification } from "antd";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import { GiCardboardBox } from "react-icons/gi";
import styles from "./Catalog.module.scss";
import { useGetProductsQuery, useGetProductImageQuery } from "../../../api/ProductAPI";
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../../../api/WishlistAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const { Search } = Input;
const { Option } = Select;

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageId: number | null;
  quantity: number;
  categoryId: number;
  supplierId: number;
  createdAt: string;
  category: Category;
  supplier: Supplier;
}

interface ProductImageProps {
  productId: number;
  hasImage: boolean;
  alt: string;
  className?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ productId, hasImage, alt, className }) => {
  const [imageUrl, setImageUrl] = useState<string>('/placeholder.jpg');
  const { data: imageBlob } = useGetProductImageQuery(productId, {
    skip: !hasImage
  });

  useEffect(() => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageBlob]);

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = '/placeholder.jpg';
      }}
    />
  );
};

const Catalog: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const { data: productsData, error, isLoading } = useGetProductsQuery();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: wishlist, refetch } = useGetWishlistQuery(userId!, {
    skip: !userId,
  });

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    if (error) {
      console.error("Ошибка при загрузке товаров:", error);
    }
  }, [error]);

  const categories = Array.from(
    new Set(productsData?.map((product) => product.category.name))
  );

  const filteredProducts = productsData
    ?.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory
        ? product.category.name === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    }) || [];

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const isInWishlist = (productId: number) => {
    return wishlist?.some((item) => item.product.id === productId);
  };

  const handleWishlistToggle = async (productId: number) => {
    if (!userId) {
      api.warning({
        message: 'Требуется авторизация',
        description: 'Войдите в аккаунт, чтобы добавить в избранное',
        placement: 'topRight',
      });
      return;
    }

    if (isInWishlist(productId)) {
      await removeFromWishlist({ userId, productId });
      api.success({
        message: 'Удалено из избранного',
        placement: 'topRight',
      });
    } else {
      await addToWishlist({ userId, productId });
      api.success({
        message: 'Добавлено в избранное',
        placement: 'topRight',
      });
    }

    await refetch();
  };

  const addToCart = (product: Product) => {
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

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (isLoading) {
    return (
      <div className={styles.catalogPage}>
        <Spin
          size="large"
          style={{ display: "block", margin: "auto", marginTop: 50 }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.catalogPage}>
        <Alert 
          message="Ошибка загрузки данных" 
          type="error" 
          showIcon 
          banner
          closable
        />
      </div>
    );
  }

  return (
    <div className={styles.catalogPage}>
      {contextHolder}
      
      <div className={styles.header}>
        <h1 className={styles.title}>Каталог продукции</h1>
        <p className={styles.subtitle}>Широкий ассортимент печатной продукции для вашего бизнеса</p>
      </div>

      <div className={styles.filterPanel}>
        <Search
          placeholder="Поиск по названию"
          allowClear
          enterButton={<FaSearch />}
          size="large"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.searchInput}
        />

        <Select
          placeholder="Все категории"
          allowClear
          size="large"
          value={selectedCategory}
          onChange={(value) => {
            setSelectedCategory(value);
            setCurrentPage(1);
          }}
          className={styles.categorySelect}
        >
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </div>

      {paginatedProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <Empty
            description={
              <Alert
                message={searchTerm || selectedCategory 
                  ? "Ничего не найдено по вашему запросу" 
                  : "Каталог пуст"}
                type="info"
                showIcon
              />
            }
          />
        </div>
      ) : (
        <>
          <div className={styles.catalogGrid}>
            {paginatedProducts.map((product) => (
              <div key={product.id} className={styles.catalogItem}>
                <div className={styles.imageContainer}>
                  <ProductImage 
                    productId={product.id}
                    hasImage={product.imageId !== null}
                    alt={product.name}
                    className={styles.catalogImage}
                  />
                  <div className={styles.categoryTag}>
                    <Tag color="#3498db">{product.category.name}</Tag>
                  </div>
                  <button
                    className={`${styles.wishlistButton} ${
                      isInWishlist(product.id) ? styles.active : ""
                    }`}
                    onClick={() => handleWishlistToggle(product.id)}
                  >
                    {isInWishlist(product.id) ? (
                      <FaHeart className={styles.heartIcon} />
                    ) : (
                      <FaRegHeart className={styles.heartIcon} />
                    )}
                  </button>
                </div>

                <div className={styles.catalogInfo}>
                  <div className={styles.productHeader}>
                    <h3 className={styles.catalogName}>{product.name}</h3>
                    <Badge
                      count={`${product.quantity} шт`}
                      style={{ backgroundColor: "#2ecc71" }}
                    />
                  </div>

                  <p className={styles.catalogDescription}>
                    {product.description}
                  </p>

                  <div className={styles.supplierInfo}>
                    <GiCardboardBox className={styles.supplierIcon} />
                    <span>{product.supplier.name}</span>
                  </div>

                  <div className={styles.priceRow}>
                    <div className={styles.catalogPrice}>{product.price} ₽</div>
                    <div className={styles.actions}>
                      <button
                        className={styles.orderButton}
                        onClick={() => addToCart(product)}
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["8", "16", "24", "32"]}
              showTotal={(total) => `Всего ${total} товаров`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Catalog;