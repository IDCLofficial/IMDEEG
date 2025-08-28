#!/bin/bash

# Ministry of Digital Economy - Deployment Script
# Make sure to run this script as root or with sudo

set -e

echo "🚀 Starting deployment process..."

# Update system packages
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js and npm if not already installed
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    npm install -g pm2
fi

# Install Nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "📥 Installing Nginx..."
    apt install -y nginx
fi

# Create application directory
echo "📁 Setting up application directory..."
mkdir -p /var/www/ministry-of-digital_economy
mkdir -p /var/log/pm2

# Set proper permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/ministry-of-digital_economy
chown -R www-data:www-data /var/log/pm2

# Copy configuration files
echo "📋 Copying configuration files..."
cp ecosystem.config.js /var/www/ministry-of-digital_economy/
cp nginx.conf /etc/nginx/sites-available/ministry-digital-economy

# Enable Nginx site
echo "🔗 Enabling Nginx site..."
ln -sf /etc/nginx/sites-available/ministry-digital-economy /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

# Reload Nginx
echo "🔄 Reloading Nginx..."
systemctl reload nginx

# Enable Nginx to start on boot
echo "🚀 Enabling Nginx to start on boot..."
systemctl enable nginx

# Copy systemd service file
echo "📋 Setting up PM2 systemd service..."
cp pm2.service /etc/systemd/system/

# Reload systemd and enable PM2 service
echo "🔄 Reloading systemd and enabling PM2 service..."
systemctl daemon-reload
systemctl enable pm2

# Start PM2 service
echo "🚀 Starting PM2 service..."
systemctl start pm2

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your domain in nginx.conf"
echo "2. Set up SSL certificates with Let's Encrypt"
echo "3. Deploy your application code to /var/www/ministry-of-digital_economy"
echo "4. Run: cd /var/www/ministry-of-digital_economy && npm install && npm run build"
echo "5. Start your app: pm2 start ecosystem.config.js --env production"
echo ""
echo "🔍 Check status with:"
echo "- PM2: pm2 status"
echo "- Nginx: systemctl status nginx"
echo "- Logs: pm2 logs ministry-digital-economy"

