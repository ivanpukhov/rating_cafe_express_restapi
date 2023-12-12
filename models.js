const Sequelize = require('sequelize');

// Настройка подключения к SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'path/to/your/database.db' // Укажите путь к вашему файлу .db
});

// Определение модели User
const User = sequelize.define('User', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Определение модели Establishment
const Establishment = sequelize.define('Establishment', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    photo: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

// Определение модели Review
const Review = sequelize.define('Review', {
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    comment: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

// Отношения между моделями
User.hasMany(Review);       // Пользователь может иметь множество отзывов
Establishment.hasMany(Review, { as: 'reviews' });
Review.belongsTo(Establishment, { as: 'reviews' });

// Синхронизация с базой данных
sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
});

module.exports = { User, Establishment, Review, sequelize };
