// learning-platform.js — расширенная версия с полноценными уроками
class LearningPlatform {
  constructor() {
    this.currentCourse = null;
    this.currentLesson = 0;
    this.courses = {
      html: this.createHTMLCourse(),
      css: this.createCSSCourse(),
      js: this.createJSCourse(),
      python: this.createPythonCourse()
    };
  }

  // Инициализация
  init() {
    this.renderPlatform();
    this.bindEvents();
  }

  // Шапка + список курсов
  renderPlatform() {
    const username = this.getCurrentUsername();
    const platformHTML = `
      <div class="platform-header">
        <div class="header-left">
          <h1>🚀 Survival Code Academy</h1>
          <p>Изучайте программирование с нуля — шаг за шагом</p>
        </div>
        <div class="header-actions">
          <button class="btn secondary" id="toggle-theme" title="Переключить тему">🌙 Тема</button>
          <button class="btn secondary" id="logout" title="Выйти из аккаунта">🚪 Выйти</button>
        </div>
      </div>

      <div class="course-grid">
        <div class="course-card html" data-course="html">
          <div class="course-icon">🌐</div>
          <h3>HTML Basics</h3>
          <p>Основы создания веб-страниц</p>
          <p><strong>15 уроков</strong></p>
        </div>

        <div class="course-card css" data-course="css">
          <div class="course-icon">🎨</div>
          <h3>CSS Styling</h3>
          <p>Стилизация и макеты</p>
          <p><strong>15 уроков</strong></p>
        </div>

        <div class="course-card js" data-course="js">
          <div class="course-icon">⚡</div>
          <h3>JavaScript</h3>
          <p>Интерактивность и логика</p>
          <p><strong>20 уроков</strong></p>
        </div>

        <div class="course-card python" data-course="python">
          <div class="course-icon">🐍</div>
          <h3>Python</h3>
          <p>Универсальный язык</p>
          <p><strong>20 уроков</strong></p>
        </div>
      </div>

      <div id="lesson-container"></div>
    `;

    const root = document.getElementById('learning-platform');
    root.innerHTML = platformHTML;
  }

  bindEvents() {
    // Один делегированный обработчик на документ
    document.addEventListener('click', (e)=>{
      const card = e.target.closest('.course-card');
      if(card){
        const course = card.dataset.course;
        this.startCourse(course);
        return;
      }

      if(e.target.id === 'next-lesson'){ this.nextLesson(); return; }
      if(e.target.id === 'prev-lesson'){ this.prevLesson(); return; }
      if(e.target.id === 'back-to-courses'){ this.renderPlatform(); return; }

      if(e.target.id === 'toggle-theme'){
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        return;
      }

      if(e.target.id === 'logout'){
        localStorage.removeItem('sessionUser');
        document.getElementById('learning-platform').classList.add('hidden');
        document.getElementById('auth-container').classList.remove('hidden');
        return;
      }
    }, { passive: true });
  }

  getCurrentUsername(){
    const email = localStorage.getItem('sessionUser');
    if(!email) return 'Гость';
    try {
      const users = JSON.parse(localStorage.getItem('users')||'{}');
      return users[email]?.username || 'Пользователь';
    } catch(e){ return 'Пользователь'; }
  }

  startCourse(courseName){
    this.currentCourse = courseName;
    this.currentLesson = 0;
    this.renderLesson();
  }

