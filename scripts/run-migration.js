const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function createMigrationHistoryTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations_history (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function isAlreadyExecuted(client, migrationName) {
  const result = await client.query(
    'SELECT EXISTS(SELECT 1 FROM migrations_history WHERE migration_name = $1)',
    [migrationName],
  );
  return result.rows[0].exists;
}

async function markAsExecuted(client, migrationName) {
  await client.query(
    'INSERT INTO migrations_history (migration_name) VALUES ($1)',
    [migrationName],
  );
}

async function runMigration() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Migration history tablosunu oluştur
    await createMigrationHistoryTable(client);

    // Migrations klasöründeki tüm SQL dosyalarını al
    const migrationsDir = path.join(__dirname, '../src/migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort(); // Dosyaları sıralı çalıştırmak için

    // Her bir migration dosyasını çalıştır
    for (const file of files) {
      // Migration daha önce çalıştırılmış mı kontrol et
      const isExecuted = await isAlreadyExecuted(client, file);
      if (isExecuted) {
        console.log(`Atlanıyor (zaten çalıştırılmış): ${file}`);
        continue;
      }

      console.log(`Çalıştırılıyor: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

      try {
        // Her migration'ı ayrı bir transaction içinde çalıştır
        await client.query('BEGIN');
        await client.query(migrationSQL);
        await markAsExecuted(client, file);
        await client.query('COMMIT');
        console.log(`Tamamlandı: ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Hata (${file}):`, error.message);
        throw error;
      }
    }

    await client.query('COMMIT');
    console.log('Tüm migrationlar başarıyla tamamlandı!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration hatası:', error);
    throw error;
  } finally {
    client.release();
    pool.end();
  }
}

// Eğer bu dosya doğrudan çalıştırılıyorsa
if (require.main === module) {
  runMigration().catch((error) => {
    console.error('Migration başarısız:', error);
    process.exit(1);
  });
}

module.exports = { runMigration };
