const { Book, Category, Author, Publisher } = require('../models');
const { sendNewBookEmail } = require('../services/emailService');
const fs = require('fs');
const path = require('path');

const bookController = {
  // Listar todos los libros
  async index(req, res) {
    try {
      const books = await Book.findAll({
        include: [
          { model: Category, as: 'category' },
          { model: Author, as: 'author' },
          { model: Publisher, as: 'publisher' }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.render('books/index', {
        title: 'Mantenimiento de Libros',
        books,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error en listado de libros:', error);
      req.flash('error', 'Error al cargar el listado de libros');
      res.redirect('/');
    }
  },

  // Mostrar formulario de creación
  async createForm(req, res) {
    try {
      const categories = await Category.findAll({ order: [['name', 'ASC']] });
      const authors = await Author.findAll({ order: [['name', 'ASC']] });
      const publishers = await Publisher.findAll({ order: [['name', 'ASC']] });

      res.render('books/create', {
        title: 'Crear Nuevo Libro',
        categories,
        authors,
        publishers,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error al mostrar formulario de creación:', error);
      req.flash('error', 'Error al cargar el formulario');
      res.redirect('/books');
    }
  },

// Crear nuevo libro
async create(req, res) {
  try {
    console.log('📥 Datos recibidos en POST:');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const { title, publicationYear, categoryId, authorId, publisherId } = req.body;
    
    console.log('Valores extraídos:');
    console.log('title:', title);
    console.log('publicationYear:', publicationYear);
    console.log('categoryId:', categoryId);
    console.log('authorId:', authorId);
    console.log('publisherId:', publisherId);
    
    let coverImage = null;

    // Verificar que existan categorías, autores y editoriales
    const categoriesCount = await Category.count();
    const authorsCount = await Author.count();
    const publishersCount = await Publisher.count();

    console.log('Conteos:', { categoriesCount, authorsCount, publishersCount });

    if (categoriesCount === 0) {
      req.flash('error', 'No hay categorías creadas');
      return res.redirect('/books/create');
    }

    if (authorsCount === 0) {
      req.flash('error', 'No hay autores creados');
      return res.redirect('/books/create');
    }

    if (publishersCount === 0) {
      req.flash('error', 'No hay editoriales creadas');
      return res.redirect('/books/create');
    }

    // Validar campos requeridos
    if (!title || !publicationYear || !categoryId || !authorId || !publisherId) {
      console.log('❌ Campos faltantes:');
      if (!title) console.log('- title');
      if (!publicationYear) console.log('- publicationYear');
      if (!categoryId) console.log('- categoryId');
      if (!authorId) console.log('- authorId');
      if (!publisherId) console.log('- publisherId');
      
      req.flash('error', 'Todos los campos son requeridos');
      return res.redirect('/books/create');
    }

    // Subir imagen si existe
    if (req.file) {
      coverImage = '/uploads/books/' + req.file.filename;
    }

    console.log('📝 Creando libro con:', {
      title,
      coverImage,
      publicationYear,
      categoryId: parseInt(categoryId),
      authorId: parseInt(authorId),
      publisherId: parseInt(publisherId)
    });

    const book = await Book.create({
      title,
      coverImage,
      publicationYear: parseInt(publicationYear),
      categoryId: parseInt(categoryId),
      authorId: parseInt(authorId),
      publisherId: parseInt(publisherId)
    });

    console.log('✅ Libro creado:', book.toJSON());

    // Obtener el autor para enviar email
    const author = await Author.findByPk(authorId);
    if (author && author.email) {
      await sendNewBookEmail(author.email, author.name, book.title);
      console.log('📧 Email enviado a:', author.email);
    }

    req.flash('success', 'Libro creado exitosamente');
    res.redirect('/books');
  } catch (error) {
    console.error('❌ Error al crear libro:', error);
    req.flash('error', 'Error al crear el libro: ' + error.message);
    res.redirect('/books/create');
  }
 },

  // Mostrar formulario de edición
  async editForm(req, res) {
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
        return res.redirect('/books');
      }

      const categories = await Category.findAll({ order: [['name', 'ASC']] });
      const authors = await Author.findAll({ order: [['name', 'ASC']] });
      const publishers = await Publisher.findAll({ order: [['name', 'ASC']] });

      res.render('books/edit', {
        title: 'Editar Libro',
        book,
        categories,
        authors,
        publishers,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error al mostrar formulario de edición:', error);
      req.flash('error', 'Error al cargar el formulario de edición');
      res.redirect('/books');
    }
  },

  // Actualizar libro
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, publicationYear, categoryId, authorId, publisherId } = req.body;
    
      console.log('✏️ Editando libro ID:', id);
      console.log('Datos recibidos:', { title, publicationYear, categoryId, authorId, publisherId });

      const book = await Book.findByPk(id);
      if (!book) {
        req.flash('error', 'Libro no encontrado');
        return res.redirect('/books');
      }

      // Validar campos requeridos
      if (!title || !publicationYear || !categoryId || !authorId || !publisherId) {
        req.flash('error', 'Todos los campos excepto la imagen son requeridos');
        return res.redirect(`/books/edit/${id}`);
      }

      // Subir nueva imagen si existe
      let coverImage = book.coverImage;
      if (req.file) {
        if (book.coverImage) {
          const oldImagePath = path.join(__dirname, '../public', book.coverImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        coverImage = '/uploads/books/' + req.file.filename;
      }

      await book.update({
        title,
        coverImage,
        publicationYear: parseInt(publicationYear),
        categoryId: parseInt(categoryId),
        authorId: parseInt(authorId),
        publisherId: parseInt(publisherId)
      });

      console.log('✅ Libro actualizado:', book.toJSON());

      req.flash('success', 'Libro actualizado exitosamente');
      res.redirect('/books');
    } catch (error) {
      console.error('Error al actualizar libro:', error);
      req.flash('error', 'Error al actualizar el libro');
      res.redirect(`/books/edit/${id}`);
    }
  },

  // Mostrar confirmación de eliminación
  async deleteConfirm(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id);

      if (!book) {
        req.flash('error', 'Libro no encontrado');
        return res.redirect('/books');
      }

      res.render('books/delete', {
        title: 'Eliminar Libro',
        book,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error al mostrar confirmación:', error);
      req.flash('error', 'Error al cargar la confirmación');
      res.redirect('/books');
    }
  },

  // Eliminar libro
  async delete(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id);

      if (!book) {
        req.flash('error', 'Libro no encontrado');
        return res.redirect('/books');
      }

      // Eliminar imagen asociada
      if (book.coverImage) {
        const imagePath = path.join(__dirname, '../public', book.coverImage);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await book.destroy();
      req.flash('success', 'Libro eliminado exitosamente');
      res.redirect('/books');
    } catch (error) {
      console.error('Error al eliminar libro:', error);
      req.flash('error', 'Error al eliminar el libro');
      res.redirect('/books');
    }
  }
};

module.exports = bookController;