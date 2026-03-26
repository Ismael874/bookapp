const sequelize = require('../config/database');
const Book = require('./Book');
const Category = require('./Category');
const Author = require('./Author');
const Publisher = require('./Publisher');

// Establecer relaciones
Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books' });
Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Author.hasMany(Book, { foreignKey: 'authorId', as: 'books' });
Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });

Publisher.hasMany(Book, { foreignKey: 'publisherId', as: 'books' });
Book.belongsTo(Publisher, { foreignKey: 'publisherId', as: 'publisher' });

module.exports = {
  sequelize,
  Book,
  Category,
  Author,
  Publisher
};