FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip \
    && docker-php-ext-install pdo_mysql zip

# Install composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Set permission (penting)
RUN chmod -R 775 storage bootstrap/cache public \
    && chown -R www-data:www-data storage bootstrap/cache public

# Install PHP dependencies (tanpa dev, optimal)
RUN composer install --no-dev --optimize-autoloader

# Expose port
EXPOSE 8000

# Start server: clear cache dulu supaya env dari Render kebaca
CMD php artisan config:clear \
 && php artisan route:clear \
 && php artisan view:clear \
 && php artisan storage:link \
 && php artisan config:cache \
 && php artisan route:cache \
 && php artisan serve --host=0.0.0.0 --port=8000
