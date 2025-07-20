# Alin - Restaurant Reservation System
Sistem reservasi restoran modern dengan Laravel dan React.

## Features
- 🍽️ Manajemen meja restoran
- 📅 Sistem reservasi online
- 👨‍💼 Dashboard admin
- 👤 Portal pelanggan
- 📊 Analytics dan laporan

## Tech Stack
- **Backend:** Laravel 11 (LTS) or 12
- **Frontend:** React + TypeScript
- **Database:** MySQL
- **Styling:** Tailwind CSS
- **Development:** Laravel Herd (recommended) or manual setup

## Requirements

### Laravel Herd Users (Recommended)
- Laravel Herd (includes PHP, MySQL, Nginx)
- Node.js & NPM
- Composer (usually included with Herd)

### Manual Installation Users
- PHP 8.2+
- Composer
- Node.js & NPM
- MySQL 8.0+
- Web server (Apache/Nginx)

## Installation

### Option 1: Using Laravel Herd (Recommended)

1. Clone repository to Herd directory
```bash
git clone https://github.com/ariangroup/alin.git
cd alin
```

2. Install dependencies
```bash
composer install
npm install
```

3. Setup environment
```bash
cp .env.example .env
php artisan key:generate
```

4. Configure database in .env (Herd comes with MySQL)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=alin_restaurant
DB_USERNAME=root
DB_PASSWORD=
```

5. Create database using Herd
```bash
# Create database via Herd MySQL
mysql -u root -e "CREATE DATABASE alin_restaurant;"
```

6. Run migration and seeders
```bash
php artisan migrate --seed
```

7. Start development server for React assets
```bash
npm run dev
```

8. Access via Herd (keep npm run dev running)
```
https://alin.test
```

### Option 2: Manual Installation

1. Clone repository
```bash
git clone https://github.com/ariangroup/alin.git
cd alin
```

2. Install dependencies
```bash
composer install
npm install
```

3. Setup environment
```bash
cp .env.example .env
php artisan key:generate
```

4. Configure database in .env
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=alin_restaurant
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. Run migration and seeders
```bash
php artisan migrate --seed
```

6. Start development server for React assets
```bash
npm run dev
```

7. Start Laravel server (in another terminal)
```bash
php artisan serve
```

8. Access application (keep npm run dev running)
```
http://localhost:8000
```

## Usage

### Admin Dashboard
- Login dengan akun admin default
- Kelola meja restoran
- Monitor reservasi pelanggan
- Lihat analytics dan laporan

### Customer Portal
- Register atau login sebagai pelanggan
- Pilih meja yang tersedia
- Buat reservasi dengan mudah
- Track status reservasi

## Default Admin Account
```
Email: Alin@gmail.com
Password: password
```
## Default User Account
```
Email: test@example.com
Password: password
```
## Development

### With Laravel Herd
```bash
# Start Vite dev server for React hot reload
npm run dev

# Access via Herd URL (keep npm run dev running in background)
https://alin.test
```

### Manual Development
```bash
# Terminal 1: Start Vite dev server for React assets
npm run dev

# Terminal 2: Start Laravel server
php artisan serve

# Access via localhost (keep both servers running)
http://localhost:8000
```

**Important:** Always run `npm run dev` before accessing the application to ensure React components load properly with hot reload.

## Testing
```bash
php artisan test
```

## Project Structure
```
app/
├── Http/Controllers/    # Controllers untuk admin dan pelanggan
├── Models/             # Model Reservation, Table, User
└── Middleware/         # Custom middleware

resources/js/
├── pages/admin/        # Admin dashboard pages
├── pages/pelanggan/    # Customer portal pages
└── components/         # Reusable UI components

database/
├── migrations/         # Database schema
└── seeders/           # Sample data
```

## Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License
MIT License
