const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const cors = require("cors");

const app = express();

// Middleware для разбора JSON
app.use(bodyParser.json());

// Подключение маршрутов
app.use(router);
app.use(cors());

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то сломалось!');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;
