const { Category, Book } = require('../models');

const categoryController = {
  // Listar todas las categorías
  async index(req, res) {
    try {
      const categories = await Category.findAll({
        include: [
          {
            model: Book,
            as: 'books',
            attributes: ['id']
          }
        ],
        order: [['name', 'ASC']]
      });

      // Calcular cantidad de libros por categoría
      const categoriesWithCount = categories.map(category => {
        const plainCategory = category.get({ plain: true });
        plainCategory.bookCount = plainCategory.books ? plainCategory.books.length : 0;
        return plainCategory;
      });

      res.render('categories/index', {
        title: 'Mantenimiento de Categorías',
        categories: categoriesWithCount,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error en listado de categorías:', error);
      req.flash('error', 'Error al cargar el listado de categorías');
      res.redirect('/');
    }
  },

  // Mostrar formulario de creación
  createForm(req, res) {
    res.render('categories/create', {
      title: 'Crear Nueva Categoría',
      layout: 'main'
    });
  },

  // Crear nueva categoría
  async create(req, res) {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        req.flash('error', 'Todos los campos son requeridos');
        return res.redirect('/categories/create');
      }

      await Category.create({ name, description });
      req.flash('success', 'Categoría creada exitosamente');
      res.redirect('/categories');
    } catch (error) {
      console.error('Error al crear categoría:', error);
      req.flash('error', 'Error al crear la categoría: ' + error.message);
      res.redirect('/categories/create');
    }
  },

  // Mostrar formulario de edición
  async editForm(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) {
        req.flash('error', 'Categoría no encontrada');
        return res.redirect('/categories');
      }

      res.render('categories/edit', {
        title: 'Editar Categoría',
        category,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error al mostrar formulario de edición:', error);
      req.flash('error', 'Error al cargar el formulario de edición');
      res.redirect('/categories');
    }
  },

  // Actualizar categoría
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        req.flash('error', 'Categoría no encontrada');
        return res.redirect('/categories');
      }

      if (!name || !description) {
        req.flash('error', 'Todos los campos son requeridos');
        return res.redirect(`/categories/edit/${id}`);
      }

      await category.update({ name, description });
      req.flash('success', 'Categoría actualizada exitosamente');
      res.redirect('/categories');
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      req.flash('error', 'Error al actualizar la categoría');
      res.redirect(`/categories/edit/${id}`);
    }
  },

  // Mostrar confirmación de eliminación
  async deleteConfirm(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) {
        req.flash('error', 'Categoría no encontrada');
        return res.redirect('/categories');
      }

      res.render('categories/delete', {
        title: 'Eliminar Categoría',
        category,
        layout: 'main'
      });
    } catch (error) {
      console.error('Error al mostrar confirmación:', error);
      req.flash('error', 'Error al cargar la confirmación');
      res.redirect('/categories');
    }
  },

  // Eliminar categoría
  async delete(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) {
        req.flash('error', 'Categoría no encontrada');
        return res.redirect('/categories');
      }

      await category.destroy();
      req.flash('success', 'Categoría eliminada exitosamente');
      res.redirect('/categories');
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      req.flash('error', 'Error al eliminar la categoría. Es posible que tenga libros asociados.');
      res.redirect('/categories');
    }
  }
};

module.exports = categoryController;