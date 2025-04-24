import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.notFound__title}>404</h1>
      <p className={styles.notFound__text}>Страница не найдена</p>
      <Link to="/" className={styles.notFound__button}>Вернуться на главную</Link>
    </div>
  );
};

export default NotFound;
