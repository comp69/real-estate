# ChinaGroup Redesign (real-estate)

Comprehensive README for setting up the project locally using Laragon on Windows.

This repository contains a Laravel backend and a React frontend (Vite + Yarn). The backend serves REST API endpoints for projects, images, floorplans, features, and payment plans. The frontend consumes those endpoints and provides an admin panel for creating and managing projects.

## Features

- Public site: project listings, project detail (slug-based), galleries, floor plans, payment plans
- Admin panel: create / edit projects, upload gallery images, manage features, floor plans, payment plans
- Image/file uploads stored in `storage/app/public` and served via `public/storage`, Be sure to run the `php artisan storage:link` command
- Toast notifications, image modal viewer, responsive UI

## Prerequisites (Windows + Laragon)

Recommended environment: Laragon (https://laragon.org/) which bundles Apache/Nginx, PHP, MySQL, Composer and Node.js. This guide assumes Laragon is installed and running.

- Laragon (with PHP, Composer, MySQL)
- Node.js (optional — Laragon may include it; otherwise install from https://nodejs.org/)
- Yarn (we use Yarn as package manager in frontend) — install via npm: `npm install -g yarn`
- Git

Notes: If you prefer WSL2 or Docker, the steps are similar but adapt commands accordingly.

## Quick repo overview

- backend/ — Laravel application
- frontend/ — Vite + React frontend

## Step-by-step setup (Laragon)

1. Clone the repository

   Open Laragon terminal (or cmd) and run:

   ```cmd
   cd C:\laragon\www
   git clone https://github.com/comp69/real-estate.git chinagroup-redesign
   cd chinagroup-redesign
   ```

2. Backend (Laravel)

   Open a terminal in `backend/` (Laragon -> Terminal or cmd)

   ```cmd
   cd backend
   `php artisan serve`
   cp .env.example .env
   ```

   Edit `.env` with your DB credentials. Laragon default MySQL credentials usually are:

   - DB_CONNECTION=mysql
   - DB_HOST=127.0.0.1
   - DB_PORT=3306
   - DB_DATABASE=your_database_name
   - DB_USERNAME=root
   - DB_PASSWORD=

   Create the database (using HeidiSQL, phpMyAdmin, or mysql client):

   ```cmd
   mysql -u root -p
   CREATE DATABASE chinagroup_db; -- or the name you chose
   exit
   ```

   Then run migrations and seeders:

   ```cmd
   php artisan key:generate
   ```


   Optional: Set file permissions if needed (on Windows usually fine). If using Linux/WSL/Docker, ensure `storage` and `bootstrap/cache` are writable.

   Start backend server (Laravel's built-in dev server recommends using `php artisan serve`) or use Laragon's Apache/Nginx virtual host.

   ```cmd
   php artisan serve --host=127.0.0.1 --port=8000
   ```

   The backend API base URL will be: `http://localhost:8000/api`

3. Frontend (Vite + React + Yarn)

   Open a terminal in `frontend/`:

   ```cmd
   cd frontend
   yarn install
   yarn dev
   (or yarn build for a production build)
   ```

  Vite dev server defaults to something like `http://localhost:5173` — check the terminal for the exact URL. The frontend will attempt to use the same origin by default, or you can set the backend base URL via the Vite env var `VITE_API_BASE` (see below).

4. Admin login for local development

   - The admin login is currently hard coded and can be found in the login page currently or if you prefer to look in the code its in the "admin login.jsx" file

5. Environment variables used by the code

- Backend `.env` (most important): APP_URL, DB_*, FILESYSTEM_DRIVER (should default to public), MAIL settings (optional)
Frontend: API base URL is configurable. By default the frontend will use the same origin (window.location.origin). To explicitly set the backend base use a Vite env var in `frontend/.env`:

```
VITE_API_BASE=http://localhost:8000
```

The app will then make requests to `${VITE_API_BASE}/api`.

## Important API endpoints (backend)

- GET /api/projects — list public projects (by slug)
- GET /api/projects/{slug} — public project detail
- GET /api/admin/projects/{id} — admin project detail (numeric id)
- POST /api/projects — create project (multipart/form-data)
- POST /api/admin/projects/{id} with `_method=PUT` — update project (multipart/form-data)
- DELETE /api/projects/{id} — delete project (admin)
- POST /api/projects/{id}/images — upload gallery images (admin)
- DELETE /api/projects/{projectId}/images/{imageId} — delete image (admin)
- POST /api/projects/{id}/features — add feature (admin)
- POST /api/projects/{id}/floor-plans — add floor plan (admin)
- POST /api/projects/{id}/payment-plans — add payment plan (admin)

Note: Admin routes that expect numeric IDs may be under `/api/admin` for retrieving data in the admin panel. The public route for detail uses slug.

## Common development tasks

- Run backend tests:

  ```cmd
  cd backend
  ./vendor/bin/phpunit
  ```

- Run frontend lint/tests (if any):

  ```cmd
  cd frontend
  yarn lint
  yarn test
  ```

- Build production frontend:

  ```cmd
  cd frontend
  yarn build
  ```

- Serve production build via a web server (copy `dist` to your server or use `serve`)

## Troubleshooting

- Error "failed to load data" in admin after creating project
  - Make sure the backend is running on port 8000 and `php artisan serve` is active or Laragon virtual host is configured.
  - Ensure the project creation response returns an `id`. The frontend expects the freshly created project `id` to start uploading gallery images.
  - On Windows, if you see 404 on `/storage/...` images, ensure `php artisan storage:link` has been run and `public/storage` exists.

- Permission issues (images not saving): ensure `storage` directory is writable by the web server (on Windows Laragon usually fine).

- CORS errors: If the browser blocks requests, ensure Laravel CORS config (`config/cors.php`) allows the frontend origin (e.g., http://localhost:5173). You can set `ALLOWED_ORIGINS` accordingly.

## Deployment notes

- Configure APP_URL, database credentials, and filesystem (S3 or other) in production .env
- For production build of frontend, run `yarn build` and serve static files via Nginx/Apache or integrate with Laravel's public directory
- Consider using Laravel's storage on S3 for production and update `FILESYSTEM_DRIVER` and storage URLs

## Useful commands summary

Backend

```cmd
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

Frontend

```cmd
cd frontend
yarn install
yarn dev
# build for production
yarn build
```

## Contributing and notes

- This project mixes admin endpoints (numeric ID) and public endpoints (slug). Keep that in mind when calling endpoints from admin UI vs public UI.


