const { Author, Book } = require('../models');

const authorController = {
  // Listar todos los autores
  async index(req, res) {
    try {
      const authors = await Author.findAll({
        include: [
          {
            model: Book,
            as: 'books',
            attributes: ['id']
          }
        ],
        order: [['name', 'ASC']]
      });

      // Calcular cantidad de libros por autor
      const authorsWithCount = authors.map(author => {
        const plainAuthor = author.get({ plain: true });
        plainAuthor.bookCount = plainAuthor.books ? plainAuthor.books.length : 0;
        return plainAuthor;
      });

      res.render('authors/index', {
        title: 'Mantenimiento de Autores',
        authors: authorsWithCount,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error en listado de autores:', error);
      req.flash('error', 'Error al cargar el listado de autores');
      res.redirect('/');
    }
  },

  // Mostrar formulario de creación
  createForm(req, res) {
    res.render('authors/create', {
      title: 'Crear Nuevo Autor',
      layout: 'main'
    });
  },

  // Crear nuevo autor
  async create(req, res) {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        req.flash('error', 'Todos los campos son requeridos');
        return res.redirect('/authors/create');
      }

      await Author.create({ name, email });
      req.flash('success', 'Autor creado exitosamente');
      res.redirect('/authors');
    } catch (error) {
      console.error('Error al crear autor:', error);
      req.flash('error', 'Error al crear el autor: ' + error.message);
      res.redirect('/authors/create');
    }
  },

  // Mostrar formulario de edición
  async editForm(req, res) {
    try {
      const { id } = req.params;
      const author = await Author.findByPk(id);

      if (!author) {
        req.flash('error', 'Autor no encontrado');
        return res.redirect('/authors');
      }

      res.render('authors/edit', {
        title: 'Editar Autor',
        author,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error al mostrar formulario de edición:', error);
      req.flash('error', 'Error al cargar el formulario de edición');
      res.redirect('/authors');
    }
  },

  // Actualizar autor
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const author = await Author.findByPk(id);
      if (!author) {
        req.flash('error', 'Autor no encontrado');
        return res.redirect('/authors');
      }

      if (!name || !email) {
        req.flash('error', 'Todos los campos son requeridos');
        return res.redirect(`/authors/edit/${id}`);
      }

      await author.update({ name, email });
      req.flash('success', 'Autor actualizado exitosamente');
      res.redirect('/authors');
    } catch (error) {
      console.error('Error al actualizar autor:', error);
      req.flash('error', 'Error al actualizar el autor');
      res.redirect(`/authors/edit/${id}`);
    }
  },

  // Mostrar confirmación de eliminación
  async deleteConfirm(req, res) {
    try {
      const { id } = req.params;
      const author = await Author.findByPk(id);

      if (!author) {
        req.flash('error', 'Autor no encontrado');
        return res.redirect('/authors');
      }

      res.render('authors/delete', {
        title: 'Eliminar Autor',
        author,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error al mostrar confirmación:', error);
      req.flash('error', 'Error al cargar la confirmación');
      res.redirect('/authors');
    }
  },

  // Eliminar autor
  async delete(req, res) {
    try {
      const { id } = req.params;
      const author = await Author.findByPk(id);

      if (!author) {
        req.flash('error', 'Autor no encontrado');
        return res.redirect('/authors');
      }

      await author.destroy();
      req.flash('success', 'Autor eliminado exitosamente');
      res.redirect('/authors');
    } catch (error) {
      console.error('Error al eliminar autor:', error);
      req.flash('error', 'Error al eliminar el autor. Es posible que tenga libros asociados.');
      res.redirect('/authors');
    }
  }
};

module.exports = authorController;