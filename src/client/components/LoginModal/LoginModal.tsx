import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaUser, FaLock, FaTimes, FaSpinner, FaPhone } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../../../api/AuthAPI";
import { setCredentials } from "../../../store/authSlice";
import styles from "./LoginModal.module.scss";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  passwordRepeat?: string;
  phone?: string; 
}

const loginSchema = yup.object().shape({
  email: yup.string().email("Неверный формат email").required("Введите email"),
  password: yup
    .string()
    .min(6, "Минимум 6 символов")
    .required("Введите пароль"),
});

const registerSchema = yup.object().shape({
  email: yup.string().email("Неверный формат email").required("Введите email"),
  password: yup
    .string()
    .min(6, "Минимум 6 символов")
    .required("Введите пароль"),
  passwordRepeat: yup
    .string()
    .oneOf([yup.ref("password")], "Пароли должны совпадать")
    .required("Повторите пароль"),
  phone: yup
    .string()
    .matches(/^\+7\d{10}$/, "Телефон должен быть в формате +7XXXXXXXXXX")
    .required("Введите номер телефона"),
});

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const schema = isLogin ? loginSchema : registerSchema;
  const {
    handleSubmit,
    register: formRegister,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isLogin) {
        const response = await login({
          email: data.email,
          password: data.password,
        }).unwrap();

        dispatch(
          setCredentials({
            token: response.accessToken,
            refreshToken: response.refreshToken.token,
            user: response.user,
          })
        );

        const userRole = response.user.role;
        navigate(
          userRole === "ADMIN"
            ? "/admin"
            : userRole === "MANAGER"
            ? "/manager"
            : "/auth/profile"
        );
      } else {
          await register({
            email: data.email,
            passwordHash: data.password,
            passwordRepeat: data.passwordRepeat!,
            role: "USER",
            phone: data.phone!,
          }).unwrap();
        setIsLogin(true);
      }

      onClose();
    } catch (error) {
      console.error("Ошибка авторизации:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className={styles["modal"]}>
      <div className={styles["modal__overlay"]} />
      <div className={styles["modal__content"]}>
        <button className={styles["modal__close"]} onClick={onClose}>
          <FaTimes />
        </button>
        <h2 className={styles["modal__title"]}>
          {isLogin ? "Вход" : "Регистрация"}
        </h2>

        <form
          className={styles["modal__form"]}
          onSubmit={handleSubmit(onSubmit)}>
          <div className={styles["modal__field"]}>
            <label className={styles["modal__label"]} htmlFor="email">
              Email
            </label>
            <div className={styles["modal__input-wrapper"]}>
              <FaUser className={styles["modal__icon"]} />
              <input
                {...formRegister("email")}
                className={styles["modal__input"]}
                placeholder="Введите email"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className={styles["modal__error"]}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles["modal__field"]}>
            <label className={styles["modal__label"]} htmlFor="password">
              Пароль
            </label>
            <div className={styles["modal__input-wrapper"]}>
              <FaLock className={styles["modal__icon"]} />
              <input
                type="password"
                {...formRegister("password")}
                className={styles["modal__input"]}
                placeholder="Введите пароль"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
            {errors.password && (
              <p className={styles["modal__error"]}>
                {errors.password.message}
              </p>
            )}
          </div>

          {!isLogin && (
            <>
              <div className={styles["modal__field"]}>
                <label className={styles["modal__label"]} htmlFor="phone">
                  Телефон
                </label>
                <div className={styles["modal__input-wrapper"]}>
                  <FaPhone className={styles["modal__icon"]} />
                  <input
                    type="text"
                    {...formRegister("phone")}
                    className={styles["modal__input"]}
                    placeholder="Введите номер телефона"
                    autoComplete="tel"
                  />
                </div>
                {errors.phone && (
                  <p className={styles["modal__error"]}>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className={styles["modal__field"]}>
                <label
                  className={styles["modal__label"]}
                  htmlFor="passwordRepeat">
                  Повторите пароль
                </label>
                <div className={styles["modal__input-wrapper"]}>
                  <FaLock className={styles["modal__icon"]} />
                  <input
                    type="password"
                    {...formRegister("passwordRepeat")}
                    className={styles["modal__input"]}
                    placeholder="Повторите пароль"
                    autoComplete="new-password"
                  />
                </div>
                {errors.passwordRepeat && (
                  <p className={styles["modal__error"]}>
                    {errors.passwordRepeat.message}
                  </p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            className={styles["modal__button"]}
            disabled={isLoggingIn || isRegistering}>
            {isLoggingIn || isRegistering ? (
              <FaSpinner className={styles["modal__spinner"]} />
            ) : isLogin ? (
              "Войти"
            ) : (
              "Зарегистрироваться"
            )}
          </button>
        </form>

        <p className={styles["modal__toggle"]}>
          {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className={styles["modal__toggle-link"]}>
            {isLogin ? "Зарегистрироваться" : "Войти"}
          </span>
        </p>
      </div>
    </Dialog>
  );
};

export default LoginModal;
