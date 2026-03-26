const { Book, Category, Author, Publisher } = require('../models');
const { Op } = require('sequelize');

const homeController = {
  // Mostrar página principal con listado de libros
  async index(req, res) {
    try {
      console.log('🏠 Cargando página principal...');
    
      const { title, categories } = req.query;
      let whereConditions = {};

      if (title && title.trim()) {
        whereConditions.title = {
          [Op.like]: `%${title.trim()}%`
        };
      }

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
          { model: Category, as: 'category', required: false },
          { model: Author, as: 'author', required: false },
          { model: Publisher, as: 'publisher', required: false }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      const allCategories = await Category.findAll({
        order: [['name', 'ASC']]
      });

      console.log(`📚 Libros encontrados: ${books.length}`);
      books.forEach(book => {
      console.log(`- ${book.title}: Cat:${book.category?.name || 'N/A'}, Aut:${book.author?.name || 'N/A'}, Pub:${book.publisher?.name || 'N/A'}`);
      });
      console.log(`🏷️ Categorías disponibles: ${allCategories.length}`);

      res.render('home/index', {
        title: 'BookApp - Inicio',
        books: books,
        categories: allCategories,
        filters: { title: title || '', categories: categories || [] },
        layout: 'main'
      });
    } catch (error) {
      console.error('❌Error en home:', error);
      res.status(500).send('Error al cargar la página principal: ' + error.message);
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