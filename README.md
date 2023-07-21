Apps built on Nestjs, swagger included for easy testing , set the .env before running the application

Example .env file

# POSTGRES
POSTGRES_USER=postgres

DB_PORT=5432

POSTGRES_DB=postgres

POSTGRES_PASSWORD=YOUR_DB_PASS

DB_HOST=postgres

DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}

PORT=3000

JWT_ACCESS_SECRET=YOUR_JWT_ACCESS_SECRET

JWT_REFRESH_SECRET=YOUR_JWT_REFRESH_SECRET


# ADMIN

ADMIN_PASSWORD=admin

ADMIN_EMAIL=admin@gmail.com

# BOSS-1

BOSS1_PASS=boss1

BOSS1_EMAIL=boss1@gmail.com
 
# BOSS-2

BOSS2_PASS=boss2

BOSS2_EMAIL=boss2@gmail.com

# AFTER INSTALL .ENV
After installing .env, run docker-compose build -> docker-compose up
