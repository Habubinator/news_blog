require('dotenv').config(); // Загрузить переменные окружения из .env

const express = require('express'); // Фреймворк для створення веб-додатків
const app = express(); // Ініціалізація додатку Express
const session = require('express-session');
const path = require('path'); // Модуль для роботи з шляхами
const bodyParser = require('body-parser'); // Модуль для парсингу тіла запитів
const { Pool } = require('pg'); // Модуль для роботи з PostgreSQL

app.use(session({
    secret: process.env.SESSION_SECRET, // Секретний ключ для підпису сеансу з .env
    resave: false, // Не зберігати сеанс, якщо він не змінювався
    saveUninitialized: true, // Зберігати сеанс, навіть якщо він не має данних
}));

// Підключення body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Налаштування підключення до бази даних PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Проверка подключения к базе данных
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to database');
    release();
});

// Запуск сервера на порту 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

// Маршрут для перевірки логіну та пароля
app.post('/login', (req, res) => {
    const { login, password } = req.body;
    console.log('Login attempt:', login);
    pool.query('SELECT id FROM users WHERE username = $1 AND password = $2', [login, password], (error, results) => {
        if (error) {
            console.error('Database query error', error.stack);
            res.status(500).json({ success: false, message: 'Помилка сервера' });
        } else {
            if (results.rows.length > 0) {
                const userId = results.rows[0].id; // Отримання id користувача з результатів запиту
                req.session.userId = userId; // Збереження id користувача у сеансі
                res.status(200).json({ success: true, message: 'Логін успішний' });
                console.log('Login successful for user ID:', userId);
            } else {
                res.status(401).json({ success: false, message: 'Неправильний логін або пароль' });
                console.log('Login failed: incorrect login or password');
            }
        }
    });
});

// Налаштування статичних файлів
app.use(express.static(path.join(__dirname, 'public')));

//INSERT INTO users (id, email, username, password, rating, isBanned, isAdmin) VALUES (1, 'example@example.com', 'user1', 'password123', 100, FALSE, FALSE);
