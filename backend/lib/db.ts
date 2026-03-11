import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('customer', 'driver', 'admin'))
  );

  CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    phone TEXT,
    vehicle_type TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    driver_id INTEGER,
    pickup_location TEXT NOT NULL,
    drop_location TEXT NOT NULL,
    parcel_description TEXT NOT NULL,
    parcel_weight REAL NOT NULL,
    receiver_phone TEXT NOT NULL,
    price REAL NOT NULL,
    delivery_status TEXT DEFAULT 'pending' CHECK(delivery_status IN ('pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES users(id),
    FOREIGN KEY(driver_id) REFERENCES users(id)
  );
`);

// Seed an admin user if none exists
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!adminExists) {
  import('bcryptjs').then(bcrypt => {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run('Admin User', 'admin@zemen.com', hashedPassword, 'admin');
    console.log('Admin user created: admin@zemen.com / admin123');
  });
}

// Add Products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    stock INTEGER DEFAULT 0
  );
`);

// Safely add new columns to deliveries for the new features
const addColumn = (table: string, column: string, def: string) => {
  try {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
  } catch (e) {
    // Column likely already exists
  }
};

addColumn('deliveries', 'delivery_type', "TEXT DEFAULT 'standard'");
addColumn('deliveries', 'service_type', "TEXT DEFAULT 'same_day'");
addColumn('deliveries', 'has_insurance', "INTEGER DEFAULT 0");
addColumn('deliveries', 'scheduled_time', "DATETIME");
addColumn('deliveries', 'payment_method', "TEXT DEFAULT 'cod'");
addColumn('deliveries', 'payment_status', "TEXT DEFAULT 'pending'");
addColumn('deliveries', 'product_id', "INTEGER REFERENCES products(id)");

// Seed products if empty
const productExists = db.prepare("SELECT * FROM products LIMIT 1").get();
if (!productExists) {
  const insertProduct = db.prepare("INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)");
  insertProduct.run('ZED Smartphone X', 'Latest model smartphone with advanced features and 5G support.', 25000, 'https://picsum.photos/seed/phone/400/300', 15);
  insertProduct.run('ZED Laptop Pro', 'High performance laptop for professionals and creators.', 85000, 'https://picsum.photos/seed/laptop/400/300', 8);
  insertProduct.run('ZED Wireless Earbuds', 'Noise cancelling wireless earbuds with long battery life.', 4500, 'https://picsum.photos/seed/earbuds/400/300', 30);
  insertProduct.run('Smart Watch Series 5', 'Fitness tracking, heart rate monitor, and notifications.', 7000, 'https://picsum.photos/seed/watch/400/300', 20);
}

export default db;
