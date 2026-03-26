const app = require('./app');
const sequelize = require('./config/database');
const { Category, Author, Publisher, Book } = require('./models');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Sincronizar base de datos
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos.');
    
    // Crear datos iniciales si no existen
    await createInitialData();
    
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

// Crear datos iniciales de prueba
const createInitialData = async () => {
  try {
    // Verificar si ya hay datos
    const categoriesCount = await Category.count();
    const authorsCount = await Author.count();
    const publishersCount = await Publisher.count();
    
    if (categoriesCount === 0) {
      await Category.bulkCreate([
        { name: 'Ficción', description: 'Libros de ficción y narrativa' },
        { name: 'No Ficción', description: 'Libros basados en hechos reales' },
        { name: 'Ciencia Ficción', description: 'Libros de ciencia ficción' },
        { name: 'Romance', description: 'Libros románticos' },
        { name: 'Aventura', description: 'Libros de aventuras' }
      ]);
      console.log('Datos iniciales de categorías creados');
    }
    
    if (authorsCount === 0) {
      await Author.bulkCreate([
        { name: 'Gabriel García Márquez', email: 'gabriel@example.com' },
        { name: 'Isabel Allende', email: 'isabel@example.com' },
        { name: 'Mario Vargas Llosa', email: 'mario@example.com' }
      ]);
      console.log('Datos iniciales de autores creados');
    }
    
    if (publishersCount === 0) {
      await Publisher.bulkCreate([
        { name: 'Planeta', phone: '809-555-0101', country: 'España' },
        { name: 'Alfaguara', phone: '809-555-0102', country: 'España' },
        { name: 'Salamandra', phone: '809-555-0103', country: 'México' }
      ]);
      console.log('Datos iniciales de editoriales creados');
    }
    
    // Crear algunos libros de ejemplo
    const booksCount = await Book.count();
    if (booksCount === 0 && categoriesCount > 0 && authorsCount > 0 && publishersCount > 0) {
      const categories = await Category.findAll();
      const authors = await Author.findAll();
      const publishers = await Publisher.findAll();
      
      await Book.bulkCreate([
        {
          title: 'Cien años de soledad',
          publicationYear: 1967,
          category_id: categories[0].id,
          author_id: authors[0].id,
          publisher_id: publishers[0].id
        },
        {
          title: 'La casa de los espíritus',
          publicationYear: 1982,
          category_id: categories[1].id,
          author_id: authors[1].id,
          publisher_id: publishers[1].id
        }
      ]);
      console.log('Datos iniciales de libros creados');
    }
    
  } catch (error) {
    console.error('Error al crear datos iniciales:', error);
  }
};

// Iniciar servidor
const startServer = async () => {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();