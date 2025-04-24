import React, { useState } from 'react';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  InstagramOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { FaTelegramPlane } from 'react-icons/fa';
import { message, notification } from 'antd';
import styles from './Contacts.module.scss';
import { useSendContactFormMutation } from '../../../api/MailApi';

const Contacts: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sendContactForm, { isLoading }] = useSendContactFormMutation();
  const [notificationApi, notificationContextHolder] = notification.useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      message.error('Пожалуйста, заполните обязательные поля');
      return;
    }

    try {
      await sendContactForm(formData).unwrap();
      notificationApi.success({
        message: (
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            <CheckCircleOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
            Сообщение успешно отправлено!
          </span>
        ),
        description: (
          <div style={{ marginTop: "8px" }}>
            <p>Мы получили ваше сообщение.</p>
            <p>Свяжемся с вами в ближайшее время.</p>
          </div>
        ),
        placement: "topRight",
        duration: 5,
        style: {
          width: "350px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      notificationApi.error({
        message: "Ошибка отправки сообщения",
        description: "Пожалуйста, попробуйте еще раз",
        placement: "topRight",
      });
      console.error(err);
    }
  };

  return (
    <div className={styles.contactsPage}>
      {notificationContextHolder}

      <div className={styles.heroSection}>
        <h1>Свяжитесь с нами</h1>
        <p>Мы всегда рады помочь и ответить на ваши вопросы</p>
      </div>

      <div className={styles.contactsContainer}>
        <div className={styles.contactInfo}>
          <div className={styles.contactCard}>
            <MailOutlined className={styles.icon} />
            <h3>Электронная почта</h3>
            <p>support@example.com</p>
          </div>

          <div className={styles.contactCard}>
            <PhoneOutlined className={styles.icon} />
            <h3>Телефон</h3>
            <p>+7 (123) 456-78-90</p>
          </div>

          <div className={styles.contactCard}>
            <EnvironmentOutlined className={styles.icon} />
            <h3>Адрес</h3>
            <p>г. Москва, ул. Примерная, д. 123</p>
          </div>

          <div className={styles.contactCard}>
            <ClockCircleOutlined className={styles.icon} />
            <h3>Часы работы</h3>
            <p>Пн-Пт: 9:00 - 18:00</p>
            <p>Сб-Вс: выходной</p>
          </div>
        </div>

        <div className={styles.contactForm}>
          <h2>Напишите нам</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                name="name"
                placeholder="Ваше имя" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <input 
                type="email" 
                name="email"
                placeholder="Ваш email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                name="subject"
                placeholder="Тема сообщения" 
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <textarea 
                name="message"
                placeholder="Ваше сообщение" 
                rows={5} 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Отправка...' : 'Отправить сообщение'}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.mapSection}>
        <iframe
          title="Офис на карте"
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A1a2b3c4d5e6f7g8h9i0j&amp;source=constructor"
          width="100%"
          height="400"
          frameBorder="0"
        ></iframe>
      </div>

      <div className={styles.socialSection}>
        <h2>Мы в социальных сетях</h2>
        <div className={styles.socialIcons}>
          <a href="#"><InstagramOutlined className={styles.socialIcon} /></a>
          <a href="#"><FaTelegramPlane className={styles.socialIcon} /></a>
        </div>
      </div>
    </div>
  );
};

export default Contacts;