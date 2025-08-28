# 🚀 Ministry of Digital Economy - Deployment Guide

This guide covers the complete deployment setup for the Ministry of Digital Economy website using PM2, Nginx, and systemd.

## 📋 Prerequisites

- Ubuntu 20.04+ server
- Root or sudo access
- Domain name pointing to your server
- SSH access to your server

## 🛠️ Installation Steps

### 1. Clone and Setup Repository

```bash
# Clone your repository
git clone https://github.com/yourusername/ministry-of-digital_economy.git
cd ministry-of-digital_economy

# Install dependencies
npm install

# Build the application
npm run build
```

### 2. Run Deployment Script

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script (as root or with sudo)
sudo ./deploy.sh
```

### 3. Configure Domain

Edit the `nginx.conf` file and replace `yourdomain.com` with your actual domain:

```bash
sudo nano /etc/nginx/sites-available/ministry-digital-economy
```

### 4. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 5. Deploy Application

```bash
# Copy your application to the server directory
sudo cp -r * /var/www/ministry-of-digital_economy/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/ministry-of-digital_economy

# Install dependencies and build
cd /var/www/ministry-of-digital_economy
npm install
npm run build
```

### 6. Start PM2 Application

```bash
# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

## 🔧 Configuration Files

### PM2 Ecosystem Config (`ecosystem.config.js`)
- **App Name**: ministry-digital-economy
- **Port**: 3000
- **Instances**: Max (cluster mode)
- **Memory Limit**: 1GB
- **Logs**: `/var/log/pm2/`

### Nginx Config (`nginx.conf`)
- **Port**: 80 (HTTP) → 443 (HTTPS)
- **Proxy**: Localhost:3000
- **Static Files**: `/_next/static/` and `/public/`
- **Gzip**: Enabled
- **Security Headers**: Configured

### Systemd Service (`pm2.service`)
- **User**: www-data
- **Auto-restart**: Enabled
- **Boot**: Auto-start enabled

## 📊 Monitoring Commands

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs ministry-digital-economy

# Monitor resources
pm2 monit

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/ministry-digital-economy.error.log
```

## 🔄 Deployment Commands

```bash
# Restart application
pm2 restart ministry-digital-economy

# Reload Nginx
sudo systemctl reload nginx

# Full system restart
sudo reboot
```

## 🚨 Troubleshooting

### PM2 Issues
```bash
# Kill all PM2 processes
pm2 kill

# Delete PM2 startup script
pm2 unstartup

# Restart PM2 daemon
pm2 resurrect
```

### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Permission Issues
```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/ministry-of-digital_economy
sudo chown -R www-data:www-data /var/log/pm2

# Fix permissions
sudo chmod -R 755 /var/www/ministry-of-digital_economy
```

## 📁 Directory Structure

```
/var/www/ministry-of-digital_economy/
├── .next/                    # Next.js build output
├── public/                   # Static files
├── src/                      # Source code
├── package.json
├── ecosystem.config.js       # PM2 configuration
└── ...

/var/log/pm2/
├── ministry-digital-economy-error.log
├── ministry-digital-economy-out.log
└── ministry-digital-economy-combined.log

/etc/nginx/sites-available/
└── ministry-digital-economy  # Nginx configuration
```

## 🔒 Security Considerations

- SSL/TLS encryption enabled
- Security headers configured
- Gzip compression enabled
- Static file caching optimized
- Proxy security headers set
- Rate limiting (can be added to Nginx)

## 📈 Performance Optimization

- **PM2 Cluster Mode**: Multiple Node.js instances
- **Nginx Reverse Proxy**: Efficient request handling
- **Static File Caching**: Long-term caching for build files
- **Gzip Compression**: Reduced bandwidth usage
- **Load Balancing**: PM2 handles process distribution

## 🆘 Support

If you encounter issues:

1. Check the logs: `pm2 logs` and `sudo tail -f /var/log/nginx/error.log`
2. Verify configuration: `pm2 status` and `sudo nginx -t`
3. Check permissions and ownership
4. Ensure all services are running: `sudo systemctl status`

---

**Note**: Remember to replace `yourdomain.com` with your actual domain name in all configuration files before deployment.
