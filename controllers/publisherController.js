const { Publisher, Book } = require('../models');

const publisherController = {
  // Listar todas las editoriales
  async index(req, res) {
    try {
      const publishers = await Publisher.findAll({
        include: [
          {
            model: Book,
            as: 'books',
            attributes: ['id']
          }
        ],
        order: [['name', 'ASC']]
      });

      // Calcular cantidad de libros por editorial
      const publishersWithCount = publishers.map(publisher => {
        const plainPublisher = publisher.get({ plain: true });
        plainPublisher.bookCount = plainPublisher.books ? plainPublisher.books.length : 0;
        return plainPublisher;
      });

      res.render('publishers/index', {
        title: 'Mantenimiento de Editoriales',
        publishers: publishersWithCount,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error en listado de editoriales:', error);
      req.flash('error', 'Error al cargar el listado de editoriales');
      res.redirect('/');
    }
  },

  // Mostrar formulario de creación
  createForm(req, res) {
    res.render('publishers/create', {
      title: 'Crear Nueva Editorial',
      layout: 'main'
    });
  },

  // Crear nueva editorial
  async create(req, res) {
    try {
      const { name, phone, country } = req.body;

      if (!name || !phone || !country) {
        req.flash('error', 'Todos los campos son requeridos');
        return res.redirect('/publishers/create');
      }

      await Publisher.create({ name, phone, country });
      req.flash('success', 'Editorial creada exitosamente');
      res.redirect('/publishers');
    } catch (error) {
      console.error('Error al crear editorial:', error);
      req.flash('error', 'Error al crear la editorial: ' + error.message);
      res.redirect('/publishers/create');
    }
  },

  // Mostrar formulario de edición
  async editForm(req, res) {
    try {
      const { id } = req.params;
      const publisher = await Publisher.findByPk(id);

      if (!publisher) {
        req.flash('error', 'Editorial no encontrada');
        return res.redirect('/publishers');
      }

      res.render('publishers/edit', {
        title: 'Editar Editorial',
        publisher,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error al mostrar formulario de edición:', error);
      req.flash('error', 'Error al cargar el formulario de edición');
      res.redirect('/publishers');
    }
  },

  // Actualizar editorial
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, phone, country } = req.body;

      const publisher = await Publisher.findByPk(id);
      if (!publisher) {
        req.flash('error', 'Editorial no encontrada');
        return res.redirect('/publishers');
      }

      if (!name || !phone || !country) {
        req.flash('error', 'Todos los campos son requeridos');
        return res.redirect(`/publishers/edit/${id}`);
      }

      await publisher.update({ name, phone, country });
      req.flash('success', 'Editorial actualizada exitosamente');
      res.redirect('/publishers');
    } catch (error) {
      console.error('Error al actualizar editorial:', error);
      req.flash('error', 'Error al actualizar la editorial');
      res.redirect(`/publishers/edit/${id}`);
    }
  },

  // Mostrar confirmación de eliminación
  async deleteConfirm(req, res) {
    try {
      const { id } = req.params;
      const publisher = await Publisher.findByPk(id);

      if (!publisher) {
        req.flash('error', 'Editorial no encontrada');
        return res.redirect('/publishers');
      }

      res.render('publishers/delete', {
        title: 'Eliminar Editorial',
        publisher,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error al mostrar confirmación:', error);
      req.flash('error', 'Error al cargar la confirmación');
      res.redirect('/publishers');
    }
  },

  // Eliminar editorial
  async delete(req, res) {
    try {
      const { id } = req.params;
      const publisher = await Publisher.findByPk(id);

      if (!publisher) {
        req.flash('error', 'Editorial no encontrada');
        return res.redirect('/publishers');
      }

      await publisher.destroy();
      req.flash('success', 'Editorial eliminada exitosamente');
      res.redirect('/publishers');
    } catch (error) {
      console.error('Error al eliminar editorial:', error);
      req.flash('error', 'Error al eliminar la editorial. Es posible que tenga libros asociados.');
      res.redirect('/publishers');
    }
  }
};

module.exports = publisherController;