import React from "react";
import { Card, Row, Col, Typography, Divider, Spin, Alert } from "antd";
import {
  FaPrint,
  FaPalette,
  FaBoxOpen,
  FaMedal,
  FaTruck,
  FaFileAlt,
} from "react-icons/fa";
import styles from "./Services.module.scss";
import { useGetCategoriesQuery } from "../../../api/CategoryAPI";

const { Title, Paragraph, Text } = Typography;

const Services: React.FC = () => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

  const companyInfo = {
    title: "Наши услуги",
    description:
      "Мы предлагаем полный спектр полиграфических услуг для бизнеса любого масштаба. Более 15 лет на рынке, современное оборудование и индивидуальный подход к каждому клиенту.",
    stats: [
      { value: "15+", label: "Лет опыта", color: "#3498db" },
      { value: "500+", label: "Довольных клиентов", color: "#2ecc71" },
      { value: "24/7", label: "Поддержка", color: "#e74c3c" },
      { value: "100%", label: "Гарантия качества", color: "#f39c12" },
    ],
    advantages: [
      {
        text: "Современное оборудование ведущих мировых брендов",
        icon: <FaPrint />,
      },
      { text: "Используем только экологичные материалы", icon: <FaPalette /> },
      { text: "Соблюдаем сроки на 99.8%", icon: <FaTruck /> },
      {
        text: "Гибкая система скидок для постоянных клиентов",
        icon: <FaFileAlt />,
      },
      { text: "Бесплатные консультации и дизайн-макеты", icon: <FaMedal /> },
    ],
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconsMap: Record<string, any> = {
      "Бизнес-печать": <FaPrint className={styles.serviceIcon} />,
      "Рекламная продукция": <FaPalette className={styles.serviceIcon} />,
      Упаковка: <FaBoxOpen className={styles.serviceIcon} />,
      "Сувенирная продукция": <FaMedal className={styles.serviceIcon} />,
      "Широкоформатная печать": <FaFileAlt className={styles.serviceIcon} />,
      Типография: <FaPrint className={styles.serviceIcon} />,
    };

    return iconsMap[categoryName] || <FaPrint className={styles.serviceIcon} />;
  };

  if (isLoading) {
    return (
      <div className={styles.spinContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.errorContainer}>
        <Alert message="Ошибка загрузки данных" type="error" showIcon />
      </div>
    );
  }

  return (
    <div className={styles.servicesPage}>
      <div className={styles.heroSection}>
        <Title level={1} className={styles.heroTitle}>
          {companyInfo.title}
        </Title>
        <Paragraph className={styles.heroDescription}>
          {companyInfo.description}
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} className={styles.statsRow}>
        {companyInfo.stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              className={styles.statCard}
              style={{ borderColor: stat.color }}>
              <Text
                strong
                className={styles.statValue}
                style={{ color: stat.color }}>
                {stat.value}
              </Text>
              <Text type="secondary" className={styles.statLabel}>
                {stat.label}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider orientation="left">
        <Title level={2} className={styles.sectionTitle}>
          Направления деятельности
        </Title>
      </Divider>

      <Row gutter={[24, 24]} className={styles.categoriesRow}>
        {categories?.map((category: any) => (
          <Col xs={24} md={12} lg={8} key={category.id}>
            <Card
              hoverable
              className={styles.categoryCard}
              cover={
                <div
                  className={styles.cardIconContainer}
                  style={{ backgroundColor: getRandomColor() }}>
                  {getCategoryIcon(category.name)}
                </div>
              }>
              <Card.Meta
                title={<Text strong>{category.name}</Text>}
                description={category.description}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Divider orientation="left">
        <Title level={2} className={styles.sectionTitle}>
          Почему выбирают нас
        </Title>
      </Divider>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <div className={styles.imageContainer}>
            <img
              src="/service.jpg"
              alt="Наше производство"
              className={styles.advantageImage}
            />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <ul className={styles.advantagesList}>
            {companyInfo.advantages.map((advantage, index) => (
              <li key={index} className={styles.advantageItem}>
                <div className={styles.advantageIcon}>{advantage.icon}</div>
                <Text>{advantage.text}</Text>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </div>
  );
};

const getRandomColor = () => {
  const colors = [
    "rgba(52, 152, 219, 0.2)",
    "rgba(46, 204, 113, 0.2)",
    "rgba(155, 89, 182, 0.2)",
    "rgba(241, 196, 15, 0.2)",
    "rgba(230, 126, 34, 0.2)",
    "rgba(231, 76, 60, 0.2)",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default Services;
