const { Book, Category, Author, Publisher } = require('../models');
const { Op } = require('sequelize');

const homeController = {
  // Mostrar página principal con listado de libros
  async index(req, res) {
    try {
      const { title, categories } = req.query;
      let whereConditions = {};

      // Filtrar por título
      if (title && title.trim()) {
        whereConditions.title = {
          [Op.like]: `%${title.trim()}%`
        };
      }

      // Filtrar por categorías
      let categoryFilter = {};
      if (categories && categories.length > 0) {
        const categoryIds = Array.isArray(categories) ? categories : [categories];
        categoryFilter.id = {
          [Op.in]: categoryIds
        };
      }

      const books = await Book.findAll({
        where: whereConditions,
        include: [
          { model: Category, as: 'category', where: categoryFilter },
          { model: Author, as: 'author' },
          { model: Publisher, as: 'publisher' }
        ],
        order: [['createdAt', 'DESC']]
      });

      const allCategories = await Category.findAll({
        order: [['name', 'ASC']]
      });

      res.render('home/index', {
        title: 'BookApp - Inicio',
        books,
        categories: allCategories,
        filters: { title, categories: categories || [] },
        layout: 'main'
      });
    } catch (error) {
      console.error('Error en home:', error);
      res.status(500).send('Error al cargar la página principal');
    }
  },

  // Mostrar detalle de un libro
  async showDetail(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id, {
        include: [
          { model: Category, as: 'category' },
          { model: Author, as: 'author' },
          { model: Publisher, as: 'publisher' }
        ]
      });

      if (!book) {
        req.flash('error', 'Libro no encontrado');
        return res.redirect('/');
      }

      res.render('book-detail', {
        title: book.title,
        book,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error al mostrar detalle:', error);
      res.status(500).send('Error al cargar el detalle del libro');
    }
  }
};

module.exports = homeController;