  renderLesson(){
    const course = this.courses[this.currentCourse];
    const lesson = course.lessons[this.currentLesson];

    const lessonHTML = `
      <div class="lesson-content">
        <h2>${course.title} — Урок ${this.currentLesson+1} из ${course.lessons.length}: ${lesson.title}</h2>
        <div class="lesson-text">${lesson.content}</div>
        ${lesson.example ? `<div class="code-editor">${lesson.example}</div>` : ''}
        <div class="navigation">
          <button class="btn secondary" id="back-to-courses">← Назад к курсам</button>
          <div>
            ${this.currentLesson>0 ? `<button class="btn secondary" id="prev-lesson">← Предыдущий</button>` : ''}
            <button class="btn primary" id="next-lesson">${this.currentLesson < course.lessons.length-1 ? 'Следующий →' : 'Завершить курс'}</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('lesson-container').innerHTML = lessonHTML;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextLesson(){
    const course = this.courses[this.currentCourse];
    if(this.currentLesson < course.lessons.length-1){
      this.currentLesson++;
      this.renderLesson();
    } else {
      this.renderPlatform();
      // Можно добавить тост "Курс завершён!"
    }
  }
  prevLesson(){
    if(this.currentLesson>0){ this.currentLesson--; this.renderLesson(); }
  }

  // ===== КУРСЫ =====
  createHTMLCourse(){
    const lessons = [
      {
        title: "1. Введение в HTML",
        content: `HTML — язык разметки, задающий структуру страницы. Документ начинается с <!DOCTYPE html>, внутри <html> — <head> и <body>. 
Упражнение: создайте файл index.html с минимальной разметкой и заголовком страницы.`,
        example: `&lt;!DOCTYPE html&gt;
&lt;html lang="ru"&gt;
  &lt;head&gt;
    &lt;meta charset="utf-8"&gt;
    &lt;title&gt;Моя страница&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Привет&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;`
      },
      {
        title: "2. Заголовки и абзацы",
        content: `Заголовки <h1>-<h6> задают иерархию, абзацы — <p>. Заголовки важны для структуры и SEO. 
Упражнение: на странице добавьте <h1>, <h2> и три абзаца.`,
        example: `&lt;h1&gt;Главный заголовок&lt;/h1&gt;
&lt;h2&gt;Подзаголовок&lt;/h2&gt;
&lt;p&gt;Первый абзац.&lt;/p&gt;
&lt;p&gt;Второй абзац.&lt;/p&gt;`
      },
      {
        title: "3. Списки (ul/ol/li)",
        content: `Неупорядоченные списки — <ul>, упорядоченные — <ol>. Каждый элемент внутри — <li>. 
Упражнение: сделайте список покупок (ul) и порядок шагов (ol).`,
        example: `&lt;ul&gt;
  &lt;li&gt;Хлеб&lt;/li&gt;
  &lt;li&gt;Молоко&lt;/li&gt;
&lt;/ul&gt;

&lt;ol&gt;
  &lt;li&gt;Открыть ноут&lt;/li&gt;
  &lt;li&gt;Написать код&lt;/li&gt;
&lt;/ol&gt;`
      },
      {
        title: "4. Ссылки и якоря",
        content: `Ссылка — <a href="URL">текст</a>. Для открытия в новой вкладке добавьте target="_blank" rel="noopener". 
Упражнение: создайте ссылку на MDN и на свою страницу (якорь).`,
        example: `&lt;a href="https://developer.mozilla.org" target="_blank" rel="noopener"&gt;MDN&lt;/a&gt;
&lt;a href="#section1"&gt;Перейти к секции&lt;/a&gt;`
      },
      {
        title: "5. Изображения и атрибут alt",
        content: `Тег <img src="..." alt="описание"> вставляет изображение. Атрибут alt обязателен для доступности. 
Упражнение: вставьте картинку и задайте корректный alt.`,
        example: `&lt;img src="cat.jpg" alt="Серый кот, сидит на диване"&gt;`
      },
      {
        title: "6. Формы: input, textarea, select",
        content: `Форма собирает данные: <form action method>. Поля: <input>, <textarea>, <select>. Атрибут name обязателен на сервере. 
Упражнение: создайте форму с именем, email и кнопкой отправить.`,
        example: `&lt;form action="/submit" method="post"&gt;
  &lt;input type="text" name="name" placeholder="Имя"&gt;
  &lt;input type="email" name="email" placeholder="Email"&gt;
  &lt;button type="submit"&gt;Отправить&lt;/button&gt;
&lt;/form&gt;`
      },
      {
        title: "7. Полезные атрибуты input (type и required)",
        content: `input поддерживает type=email/date/number/password и атрибут required для обязательного заполнения. 
Упражнение: добавьте email-поле с required и проверкой типа.`,
        example: `&lt;input type="email" name="email" required placeholder="email@example.com"&gt;`
      },
      {
        title: "8. Семантические теги HTML5",
        content: `Теги header, nav, main, article, section, footer улучшают структуру и помогают SEO. 
Упражнение: разметьте простую страницу с header, nav и main->article.`,
        example: `&lt;header&gt;Шапка&lt;/header&gt;
&lt;nav&gt;Меню&lt;/nav&gt;
&lt;main&gt;&lt;article&gt;Статья&lt;/article&gt;&lt;/main&gt;
&lt;footer&gt;Подвал&lt;/footer&gt;`
      },
      {
        title: "9. Таблицы (table, tr, th, td)",
        content: `Таблицы используют <table>, строки <tr>, заголовки <th>, ячейки <td>. Для доступности добавляйте <caption> и scope. 
Упражнение: создайте таблицу 3x2 с заголовком столбцов.`,
        example: `&lt;table&gt;
  &lt;caption&gt;Контакты&lt;/caption&gt;
  &lt;tr&gt;&lt;th&gt;Имя&lt;/th&gt;&lt;th&gt;Телефон&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Аня&lt;/td&gt;&lt;td&gt;+7...&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;`
      },
      {
        title: "10. Встраивание мультимедиа (audio, video)",
        content: `Теги <audio> и <video> поддерживают атрибут controls, src и source. Для кроссбраузерности — несколько source. 
Упражнение: добавьте видео с контролами.`,
        example: `&lt;video controls width="320"&gt;
  &lt;source src="clip.mp4" type="video/mp4"&gt;
  Ваш браузер не поддерживает видео.
&lt;/video&gt;`
      },
      {
        title: "11. Атрибуты data- и ARIA для доступности",
        content: `data-* — пользовательские атрибуты для скриптов. ARIA-атрибуты улучшают работу с экранными читалками (aria-label, role). 
Упражнение: добавьте aria-label к кнопке.`,
        example: `&lt;button aria-label="Закрыть окно"&gt;✕&lt;/button&gt;`
      },
      {
        title: "12. Инлайновые и блочные элементы",
        content: `Инлайновые элементы (span, a, img) не создают новые строки; блочные (div, p, h1) — создают. Это важно для верстки. 
Упражнение: оберните слово в span и примените класс для стилизации (CSS).`,
        example: `&lt;p&gt;Это &lt;span class="highlight"&gt;важное&lt;/span&gt; слово.&lt;/p&gt;`
      },
      {
        title: "13. Работа с ссылками: target, rel, tel, mailto",
        content: `target="_blank" открывает в новой вкладке; rel="noopener noreferrer" — безопасность. Ссылки можно делать на телефон и email. 
Упражнение: добавьте ссылку mailto и телефонную ссылку.`,
        example: `&lt;a href="mailto:hello@example.com"&gt;Написать&lt;/a&gt;
&lt;a href="tel:+71234567890"&gt;Позвонить&lt;/a&gt;`
      },
      {
        title: "14. Формы: валидация браузера и pattern",
        content: `HTML позволяет базовую валидацию: required, minlength, maxlength, pattern (регулярки). 
Упражнение: добавьте input с pattern для номера (например, 10 цифр).`,
        example: `&lt;input type="text" pattern="\\d{10}" title="10 цифр" required&gt;`
      },
      {
        title: "15. SEO-основы: meta-теги и title",
        content: `В <head> указывайте <title>, <meta name="description">, viewport для мобильной адаптивности. Это важно для индексации и отображения в соцсетях. 
Упражнение: добавьте meta description и viewport в head.`,
        example: `&lt;meta name="description" content="Короткое описание страницы"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;`
      }
    ];
    return { title: "HTML Basics", lessons };
  }

  createCSSCourse(){
    const lessons = [
      {
        title: "1. Введение в CSS и подключение",
        content: `CSS управляет внешним видом. Подключение: внешний файл &lt;link rel="stylesheet" href="style.css"&gt; или &lt;style&gt;в head&lt;/style&gt;. 
Упражнение: подключите style.css и задайте body{font-family: sans-serif}.`,
        example: `&lt;link rel="stylesheet" href="style.css"&gt; /* style.css */\nbody{font-family: Inter, sans-serif;}`
      },
      {
        title: "2. Селекторы: тег, класс, id",
        content: `Селекторы выбирают элементы: tag, .class, #id. Комбинации и вложенные селекторы дают точность. 
Упражнение: создайте .card и примените к div.`,
        example: `.card{padding:12px;border:1px solid #ddd;border-radius:8px;}`
      },
      {
        title: "3. Цвета, шрифты и размеры",
        content: `Свойства: color, background-color, font-size, font-family. Используйте rem/em для адаптивности. 
Упражнение: сделайте заголовок 24px и тело 16px.`,
        example: `h1{font-size:24px}\nbody{font-size:16px;color:#222}`
      },
      {
        title: "4. Блочная модель: margin, padding, border",
        content: `Каждый элемент имеет content → padding → border → margin. margin складываются между блоками (collapsing). 
Упражнение: создайте .box с margin и padding, посмотрите результат.`,
        example: `.box{margin:16px;padding:12px;border:1px solid #ccc}`
      },
      {
        title: "5. Display: block, inline, inline-block, none",
        content: `display управляет поведением элемента. inline не принимает width/height, block — принимает. none скрывает элемент. 
Упражнение: измените display у span на inline-block и задайте ширину.`,
        example: `.inline-block{display:inline-block;width:120px}`
      },
      {
        title: "6. Position: static, relative, absolute, fixed",
        content: `position управляет позиционированием. relative смещает относительно нормального места; absolute — относительно ближайшего позиционированного предка. 
Упражнение: создайте блок с position:relative и вложьте absolute элемент.`,
        example: `.wrapper{position:relative}\n.child{position:absolute;top:10px;right:10px}`
      },
      {
        title: "7. Flexbox: контейнер и оси",
        content: `Flexbox — для одномерной раскладки. Основные: display:flex; justify-content; align-items. 
Упражнение: сделайте горизонтальное меню с равными отступами.`,
        example: `.row{display:flex;gap:12px;justify-content:space-between;align-items:center}`
      },
      {
        title: "8. Flex: порядок и перенос",
        content: `flex-wrap позволяет переносить элементы, order меняет порядок визуально. 
Упражнение: сделайте контейнер с wrap и проверьте поведение на узком экране.`,
        example: `.wrap{display:flex;flex-wrap:wrap}`
      },
      {
        title: "9. Grid: областная сетка",
        content: `CSS Grid — двумерная раскладка. grid-template-columns/rows, gap, grid-area. 
Упражнение: создайте сетку 3 столбца и разместите карточки.`,
        example: `.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}`
      },
      {
        title: "10. Псевдоклассы и псевдоэлементы",
        content: `:hover, :focus, :active — состояния; ::before и ::after — генерация контента. 
Упражнение: добавьте ::before с иконкой к .badge.`,
        example: `.badge::before{content:"★";margin-right:6px}`
      },
      {
        title: "11. Трансформации и анимации",
        content: `transform (translate, rotate, scale) и transition для плавности. @keyframes — анимация. 
Упражнение: добавьте hover-анимацию, изменяющую translateY и opacity.`,
        example: `.btn{transition:transform .2s}\n.btn:hover{transform:translateY(-4px)}`
      },
      {
        title: "12. Медиазапросы: адаптивность",
        content: `@media (max-width: 600px) { ... } — менять макет под ширину экрана. Используйте mobile-first подход. 
Упражнение: спрячьте боковую панель на экранах <600px.`,
        example: `@media (max-width:600px){.sidebar{display:none}}`
      },
      {
        title: "13. Работа с шрифтами (web fonts)",
        content: `Используйте @font-face или подключайте Google Fonts. Обращайте внимание на fallback. 
Упражнение: подключите шрифт из Google Fonts и примените к body.`,
        example: `/* В head */\n&lt;link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet"&gt;\n/* В CSS */\nbody{font-family:'Inter',system-ui,sans-serif}`
      },
      {
        title: "14. CSS-переменные и их использование",
        content: `--var: value; используются через var(--var). Удобно для тем и повторных значений. 
Упражнение: создайте переменные --primary и --bg и примените.`,
        example: `:root{--primary:#4ea1ff;--bg:#0b0f14}\n.btn{background:var(--primary)}`
      },
      {
        title: "15. Организация стилей и методологии (BEM)",
        content: `BEM — блок__элемент--модификатор. Помогает структурировать классы и избегать конфликтов. 
Упражнение: переименуйте классы для карточки в стиле .card .card__title .card--small.`,
        example: `/* пример */\n.card{padding:12px}\n.card__title{font-weight:700}\n.card--small{font-size:14px}`
      }
    ];
    return { title: "CSS Styling", lessons };
  }

  createJSCourse(){
    const lessons = [
      {
        title: "1. Введение и подключение скрипта",
        content: `JavaScript добавляет поведение. Подключать можно внизу body или в head с defer. 
Упражнение: подключите app.js с defer и выведите console.log('Loaded').`,
        example: `&lt;script src="app.js" defer&gt;&lt;/script&gt;\n// app.js\nconsole.log('Loaded')`
      },
      {
        title: "2. Переменные: let, const, var",
        content: `let — изменяемая переменная, const — константа, var — устаревшая (function-scope). 
Упражнение: объявите const PI и let counter.`,
        example: `const PI = 3.14;\nlet counter = 0;`
      },
      {
        title: "3. Типы данных и typeof",
        content: `Примитивы: number, string, boolean, null, undefined, symbol, bigint; объекты — Object, Array, Function. Используйте typeof для проверки. 
Упражнение: проверьте typeof для разных значений.`,
        example: `console.log(typeof 42, typeof 'hi', typeof null); // "number" "string" "object"`
      },
      {
        title: "4. Операторы и выражения",
        content: `Арифметические + - * / %, строковая конкатенация, логические && ||, сравнения == и === (строгое). 
Упражнение: сравните 0 == '0' и 0 === '0'.`,
        example: `console.log(0 == '0');\nconsole.log(0 === '0');`
      },
      {
        title: "5. Условия: if / else / switch",
        content: `if/else для ветвления; switch полезен при множественных значениях. 
Упражнение: напишите проверку возраста >=18.`,
        example: `const age = 20;\nif(age >= 18){ console.log('Взрослый'); } else { console.log('Младше'); }`
      },
      {
        title: "6. Функции: объявления и стрелочные",
        content: `function foo(){}, const foo = () => {}. Стрелочные функции не имеют собственного this. 
Упражнение: сделайте функцию sum(a,b).`,
        example: `function sum(a,b){ return a + b; }\nconst sum2 = (a,b) => a + b;`
      },
      {
        title: "7. Массивы: создание и базовые методы",
        content: `Создайте массив, используйте push/pop, shift/unshift. Работа с length. 
Упражнение: добавьте элемент и выведите последний.`,
        example: `const arr = [1,2,3];\narr.push(4); console.log(arr[arr.length-1]);`
      },
      {
        title: "8. Перебор массивов: for, for..of, forEach, map",
        content: `for..of для значений, forEach для побочных эффектов, map возвращает новый массив. 
Упражнение: умножьте все элементы на 2 через map.`,
        example: `const doubled = [1,2,3].map(x => x*2);`
      },
      {
        title: "9. Объекты: свойства и доступ",
        content: `Объект — набор ключ:значение. Доступ через dot или bracket. 
Упражнение: создайте user{name,age} и выведите name.`,
        example: `const user = {name:'Иван', age:30};\nconsole.log(user.name);`
      },
      {
        title: "10. Методы объектов и this",
        content: `Метод — функция в объекте. this — ссылка на объект при вызове через obj.method(). 
Упражнение: добавьте метод greet в user.`,
        example: `const user = {name:'Аня', greet(){console.log('Привет, '+this.name)} }; user.greet();`
      },
      {
        title: "11. Промисы: новый подход к асинхронности",
        content: `Promise — объект состояния (pending/fulfilled/rejected). then/catch для обработки. 
Упражнение: создайте промис, который резолвится через setTimeout.`,
        example: `const p = new Promise(res => setTimeout(()=>res('ok'), 500));\np.then(console.log);`
      },
      {
        title: "12. async/await",
        content: `async function позволяет писать асинхронный код синхронно с await. Оборачивайте в try/catch. 
Упражнение: сделайте async функцию, которая await delay(300).`,
        example: `const delay = ms => new Promise(r=>setTimeout(r,ms));\nasync function run(){ await delay(300); console.log('done'); }\nrun();`
      },
      {
        title: "13. Работа с DOM: querySelector и textContent",
        content: `document.querySelector и querySelectorAll возвращают элементы. textContent и innerHTML меняют содержимое. 
Упражнение: найдите элемент по id и поменяйте текст.`,
        example: `document.getElementById('title').textContent = 'Новый заголовок';`
      },
      {
        title: "14. Создание элементов и append",
        content: `document.createElement, element.appendChild/append позволяют добавлять в DOM. 
Упражнение: создайте li и добавьте в ul.`,
        example: `const li = document.createElement('li'); li.textContent = 'Пункт'; document.querySelector('ul').append(li);`
      },
      {
        title: "15. События: addEventListener",
        content: `addEventListener('click', handler) — привязка обработчика. event содержит инфо (target, preventDefault). 
Упражнение: повесьте клик на кнопку и покажите alert.`,
        example: `document.querySelector('button').addEventListener('click', ()=>alert('Нажали'));`
      },
      {
        title: "16. Работа с формами и FormData",
        content: `FormData собирает поля формы, удобно для отправки. form.addEventListener('submit', e=>{ e.preventDefault() }) — предотвратить отправку. 
Упражнение: перед отправкой формы соберите FormData и выведите значения.`,
        example: `const form = document.querySelector('form');\nform.addEventListener('submit', e=>{ e.preventDefault(); const fd = new FormData(form); console.log(...fd.entries()) });`
      },
      {
        title: "17. LocalStorage: сохранение данных в браузере",
        content: `localStorage.setItem/getItem для хранения строк. Для объектов используйте JSON.stringify/parse. 
Упражнение: сохраняйте имя пользователя при вводе.`,
        example: `localStorage.setItem('name','Иван');\nconsole.log(localStorage.getItem('name'));`
      },
      {
        title: "18. Fetch API: запросы к серверу",
        content: `fetch(url).then(r=>r.json()) — делать HTTP-запросы. Используйте async/await для удобства. 
Упражнение: загрузите https://jsonplaceholder.typicode.com/todos/1 и выведите в консоль.`,
        example: `async function load(){ const r = await fetch('https://jsonplaceholder.typicode.com/todos/1'); const data = await r.json(); console.log(data); }`
      },
      {
        title: "19. Обработка ошибок и try/catch",
        content: `try{...}catch(e){...} — перехват исключений, важно при сетевых запросах и парсинге. 
Упражнение: оберните fetch в try/catch и покажите сообщение об ошибке.`,
        example: `try{ JSON.parse('invalid') } catch(e){ console.error('Ошибка парсинга') }`
      },
      {
        title: "20. Итоговый мини-проект: TODO-лист",
        content: `Соберите простое приложение: ввод, кнопка добавить, список, сохранение в localStorage. 
Упражнение: реализуйте добавление элемента в список и сохранение в localStorage.`,
        example: `// Пример упрощённой логики
const todos = JSON.parse(localStorage.getItem('todos')||'[]');
function addTodo(text){
  todos.push({text, done:false});
  localStorage.setItem('todos', JSON.stringify(todos));
}`
      }
    ];
    return { title: "JavaScript", lessons };
  }

  createPythonCourse(){
    const lessons = [
      {
        title: "1. Установка и запуск Python",
        content: `Установите Python 3.x. В терминале: python --version или python3 --version. Выполняйте файлы через python file.py. 
Упражнение: создайте hello.py и выведите "Привет".`,
        example: `# hello.py\nprint("Привет")`
      },
      {
        title: "2. Переменные и типы",
        content: `Переменная создаётся присваиванием. Основные типы: int, float, str, bool. Не нужно объявлять тип явно. 
Упражнение: объявите name, age и выведите с f-строкой.`,
        example: `name = "Иван"\nage = 25\nprint(f"Имя: {name}, возраст: {age}")`
      },
      {
        title: "3. Операторы и выражения",
        content: `Арифметика + - * / // % **. Операторы сравнения: == != > < >= <=. 
Упражнение: посчитайте a//b и a%b.`,
        example: `a = 7\nb = 3\nprint(a//b, a%b, a**b)`
      },
      {
        title: "4. Условные операторы if/elif/else",
        content: `if условие: ... elif другое: ... else: ... . Отступы обязательны (обычно 4 пробела). 
Упражнение: напишите проверку чёт/нечёт для числа.`,
        example: `n = 5\nif n%2==0:\n    print('Чётное')\nelse:\n    print('Нечётное')`
      },
      {
        title: "5. Циклы for и while",
        content: `for i in range(5): ... — перебор диапазона. while условие: ... — цикл по условию. 
Упражнение: выведите числа 0..4 двумя способами.`,
        example: `for i in range(5):\n    print(i)\n\ni=0\nwhile i<5:\n    print(i)\n    i+=1`
      },
      {
        title: "6. Списки (list) и операции",
        content: `Списки изменяемы: append, pop, insert, slicing. 
Упражнение: создайте список, добавьте элемент и сделайте срез первых двух элементов.`,
        example: `nums = [1,2,3]\nnums.append(4)\nprint(nums[0:2])`
      },
      {
        title: "7. Кортежи и множества",
        content: `tuple — неизменяемый список, set — коллекция уникальных элементов. 
Упражнение: создайте set из [1,1,2] и посмотрите длину.`,
        example: `t = (1,2)\ns = set([1,1,2])\nprint(len(s))`
      },
      {
        title: "8. Словари (dict)",
        content: `dict — пара ключ:значение. Доступ через dict[key] или dict.get(key, default). 
Упражнение: создайте user={'name':..., 'age':...} и выведите name.`,
        example: `user = {'name':'Оля','age':28}\nprint(user['name'])`
      },
      {
        title: "9. Функции: def и return",
        content: `def name(params): ... return value. Функции помогают структурировать код. 
Упражнение: напишите функцию add(a,b) и вызовите её.`,
        example: `def add(a,b):\n    return a+b\nprint(add(2,3))`
      },
      {
        title: "10. Аргументы и значения по умолчанию",
        content: `Функции поддерживают позиционные и именованные аргументы, а также значения по умолчанию. 
Упражнение: сделайте функцию greet(name='Гость').`,
        example: `def greet(name='Гость'):\n    print('Привет,', name)\ngreet()`
      },
      {
        title: "11. Работа с файлами (open, with)",
        content: `with open('file','w', encoding='utf-8') as f: f.write(...). with обеспечивает закрытие файла автоматически. 
Упражнение: запишите строку в файл и прочитайте её.`,
        example: `with open('data.txt','w',encoding='utf-8') as f:\n    f.write('Привет')\nwith open('data.txt','r',encoding='utf-8') as f:\n    print(f.read())`
      },
      {
        title: "12. Исключения: try/except/finally",
        content: `try: ... except Exception as e: ... finally: ... — обработка ошибок. 
Упражнение: поймайте ZeroDivisionError при делении на ноль.`,
        example: `try:\n    x = 1/0\nexcept ZeroDivisionError:\n    print('Деление на ноль')`
      },
      {
        title: "13. Модули и импорт",
        content: `import math, from datetime import date. Разбивайте код на модули для переиспользования. 
Упражнение: импортируйте math и вычислите sqrt(9).`,
        example: `import math\nprint(math.sqrt(9))`
      },
      {
        title: "14. Списковые включения (list comprehensions)",
        content: `Удобный способ создать список: [x*2 for x in range(5) if x%2==0]. 
Упражнение: создайте список квадратов чисел 0..4.`,
        example: `squares = [x*x for x in range(5)]\nprint(squares)`
      },
      {
        title: "15. Генераторы и yield",
        content: `yield в функции создаёт генератор, который лениво выдаёт значения. Полезно для больших последовательностей. 
Упражнение: напишите генератор чисел от 0 до n-1.`,
        example: `def gen(n):\n    for i in range(n):\n        yield i\nfor x in gen(3): print(x)`
      },
      {
        title: "16. Работа с датой и временем (datetime)",
        content: `from datetime import datetime, date. datetime.now(), strftime для форматирования. 
Упражнение: выведите текущую дату в формате dd.mm.YYYY.`,
        example: `from datetime import datetime\nprint(datetime.now().strftime('%d.%m.%Y'))`
      },
      {
        title: "17. Работа с JSON (json.dumps / loads)",
        content: `Модули json: dumps превращает объект в строку, loads — обратно. Полезно при API. 
Упражнение: сериализуйте dict в строку и распарсите обратно.`,
        example: `import json\ndata = {'name':'Иван'}\ns = json.dumps(data)\nprint(json.loads(s))`
      },
      {
        title: "18. Виртуальные окружения и pip",
        content: `venv создаёт изолированное окружение: python -m venv venv, затем pip install package. 
Упражнение: создайте venv и посмотрите pip list (локально).`,
        example: `# В терминале:\n# python -m venv venv\n# source venv/bin/activate (Linux/Mac) or venv\\Scripts\\activate (Windows)`
      },
      {
        title: "19. Классы и ООП: class, __init__, методы",
        content: `Класс — шаблон для объектов. __init__ — конструктор, self — ссылка на экземпляр. 
Упражнение: реализуйте класс Person с атрибутом name и методом hello().`,
        example: `class Person:\n    def __init__(self,name):\n        self.name = name\n    def hello(self):\n        print('Привет,', self.name)\np = Person('Оля')\np.hello()`
      },
      {
        title: "20. Итог: мини-проект — консольное приложение",
        content: `Соберите небольшую программу: меню, ввод от пользователя, базовые операции. Это закрепит основы. 
Упражнение: напишите калькулятор с операциями + - * / и обработкой деления на 0.`,
        example: `def calc(a,b,op):\n    if op=='+': return a+b\n    if op=='-': return a-b\n    if op=='*': return a*b\n    if op=='/': return a/b if b!=0 else None\nprint(calc(4,2,'/'))`
      }
    ];
    return { title: "Python", lessons };
  }
}

// Инициализация единожды
window.learningPlatformInstance = new LearningPlatform();
