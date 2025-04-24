import { Link } from "react-router-dom";
import { useState } from "react";
import {
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineHeart,
} from "react-icons/ai";
import { MdContactPhone } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { TbLayoutGrid } from "react-icons/tb";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";
import LoginModal from "../LoginModal/LoginModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import styles from "./Header.module.scss";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const getProfilePath = () => {
    if (user?.role === "ADMIN") return "/admin";
    if (user?.role === "MANAGER") return "/manager";
    return "/auth/profile";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img
            src="/favicon.png"
            alt="Типография СКАУТ"
            className={styles.logo__icon}
          />
          <span className={styles.logo__text}>СКАУТ</span>
        </Link>

        <nav className={styles.desktopNav}>
          <Link to="/catalog" className={styles.link}>
            <TbLayoutGrid size={24} />
            <span>Продукция</span>
          </Link>
          <Link to="/services" className={styles.link}>
            <HiOutlineDocumentText size={24} />
            <span>Услуги</span>
          </Link>
          {/* <Link to="/calculator" className={styles.link}>
            <AiOutlineCalculator size={24} />
            <span>Калькулятор</span>
          </Link> */}
          <Link to="/checkout" className={styles.link}>
            <AiOutlineShoppingCart size={24} />
            <span>Заказы</span>
          </Link>
          <Link to="/contacts" className={styles.link}>
            <MdContactPhone size={24} />
            <span>Контакты</span>
          </Link>
        </nav>

        <div className={styles.auth}>
          <div className={styles.profileContainer}>
            <Link to="/favorites" className={styles.link}>
              <AiOutlineHeart size={24} color="#ff1744" />
            </Link>
            {user ? (
              <Link to={getProfilePath()} className={styles.profileButton}>
                <AiOutlineUser size={24} />
              </Link>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className={styles.profileButton}>
                <AiOutlineUser size={24} />
              </button>
            )}
            <button
              className={styles.burger}
              onClick={toggleMenu}
              aria-label="Меню">
              {isMenuOpen ? (
                <CgMenuRight size={30} color="#121212" />
              ) : (
                <CgMenuLeft size={30} color="#121212" />
              )}
            </button>
          </div>
        </div>

        <div className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNav__open : ""}`}>
          <nav className={styles.mobileNavContent}>
            <Link to="/catalog" className={styles.link} onClick={toggleMenu}>
              <TbLayoutGrid size={24} />
              <span>Продукция</span>
            </Link>
            <Link to="/services" className={styles.link} onClick={toggleMenu}>
              <HiOutlineDocumentText size={24} />
              <span>Услуги</span>
            </Link>
            {/* <Link to="/calculator" className={styles.link} onClick={toggleMenu}>
              <AiOutlineCalculator size={24} />
              <span>Калькулятор</span>
            </Link> */}
            <Link to="/checkout" className={styles.link} onClick={toggleMenu}>
              <AiOutlineShoppingCart size={24} />
              <span>Заказы</span>
            </Link>
            <Link to="/contacts" className={styles.link} onClick={toggleMenu}>
              <MdContactPhone size={24} />
              <span>Контакты</span>
            </Link>
          </nav>
        </div>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Header;