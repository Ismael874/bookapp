const app = require('./app');
const sequelize = require('./config/database');
const { Category, Author, Publisher, Book } = require('./models');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Iniciar servidor
async function startServer() {
  try {
    // Sincronizar base de datos (force: true para limpiar y empezar de nuevo)
    await sequelize.sync({ force: true });
    console.log('✅ Base de datos sincronizada');
    
    // Crear datos iniciales
    console.log('📝 Creando datos iniciales...');
    
    // Crear categorías
    const categories = await Category.bulkCreate([
      { name: 'Ficción', description: 'Libros de ficción y narrativa' },
      { name: 'No Ficción', description: 'Libros basados en hechos reales' },
      { name: 'Ciencia Ficción', description: 'Libros de ciencia ficción' },
      { name: 'Romance', description: 'Libros románticos' },
      { name: 'Aventura', description: 'Libros de aventuras' }
    ]);
    console.log(`✅ Creadas ${categories.length} categorías`);
    
    // Crear autores
    const authors = await Author.bulkCreate([
      { name: 'Gabriel García Márquez', email: 'gabriel@ejemplo.com' },
      { name: 'Isabel Allende', email: 'isabel@ejemplo.com' },
      { name: 'Mario Vargas Llosa', email: 'mario@ejemplo.com' }
    ]);
    console.log(`✅ Creados ${authors.length} autores`);
    
    // Crear editoriales
    const publishers = await Publisher.bulkCreate([
      { name: 'Planeta', phone: '809-555-0101', country: 'España' },
      { name: 'Alfaguara', phone: '809-555-0102', country: 'España' },
      { name: 'Salamandra', phone: '809-555-0103', country: 'México' }
    ]);
    console.log(`✅ Creadas ${publishers.length} editoriales`);
    
    // Crear algunos libros de ejemplo
    const books = await Book.bulkCreate([
      {
        title: 'Cien años de soledad',
        publicationYear: 1967,
        categoryId: categories[0].id,
        authorId: authors[0].id,
        publisherId: publishers[0].id
      },
      {
        title: 'La casa de los espíritus',
        publicationYear: 1982,
        categoryId: categories[1].id,
        authorId: authors[1].id,
        publisherId: publishers[1].id
      }
    ]);
    console.log(`✅ Creados ${books.length} libros`);
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log('🚀 BookApp - Servidor iniciado');
      console.log('='.repeat(50));
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(50));
      console.log('\n📝 Prueba estas URLs:');
      console.log(`- Home: http://localhost:${PORT}`);
      console.log(`- Libros: http://localhost:${PORT}/books`);
      console.log(`- Categorías: http://localhost:${PORT}/categories`);
      console.log(`- Autores: http://localhost:${PORT}/authors`);
      console.log(`- Editoriales: http://localhost:${PORT}/publishers`);
      console.log('\n' + '='.repeat(50));
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();