const sequelize = require('../config/database');
const Book = require('./Book');
const Category = require('./Category');
const Author = require('./Author');
const Publisher = require('./Publisher');

// Establecer relaciones
Category.hasMany(Book, { foreignKey: 'category_id', as: 'books' });
Book.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Author.hasMany(Book, { foreignKey: 'author_id', as: 'books' });
Book.belongsTo(Author, { foreignKey: 'author_id', as: 'author' });

Publisher.hasMany(Book, { foreignKey: 'publisher_id', as: 'books' });
Book.belongsTo(Publisher, { foreignKey: 'publisher_id', as: 'publisher' });

module.exports = {
  sequelize,
  Book,
  Category,
  Author,
  Publisher
};