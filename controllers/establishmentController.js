const { Establishment, Review, sequelize } = require('./../models');
const { Sequelize } = require('sequelize');

const establishmentController = {
    // Создание нового заведения
    async create(req, res) {
        try {
            const { name, address, phoneNumber, photo } = req.body;
            const newEstablishment = await Establishment.create({ name, address, phoneNumber, photo });
            res.status(201).json(newEstablishment);
        } catch (error) {
            res.status(500).send('Ошибка при создании заведения');
        }
    },

    // Получение списка всех заведений
    async getAll(req, res) {
        try {
            const establishments = await Establishment.findAll({
                include: [{
                    model: Review,
                    as: 'reviews',
                    attributes: ['id', 'rating', 'comment', 'createdAt', 'UserId']
                }],
                attributes: {
                    include: [
                        [Sequelize.fn('AVG', Sequelize.col('reviews.rating')), 'averageRating']
                    ]
                },
                group: ['Establishment.id', 'reviews.id']
            });

            establishments.forEach(establishment => {
                if (establishment.dataValues.averageRating) {
                    establishment.dataValues.averageRating = parseFloat(establishment.dataValues.averageRating).toFixed(2);
                }
            });

            res.status(200).json(establishments);
        } catch (error) {
            res.status(500).send('Ошибка при получении списка заведений: ' + error.message);
        }
    },


    // Получение информации о конкретном заведении
    async getById(req, res) {
        try {
            const { id } = req.params;
            const establishment = await Establishment.findByPk(id, {
                include: [{
                    model: Review,
                    as: 'reviews',
                    attributes: ['id', 'rating', 'comment', 'createdAt']
                }],
                attributes: {
                    include: [[Sequelize.fn('AVG', Sequelize.col('reviews.rating')), 'averageRating']]
                },
                group: ['Establishment.id']
            });

            if (!establishment) {
                return res.status(404).send('Заведение не найдено');
            }

            establishment.dataValues.averageRating = parseFloat(establishment.dataValues.averageRating).toFixed(2);

            res.status(200).json(establishment);
        } catch (error) {
            res.status(500).send('Ошибка при получении информации о заведении');
        }
    },

    // Обновление данных заведения
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, address, phoneNumber, photo } = req.body;
            const establishment = await Establishment.findByPk(id);

            if (!establishment) {
                return res.status(404).send('Заведение не найдено');
            }

            establishment.update({ name, address, phoneNumber, photo });
            res.status(200).json(establishment);
        } catch (error) {
            res.status(500).send('Ошибка при обновлении данных заведения');
        }
    },

    // Удаление заведения
    async delete(req, res) {
        try {
            const { id } = req.params;
            const establishment = await Establishment.findByPk(id);

            if (!establishment) {
                return res.status(404).send('Заведение не найдено');
            }

            await establishment.destroy();
            res.status(200).send('Заведение удалено');
        } catch (error) {
            res.status(500).send('Ошибка при удалении заведения');
        }
    },

    // Добавление отзыва к заведению
    async addReview(req, res) {
        try {
            const { id } = req.params;
            const { rating, comment, userId } = req.body;

            const establishment = await Establishment.findByPk(id);
            if (!establishment) {
                return res.status(404).send('Заведение не найдено');
            }

            const newReview = await Review.create({
                rating,
                comment,
                EstablishmentId: id,
                UserId: userId
            });

            res.status(201).json(newReview);
        } catch (error) {
            res.status(500).send('Ошибка при добавлении отзыва');
        }
    },

    // Обновление отзыва
    async updateReview(req, res) {
        try {
            const { reviewId } = req.params;
            const { rating, comment } = req.body;

            const review = await Review.findByPk(reviewId);
            if (!review) {
                return res.status(404).send('Отзыв не найден');
            }

            review.update({ rating, comment });
            res.status(200).json(review);
        } catch (error) {
            res.status(500).send('Ошибка при обновлении отзыва');
        }
    },

    // Удаление отзыва
    async deleteReview(req, res) {
        try {
            const { reviewId } = req.params;

            const review = await Review.findByPk(reviewId);
            if (!review) {
                return res.status(404).send('Отзыв не найден');
            }

            await review.destroy();
            res.status(200).send('Отзыв удален');
        } catch (error) {
            res.status(500).send('Ошибка при удалении отзыва');
        }
    }
};

module.exports = establishmentController;
