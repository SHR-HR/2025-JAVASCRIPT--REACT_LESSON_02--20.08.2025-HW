import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Card from "./Card.jsx";

// Компонент AdCard - карточка объявления с возможностью редактирования
export default function AdCard({ ad, onUpdate, onDelete }) {
  // Состояние режима редактирования (вкл/выкл)
  const [isEditing, setIsEditing] = useState(false);
  // Состояние для черновой версии данных объявления (редактируемая копия)
  const [draft, setDraft] = useState(ad);
  
  // Эффект для синхронизации черновика с переданными данными объявления
  useEffect(() => setDraft(ad), [ad]);

  // Обработчик изменения полей ввода в режиме редактирования
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((d) => ({
      ...d,
      // Для поля "price" преобразуем значение в число, для остальных полей оставляем строкой
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  // Функция для чтения файла как Data URL (преобразование изображения в base64 строку)
  const readFileAsDataURL = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader(); // Создаем объект для чтения файлов
      r.onload = () => res(r.result); // При успешном чтении возвращаем результат
      r.onerror = rej; // При ошибке отклоняем промис
      r.readAsDataURL(file); // Читаем файл как Data URL
    });

  // Обработчик события перетаскивания и отпускания файла (drag-and-drop)
  const onDrop = useCallback(async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение браузера
    const file = e.dataTransfer.files?.[0]; // Получаем первый перетащенный файл
    if (!file) return; // Если файла нет, выходим из функции
    const dataUrl = await readFileAsDataURL(file); // Читаем файл как Data URL
    setDraft((d) => ({ ...d, imageUrl: dataUrl })); // Обновляем черновик с новым URL изображения
  }, []);

  // Обработчик сохранения изменений
  const handleSave = () => {
    // Проверяем обязательные поля: заголовок и изображение должны быть заполнены
    if (!draft.title?.trim() || !draft.imageUrl) return;
    
    // Вызываем функцию обновления с отформатированными данными
    onUpdate(ad.id, {
      title: draft.title.trim(), // Убираем лишние пробелы в заголовке
      description: (draft.description || "").trim(), // Убираем лишние пробелы в описании (если есть)
      price: Number.isFinite(draft.price) ? draft.price : 0, // Проверяем, что цена - конечное число
      imageUrl: typeof draft.imageUrl === "string" ? draft.imageUrl.trim() : draft.imageUrl, // Убираем лишние пробелы в URL
    });
    setIsEditing(false); // Выходим из режима редактирования
  };

  // Обработчик отмены редактирования
  const handleCancel = () => {
    setDraft(ad); // Восстанавливаем исходные данные объявления
    setIsEditing(false); // Выходим из режима редактирования
  };

  // Если не в режиме редактирования, отображаем карточку в режиме просмотра
  if (!isEditing) {
    return (
      <Card
        title={ad.title} // Заголовок объявления
        description={ad.description || undefined} // Описание (если есть)
        imageUrl={ad.imageUrl} // URL изображения
        isHighlighted={ad.isHighlighted} // Флаг выделенного объявления
        sold={ad.sold} // Флаг проданного товара
        onCardClick={() => {
        console.log('Card clicked:', ad.title);
        setIsEditing(true);
        }} // Обработчик клика по карточке для перехода в режим редактирования
        meta={<span className="price">{ad.price?.toLocaleString()} ₸</span>} // Блок с ценой в тенге
        actions={
          // Кнопки действий в карточке
          <>
            <button
              type="button"
              className="btn"
              onClick={(e) => {
                e.stopPropagation(); // Останавливаем всплытие события, чтобы не сработал onCardClick
                setIsEditing(true); // Переходим в режим редактирования
              }}
            >
              Редактировать
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={(e) => {
                e.stopPropagation(); // Останавливаем всплытие события
                onDelete(ad.id); // Вызываем функцию удаления объявления
              }}
            >
              Удалить
            </button>
          </>
        }
      />
    );
  }

  // Режим редактирования: отображаем форму с полями для редактирования
  return (
    <article className={`card ${isEditing ? "card--editing" : ""}`}>
      {/* Область для перетаскивания изображения */}
      <div
        className="card__imageWrap card__imageWrap--drop"
        onDragOver={(e) => e.preventDefault()} // Разрешаем перетаскивание
        onDrop={onDrop} // Обработчик отпускания файла
        title="Перетащи сюда картинку" // Подсказка при наведении
      >
        <img
          src={draft.imageUrl || "https://placehold.co/600x400?text=Drag+Image+Here"} // Источник изображения или заглушка
          alt="preview" // Альтернативный текст
          onError={(e) => {
            // Обработчик ошибки загрузки изображения
            e.currentTarget.src = "https://placehold.co/600x400?text=No+Image"; // Заменяем на заглушку
          }}
        />
      </div>

      {/* Тело карточки с полями ввода */}
      <div className="card__body">
        {/* Поле для ввода названия объявления */}
        <label className="field">
          <span>Название *</span> {/* Обязательное поле */}
          <input name="title" value={draft.title} onChange={handleChange} />
        </label>

        {/* Поле для ввода описания объявления */}
        <label className="field">
          <span>Описание</span>
          <textarea
            name="description"
            rows={3} // Высота текстового поля
            value={draft.description}
            onChange={handleChange}
          />
        </label>

        {/* Поле для ввода цены */}
        <label className="field">
          <span>Цена</span>
          <input
            name="price"
            type="number" // Тип input - число
            min="0" // Минимальное значение
            value={draft.price ?? 0} // Значение по умолчанию 0
            onChange={handleChange}
          />
        </label>

        {/* Поле для ввода URL изображения */}
        <label className="field">
          <span>URL изображения *</span> {/* Обязательное поле */}
          <input
            name="imageUrl"
            value={draft.imageUrl}
            onChange={handleChange}
            placeholder="https://... или data:image/..." // Подсказка в поле ввода
          />
        </label>
      </div>

      {/* Кнопки действий в режиме редактирования */}
      <div className="card__actions">
        <button className="btn btn--primary" onClick={handleSave}>
          Сохранить
        </button>
        <button className="btn" onClick={handleCancel}>
          Отмена
        </button>
      </div>
    </article>
  );
}

// Валидация пропсов компонента
AdCard.propTypes = {
  // Объект с данными объявления
  ad: PropTypes.shape({
    id: PropTypes.string.isRequired, // Уникальный идентификатор (обязательный)
    title: PropTypes.string.isRequired, // Заголовок (обязательный)
    description: PropTypes.string, // Описание (необязательное)
    price: PropTypes.number, // Цена (необязательная)
    imageUrl: PropTypes.string, // URL изображения (необязательное)
    isHighlighted: PropTypes.bool, // Флаг выделения (необязательный)
    sold: PropTypes.bool, // Флаг продажи (необязательный)
  }).isRequired,
  onUpdate: PropTypes.func.isRequired, // Функция обновления объявления (обязательная)
  onDelete: PropTypes.func.isRequired, // Функция удаления объявления (обязательная)
};







