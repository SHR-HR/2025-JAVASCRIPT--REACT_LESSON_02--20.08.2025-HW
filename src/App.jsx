// Импорт необходимых модулей и хуков из React
import React, { useEffect, useMemo, useState } from "react";
// Импорт компонентов карточки объявления и создания нового объявления
import AdCard from "./components/AdCard.jsx";
import NewAdCard from "./components/NewAdCard.jsx";

// Ключ для хранения данных в localStorage (local storage key)
const LS_KEY = "ads_v1";

// Демо-данные (включил флаги, чтобы их можно было использовать в карточке)
// Начальные данные приложения, которые будут использоваться если в localStorage нет данных
const seed = [
  { id: crypto.randomUUID(), title: "Ноутбук Aurora X15", description: "Тонкий, холодный и быстрый. Экран 165 Гц, идеален для кодинга и игр.", price: 485000, imageUrl: "https://vkplay.ru/pre_0x736_resize/hotbox/content_files/UgcStories/2024/08/14/0dabd0c98ee048d9a056254f7b91c28b.png?quality=85&format=jpeg", isHighlighted: true, sold: false },
  { id: crypto.randomUUID(), title: "Клавиатура Nebula Pro", description: "Механика с хотсвапом, tactile-свичи, PBT keycaps. Печатать — кайф.", price: 69000, imageUrl: "https://i.ytimg.com/vi/_1cA9vQpgYs/maxresdefault.jpg", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Мышь Phantom RGB", description: "Ультралёгкий корпус, сенсор 26K DPI, кабель как шнурок.", price: 39000, imageUrl: "https://c.dns-shop.kz/thumb/st1/fit/500/500/b88c1d6226ab13213461b47ac36e974b/5298c54c4f361ffb88694bfecd640b24145ead625fd24d28c74dc57fcb8dfdbe.jpg", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Неоновая волна", description: "Гипнотическая волна — идеально для неонового сетапа.", price: 10, imageUrl: "https://i.pinimg.com/originals/62/26/43/6226435516042edfe1a4514a44e2023a.gif", isHighlighted: true, sold: false },

  { id: crypto.randomUUID(), title: "Монитор Vertex 4K", description: "ASS micro LED 49\", 4K, тонкие рамки. Шрифты — конфетка.", price: 285000, imageUrl: "https://img.alicdn.com/imgextra/i3/6000000006485/O1CN01bUbpR51xmBLSIsi1n_!!6000000006485-0-tbvideo.jpg", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Наушники Eclipse ANC", description: "Шикарный шумодав и бархатный бас. До 40 часов музыки.", price: 99000, imageUrl: "https://cs2.pikabu.ru/post_img2/2014/01/20/9/1390227828_1579370683.gif", isHighlighted: true, sold: false },
  { id: crypto.randomUUID(), title: "Колонки Thunder 2.1", description: "Громкие и чистые. Саундтрек к вечеринке — обеспечен.", price: 96000, imageUrl: "https://gagadget.com/media/uploads/thunder2060wwirelesspartyspeaker1440x.webp", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Космический туман", description: "Плавный космический градиент. Залипательное настроение.", price: 0, imageUrl: "https://wallpapercave.com/wp/wp2636532.gif", isHighlighted: false, sold: false },

  { id: crypto.randomUUID(), title: "Игровая консоль Nimbus", description: "4K HDR, быстрый SSD, два геймпада. Полетели в кооп!", price: 275000, imageUrl: "https://ir-3.ozone.ru/s3/multimedia-y/wc1000/6056534974.jpg", isHighlighted: true, sold: false },
  { id: crypto.randomUUID(), title: "Смартфон Pulse X", description: "Флагманская камера, 120 Гц экран, батарея — зверь.", price: 365000, imageUrl: "https://mobidevices.com/images/2024/04/HMD-Pulse_1.webp", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Умные часы Nova", description: "Сапфир, GPS, пульс/сон/стресс. Заряда на неделю.", price: 1450000, imageUrl: "https://yandex-images.clstorage.net/O9CB7d365/ccffe0bf/hflDDJLG6r9Kvh8n4HAYDV3U3lXzvAQIYExTD-r8jWjfMsD376wvQkohYv2XdO7KDYRfCriKdteOdxViPQ5jHpHIV3yzF4q7P4oPA7R03dhZ9Rs1EnzUKhdeoUyN_g4bCZCDFu-IOlc-4Kd5UZPv6CjDePw978Aj7TNkMwnOZVz26GIaVQMaLgucTrdAFrv-LnDPtUBuNKpljPEuTD-NCVnQ8te_WDjl_va1KNLC21kq85qu_Z2xET0SRqLaXxbc9MgSa7ZQ6f-Jza9W4EY4f0yQbqcCfWQJJZxhTGysX7gLkrCUHelIlT_VVdtTQykomnOoXy0_QBDNM2ezC_20jDZ6wAkXMusuCZ4MNoFkurx9cn-E8dymeuQdMHzPXA-7aEKgp235S3W_VSeZ4wMI22qQK4-t3iFSDCOnQGv8lf-XmRE6FWLoDIstn0TiJgteTJBsRxIO5Vu0zCBsTi4dmfrS8pU_-Zi3HGZU2ACQeZj60jj8HZ-gQi2ipQK4rFUOFNvAeJYAuI4K7X0Vg9V73c-AjsbCbCR59f3Qzjxef6iL0uJlzgoKRC81J_hQ4pkpeGBojt8uUuM8saayiAzE3CYq8Znkotg-2I8f9rEEy629kk93s2wm6XZPMF5vjF-JiYIyl56IeAddhQS5wSCp24gTmq2s31FQ73DmQkrsRN22-lJbJXLaPwiM3xfQdtuevYFtRGE9VqimjYJ_rmxfq-pigtduyPg1fiVla7CQCOgqEvq83d_T0czQdWAJDMXcVOtxOwQSKn253e8nQ2ToD46DPUdTfxXJJs7gPyycrqtqgULFTYiqR-xFVJvj42lbW6GonN19EWPsYofRa8y3Htca8qlXMIgsOi99hgPlWj9tw10UoF3Gi5YsYX__Xk8a6yNwlC77S2Xs5ef6kKBbClojij2dbnISbZLEsAuett3F2IDL1HJZr6q837ag5mmPDAJfBpGd5ohGP4Gun3zMo", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Абстрактные линии", description: "Мягкие световые линии — эстетичный луп.", price: 0, imageUrl: "https://steamuserimages-a.akamaihd.net/ugc/1011562146743408909/9CD519F8C76021169FCDBB9433890F9ED49E8989/?imw=512&amp;&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=false", isHighlighted: true, sold: false },

  { id: crypto.randomUUID(), title: "Дрон Skyhawk 4K", description: "Стабилизация 3-оси, 4K/60fps, дальность — вау.", price: 420000, imageUrl: "https://cdn.shopify.com/s/files/1/1569/9941/products/SkyHawk_Drone_-_Sakar_-_Edited_-26_1400x.jpg", isHighlighted: true, sold: false },
  { id: crypto.randomUUID(), title: "Камера Lumos 35", description: "Беззеркалка для творцов. Кинематографичный цвет.", price: 380000, imageUrl: "https://avatars.mds.yandex.net/i?id=54205ff47932aac348867187faff5655-5257713-images-thumbs&n=13", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Объектив Zephyr 50mm", description: "Мягкое боке и бритвенная резкость.", price: 165000, imageUrl: "https://i.pinimg.com/originals/a6/79/fb/a679fbf5e8f2059ec23577062dc49e8f.jpg", isHighlighted: false, sold: true },
  { id: crypto.randomUUID(), title: "Огни мегаполиса", description: "Ночной город в дождь — чистый киберпанк.", price: 0, imageUrl: "https://img1.picmix.com/output/pic/normal/2/3/6/9/3229632_41e40.gif", isHighlighted: false, sold: false },

  { id: crypto.randomUUID(), title: "Велосипед Carbon Roadster", description: "Лёгкая рама, катит как по маслу.", price: 520000, imageUrl: "https://avatars.mds.yandex.net/i?id=ffeb2deaf0d6ff44e3de4199ccc5a73becc992b9-4765406-images-thumbs&n=133", isHighlighted: true, sold: false },
  { id: crypto.randomUUID(), title: "Скейтборд Street Vibe", description: "Гибкий дек, цепкие колёса. Flow гарантирован.", price: 45000, imageUrl: "https://i.pinimg.com/736x/3d/a0/f6/3da0f618a2012b59ea468bff24ff5f0c.jpg", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Электросамокат Swift E3", description: "Складной, 30 км на заряде. Утро быстрее.", price: 185000, imageUrl: "https://sc04.alicdn.com/kf/HTB1qOMEcRKw3KVjSZTEq6AuRpXa0.jpg", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Морские волны", description: "Спокойный лайтовый луп с волнами.", price: 0, imageUrl: "https://i.pinimg.com/originals/e5/2e/50/e52e5046bdad72d0ce242c45ea68c5b2.gif", isHighlighted: true, sold: false },

  { id: crypto.randomUUID(), title: "Палатка Trek Ultra", description: "Двухслойная, штормовые растяжки, сборка 3 мин.", price: 98000, imageUrl: "https://avatars.mds.yandex.net/i?id=35cadf77e0209164ac6fcdea8fe86dbb_l-10413045-images-thumbs&n=13", isHighlighted: false, sold: true },
  { id: crypto.randomUUID(), title: "Рюкзак Ranger 45L", description: "Анатомическая спинка, дождезащита, карманы.", price: 48000, imageUrl: "https://www.tradeinn.com/f/13814/138144565/dakine-ranger-travel-pack-45l-backpack.webp", isHighlighted: true, sold: false },
  { id: crypto.randomUUID(), title: "Термокружка HeatKeeper", description: "Держит тепло до 8 часов. Кофе останется кофе.", price: 9000, imageUrl: "https://avatars.mds.yandex.net/get-mpic/5332815/img_id4829013495803174133.jpeg/orig", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Кофе в замедленном движении", description: "Медленный налив, аромат до монитора.", price: 0, imageUrl: "https://i.pinimg.com/originals/72/e0/35/72e035579c061f96a9f53d3c10b23cf9.gif", isHighlighted: false, sold: false },

  { id: crypto.randomUUID(), title: "Кофемашина Barista One", description: "Капучино как в любимой кофейне.", price: 155000, imageUrl: "https://cdn.shopify.com/s/files/1/0067/4978/2081/products/barista_one_1_580x.jpg?v=1572111563", isHighlighted: true, sold: false },
  { id: crypto.randomUUID(), title: "Лампа Loft Glow", description: "Тёплый свет и индустриальный вайб.", price: 27000, imageUrl: "https://lovesvet.ru/upload/iblock/ca1/fhkjywcurojbbggre0eo3me5lzgwbzvv.jpg", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Кресло Cloud Chair", description: "Сядешь — и не захочешь вставать.", price: 120000, imageUrl: "https://yandex-images.clstorage.net/O9CB7d365/ccffe0Kq/NKkiKHYjO5rKfx4CINToPVyxuyUDDQCpcVwjG3tcqFzOkiSCCtjvInrhB41nAH7vPaTaGpjq41ert1C3O27yi1Gtd0yjV15-un9PRpBwKZ2dsO_k1zxUiOEcVou7Pw7LifAyBYy6SGX9hdfYEiBKbvgw-fxJjVMAjMGlQtv_dV-FqTNpZTAo_gqMPAfBxNnuDWG-l6B_dskU3BBs3v98GdmS88QPqBgljESHCBCSinjqYXqtfTxRMG6TZTCqzaV-pzjg-BawKt56_d9UMhVbv-yAHscj_hQptc5Sf45cPAlJ8NNX3RlKZ84HJblg4ktbCpL7LI9N4bBcYrWSW8xVX4YpMVq04OhsqJ9-NjDE2-xP4H_loT0ly6Ttod5ML_2IGMBwp40aKbfeNFWpYwLL23jQS2yuvhFT37I1czqOlE9G2lFblZNJj3msfGYz5llf3JIcpxDfFCm3LkIMDw6tWQjQ8dWfOLsnjAYHqbDAaOgLkaj_3_2BEczBhTK7nrXORJiCC1Viys2o7v8EY2TYnz7DfVRgXJc5Va-Sbs4s7Gj4coOl_QnKJ5z29loiM1u7eLH4jT9MA6Ocs0eDST-k3UcosqvEsPg8mQ-NpgPUCv1cIE-F0CzlK5Qe427MvG_aGOLQd90oyHdMBKbYUHApC1vwaU8PvvPQbpA0ckqMdxwH2HBLRLFo7DrNTHYB1dr-nMEu98Af5Ti2LTE_vP2_GKrDEZfdCquX_ERWmNBCCqs6Ihj_ro1R0Q6BRXLIDVS8lPozq8Wwiv0ZrW0W8Zdrr6zxveXzjtY65i4Dff-cP1vIg5NnLAordDxWddiCMJjLC9JLjM8-IGJcoUXQCr90DmZLUWu3cgkMmj8-NFPG6F0-UP1kQb41eoZ98F8s3o-5ScNApc27qtYOBxarYxKYa7izOM_9byHgfgAFw2nO9f4lKjE5trEbzuhdvXaCRXjOnGBeZ3IOVLuEb8GfDN1fo", isHighlighted: true, sold: false },
  { id: crypto.randomUUID(), title: "Северное сияние", description: "Спокойная зелёная вуаль. Очень атмосферно.", price: 0, imageUrl: "https://i.pinimg.com/originals/4e/7b/14/4e7b146523098d77f89a8355c8d3660f.gif", isHighlighted: true, sold: false },

  { id: crypto.randomUUID(), title: "Стол TechDesk XL", description: "Широкая столешница и кабель-менеджмент.", price: 135000, imageUrl: "https://i.pinimg.com/736x/1e/e3/cb/1ee3cb53412d6a7415bee84f15a82a3e.jpg", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Полка Minimal Rack", description: "Металл и дерево — чистая геометрия.", price: 29000, imageUrl: "https://source.unsplash.com/1200x900/?shelf,interior&sig", isHighlighted: false, sold: true },
  { id: crypto.randomUUID(), title: "Постер Neon City", description: "Неон, дождь и киберпанк.", price: 7000, imageUrl: "https://i.pinimg.com/originals/35/8b/53/358b539b1fe285e32573de0a9cd15182.jpg", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Пульсирующий эквалайзер", description: "Звук — это ритм. Ритм — это жизнь.", price: 0, imageUrl: "https://i.pinimg.com/originals/91/66/5c/91665caa560bd7ed13833ddcae325954.gif", isHighlighted: false, sold: false },

  { id: crypto.randomUUID(), title: "Ковер Soft Touch", description: "Босиком ходить — отдельное удовольствие.", price: 64000, imageUrl: "https://hoff.ru/upload/hoff_resize/hoff-images/433/337/7/29107ab308486ede42c0df6602f0e1ae.jpg/1500x1000_85.webp", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Монстера в керамике", description: "Большие глянцевые листья, чистит воздух.", price: 18000, imageUrl: "https://cdn-st2.vigbo.com/u20661/23965/photos/1848044/1000-0cd67d36167db27a0ab4212a853f4913.jpg", isHighlighted: true, sold: false },
  { id: crypto.randomUUID(), title: "Кроссовки AirPulse", description: "Лёгкие и пружинистые. Лимитка.", price: 78000, imageUrl: "https://cdn1.ozone.ru/s3/multimedia-s/c600/6704347492.jpg", isHighlighted: false, sold: false },
  { id: crypto.randomUUID(), title: "Неоновая геометрия", description: "Гладкая анимация полигонов.", price: 0, imageUrl: "https://steamuserimages-a.akamaihd.net/ugc/1794146039224499613/DD185D0FBB187D3053A6D277E41D834643BD2E42/?imw=512&amp;&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=false", isHighlighted: true, sold: false },

  { id: crypto.randomUUID(), title: "Куртка Storm Shell", description: "Мембрана 20К/20К, крой как у супергероя.", price: 99000, imageUrl: "https://i.pinimg.com/736x/7b/e4/d2/7be4d22cce0ee545b1d283bc215bf77f.jpg", isHighlighted: true, sold: false },
  { id: crypto.randomUUID(), title: "Очки Skyline", description: "Поляризация и ультралёгкая оправа.", price: 23000, imageUrl: "https://images.squarespace-cdn.com/content/v1/54fc8146e4b02a22841f4df7/1635684209999-7ZNF7XLAEAP8ZKT8RU71/Art_of_Josan_Gonzales+_14.jpeg", isHighlighted: false, sold: true },
  { id: crypto.randomUUID(), title: "Наручные часы Steel Line", description: "Сталь, сапфир, швейцарский кварц.", price: 165000, imageUrl: "https://cdn-s3.touchofmodern.com/products/000/417/570/b85d7fc18038526b0023bac812503b96_medium.jpg?1460401505", isHighlighted: true, sold: false },
  { id: crypto.randomUUID(), title: "Матрица", description: "Зелёный цифровой дождь — культовая эстетика.", price: 0, imageUrl: "https://i.imgur.com/vpGeEZz.gif", isHighlighted: false, sold: false },
];

// Основной компонент приложения
export default function App() {
  // Инициализация состояния объявлений из localStorage или демо-данных
  // Используем ленивую инициализацию useState с функцией-инициализатором
  const [ads, setAds] = useState(() => {
    try {
      // Пытаемся получить данные из localStorage по ключу LS_KEY
      const raw = localStorage.getItem(LS_KEY);
      // Если данные есть - парсим JSON, иначе используем демо-данные
      return raw ? JSON.parse(raw) : seed;
    } catch {
      // В случае ошибки парсинга также используем демо-данные
      return seed;
    }
  });

  // Состояние для поискового запроса (поисковая строка)
  const [query, setQuery] = useState("");
  // Количество элементов на одной странице пагинации
  const pageSize = 20;
  // Текущая страница пагинации (начинаем с первой страницы)
  const [page, setPage] = useState(1);

  // Эффект для сохранения объявлений в localStorage при любом изменении
  useEffect(() => {
    // Сохраняем текущие объявления в localStorage в формате JSON
    localStorage.setItem(LS_KEY, JSON.stringify(ads));
  }, [ads]); // Зависимость от ads - эффект срабатывает при изменении объявлений

  // Эффект для сброса на первую страницу при изменении поискового запроса
  useEffect(() => setPage(1), [query]); // Зависимость от query

  // Фильтрация объявлений по заголовку с использованием useMemo для оптимизации
  const filtered = useMemo(() => {
    // Нормализуем поисковый запрос: убираем пробелы и приводим к нижнему регистру
    const q = query.trim().toLowerCase();
    // Если запрос пустой - возвращаем все объявления без фильтрации
    if (!q) return ads;
    // Фильтруем объявления: оставляем только те, где заголовок содержит поисковый запрос
    return ads.filter((a) => a.title.toLowerCase().includes(q));
  }, [ads, query]); // Зависимости: ads и query

  // Пагинация - вычисление параметров для отображения страниц
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize)); // Общее количество страниц (минимум 1)
  const start = (page - 1) * pageSize; // Начальный индекс для текущей страницы
  const pageItems = filtered.slice(start, start + pageSize); // Элементы для отображения на текущей странице

  // Обработчик создания нового объявления
  const handleCreate = (payload) => {
    // Добавляем новое объявление в начало списка с уникальным ID
    setAds((prev) => [{ id: crypto.randomUUID(), ...payload }, ...prev]);
    // После создания возвращаемся на первую страницу
    setPage(1);
  };

  // Обработчик обновления существующего объявления
  const handleUpdate = (id, patch) => {
    // Обновляем объявление по ID: находим нужное и применяем изменения
    setAds((prev) => prev.map((ad) => (ad.id === id ? { ...ad, ...patch } : ad)));
  };

  // Обработчик удаления объявления с корректным пересчетом пагинации
  const handleDelete = (id) => {
    setAds((prev) => {
      // Удаляем объявление по ID
      const next = prev.filter((ad) => ad.id !== id);

      // Нормализуем текущий поисковый запрос
      const q = query.trim().toLowerCase();
      // Фильтруем оставшиеся объявления с учетом текущего поискового запроса
      const filteredAfter = q
        ? next.filter((a) => a.title.toLowerCase().includes(q))
        : next;

      // Пересчитываем общее количество страниц после удаления
      const totalPagesAfter = Math.max(1, Math.ceil(filteredAfter.length / pageSize));
      // Корректируем текущую страницу (если удалили последний элемент на странице)
      setPage((p) => Math.min(p, totalPagesAfter));

      // Возвращаем обновленный список объявлений
      return next;
    });
  };

  // Рендер компонента
  return (
    <div className="page">
      {/* Шапка страницы */}
      <header className="page__header">
        <h1>Доска объявлений</h1>
        <p className="muted">React компоненты и пропсы. Инлайн-редактирование + пагинация.</p>

        {/* Панель инструментов с поиском */}
        <div className="toolbar">
          {/* Поле ввода для поиска по заголовкам объявлений */}
          <input
            className="search"
            placeholder="Поиск по заголовку…"
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Обновляем состояние поискового запроса
          />
        </div>
      </header>

      {/* Основное содержимое - сетка объявлений */}
      <main className="board board--cols5">
        {/* Компонент для создания нового объявления */}
        <NewAdCard onCreate={handleCreate} />
        {/* Отображаем объявления текущей страницы */}
        {pageItems.map((ad) => (
          <AdCard 
            key={ad.id} // Уникальный ключ для каждого объявления (обязательно для React)
            ad={ad} // Передаем данные объявления
            onUpdate={handleUpdate} // Передаем обработчик обновления
            onDelete={handleDelete} // Передаем обработчик удаления
          />
        ))}
      </main>

      {/* Подвал с пагинацией */}
      <footer className="pager">
        {/* Кнопка "Назад" - переход на предыдущую страницу */}
        <button
          className="btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))} // Уменьшаем номер страницы, но не меньше 1
          disabled={page === 1} // Отключаем кнопку если это первая страница
        >
          ← Назад
        </button>

        {/* Блок с номерами страниц */}
        <div className="pager__pages" role="tablist" aria-label="Страницы">
          {/* Создаем массив кнопок для каждой страницы */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`pager__btn ${n === page ? "is-active" : ""}`} // Выделяем текущую страницу
              onClick={() => setPage(n)} // Устанавливаем выбранную страницу
              aria-current={n === page ? "page" : undefined} // Accessibility атрибут для текущей страницы
            >
              {n}
            </button>
          ))}
        </div>

        {/* Кнопка "Вперед" - переход на следующую страницу */}
        <button
          className="btn"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))} // Увеличиваем номер страницы, но не больше общего количества
          disabled={page === totalPages} // Отключаем кнопку если это последняя страница
        >
          Вперёд →
        </button>
      </footer>
    </div>
  );
}




