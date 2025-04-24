import { Link } from "react-router-dom";
import { FaPrint, FaHandshake, FaShippingFast, FaArrowRight } from "react-icons/fa";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Добро пожаловать в <span>СКАУТ</span></h1>
          <p className={styles.heroText}>Инновационные решения в печатной продукции для вашего бизнеса</p>
          <Link to="/catalog" className={styles.heroButton}>
            Перейти в каталог <FaArrowRight className={styles.arrowIcon} />
          </Link>
        </div>
        <div className={styles.heroImage}>
          <img src="/main.jpg" alt="Печатная продукция" />
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Почему выбирают нас</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaPrint size={40} />
            </div>
            <h3>Качество</h3>
            <p>Используем только современное оборудование и материалы премиум-класса для безупречного результата</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaHandshake size={40} />
            </div>
            <h3>Надежность</h3>
            <p>10 лет на рынке печатных услуг. Более 500 довольных клиентов по всей стране</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaShippingFast size={40} />
            </div>
            <h3>Быстрая доставка</h3>
            <p>Собственная логистическая служба гарантирует доставку точно в срок</p>
          </div>
        </div>
      </section>

      <section className={styles.portfolio}>
        <h2 className={styles.sectionTitle}>Наши работы</h2>
        <div className={styles.portfolioGrid}>
          <div className={styles.portfolioItem}>
            <img src="/example_1.jpg" alt="Пример продукции 1" />
            <div className={styles.portfolioOverlay}>
              <h3>Визитки</h3>
              <p>Премиум качество</p>
            </div>
          </div>
          <div className={styles.portfolioItem}>
            <img src="/example_2.jpg" alt="Пример продукции 2" />
            <div className={styles.portfolioOverlay}>
              <h3>Буклеты</h3>
              <p>Яркие решения</p>
            </div>
          </div>
          <div className={styles.portfolioItem}>
            <img src="/example_3.jpg" alt="Пример продукции 3" />
            <div className={styles.portfolioOverlay}>
              <h3>Плакаты</h3>
              <p>Крупный формат</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Готовы начать проект?</h2>
        <p>Оставьте заявку и мы свяжемся с вами в течение 15 минут</p>
        <Link to="/contacts" className={styles.ctaButton}>
          Оставить заявку
        </Link>
      </section>
    </div>
  );
};

export default Home;