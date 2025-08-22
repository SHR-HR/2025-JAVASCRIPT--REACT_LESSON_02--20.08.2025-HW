import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Функция для проверки, является ли клавиша "активирующей" (Enter или пробел)
const isActivateKey = (e) =>
  e.key === "Enter" ||
  e.key === " " ||
  e.key === "Spacebar" ||
  e.code === "Space" ||
  e.keyCode === 13 ||
  e.keyCode === 32;

// Основной компонент Card - универсальная карточка для отображения контента
export default function Card({
  title, // Заголовок карточки (обязательный)
  description, // Описание карточки (необязательное)
  imageUrl, // URL изображения (необязательное)
  isHighlighted = false, // Флаг выделения карточки (по умолчанию false)
  sold = false, // Флаг статуса "продано" (по умолчанию false)
  onCardClick, // Обработчик клика по карточке (необязательный)
  meta, // Дополнительная мета-информация (необязательная)
  actions, // Действия/кнопки в карточке (необязательные)
}) {
  // 1) Обработчик нажатия клавиши: предотвращаем скролл пробелом, но разрешаем активацию
  const handleKeyDown = onCardClick
    ? (e) => {
        if (isActivateKey(e)) {
          e.preventDefault(); // Предотвращаем стандартное поведение (скролл пробелом)
          e.stopPropagation(); // Останавливаем всплытие события
        }
      }
    : undefined;

  // Обработчик отпускания клавиши: активируем карточку при нажатии Enter/Space
  const handleKeyUp = onCardClick
    ? (e) => {
        if (isActivateKey(e)) {
          e.preventDefault(); // Предотвращаем стандартное поведение
          e.stopPropagation(); // Останавливаем всплытие события
          onCardClick(e); // Вызываем обработчик клика
        }
      }
    : undefined;

  // 2) Умный обработчик клика: игнорируем клики по интерактивным элементам и выделение текста
  const handleClick = onCardClick
    ? (e) => {
        const tag = e.target.tagName.toLowerCase(); // Получаем HTML-тег элемента, по которому кликнули
        // Игнорируем клики по интерактивным элементам (кнопки, ссылки, поля ввода и т.д.)
        if (["button", "a", "input", "textarea", "select", "label"].includes(tag)) return;
        // Игнорируем клики при выделении текста
        if (window.getSelection && window.getSelection().toString()) return;
        onCardClick(e); // Вызываем обработчик клика по карточке
      }
    : undefined;

  // 3) Фокусируем карточку при любом клике мыши - это предотвращает скролл пробелом
  const focusOnMouseDown = onCardClick
    ? (e) => e.currentTarget.focus({ preventScroll: true }) // Фокус без прокрутки страницы
    : undefined;

  // Функция для остановки всплытия событий (предотвращает срабатывание обработчиков родительских элементов)
  const stop = (e) => e.stopPropagation();

  return (
    <article
      className={cx("card", { 
        highlighted: isHighlighted, // Класс для выделенной карточки
        sold: sold // Класс для проданного товара
      })}
      role={onCardClick ? "button" : undefined} // Роль кнопки для accessibility, если карточка кликабельна
      tabIndex={onCardClick ? 0 : undefined} // Делаем фокусируемой, если кликабельна
      onMouseDownCapture={focusOnMouseDown} // Фокусируем при нажатии кнопки мыши
      onClick={handleClick} // Обработчик клика
      onKeyDown={handleKeyDown} // Обработчик нажатия клавиши
      onKeyUp={handleKeyUp} // Обработчик отпускания клавиши
    >
      {/* Блок с изображением, если передан imageUrl */}
      {imageUrl && (
        <div className="card__imageWrap">
          <img
            src={imageUrl} // URL изображения
            alt={title} // Альтернативный текст = заголовок карточки
            loading="lazy" // Ленивая загрузка для оптимизации
            decoding="async" // Асинхронное декодирование изображения
            onError={(e) => { 
              // Обработчик ошибки загрузки изображения - заменяем на заглушку
              e.currentTarget.src = "https://placehold.co/600x400?text=No+Image"; 
            }}
          />
        </div>
      )}

      {/* Основное тело карточки с контентом */}
      <div className="card__body">
        <h3 className="card__title">{title}</h3> {/* Заголовок карточки */}
        {description && <p className="card__desc">{description}</p>} {/* Описание, если есть */}
        {meta && <div className="card__meta">{meta}</div>} {/* Мета-информация, если есть */}
      </div>

      {/* Блок с действиями (кнопками) - события здесь не всплывают к карточке */}
      {actions && (
        <div
          className="card__actions"
          onClick={stop} // Останавливаем всплытие клика
          onMouseDown={stop} // Останавливаем всплытие нажатия мыши
          onPointerDown={stop} // Останавливаем всплытие pointer-событий
          onKeyDown={stop} // Останавливаем всплытие нажатия клавиш
          onKeyUp={stop} // Останавливаем всплытие отпускания клавиш
        >
          {actions} {/* Отображаем переданные действия */}
        </div>
      )}
    </article>
  );
}

// Валидация пропсов компонента
Card.propTypes = {
  title: PropTypes.string.isRequired, // Заголовок (обязательный)
  description: PropTypes.string, // Описание (необязательное)
  imageUrl: PropTypes.string, // URL изображения (необязательное)
  isHighlighted: PropTypes.bool, // Флаг выделения (необязательное)
  sold: PropTypes.bool, // Флаг статуса "продано" (необязательное)
  onCardClick: PropTypes.func, // Обработчик клика (необязательное)
  meta: PropTypes.node, // Мета-информация (любой React-узел, необязательное)
  actions: PropTypes.node, // Действия (любой React-узел, необязательное)
};





