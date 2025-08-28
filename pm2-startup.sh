#!/bin/bash

# PM2 Startup Configuration Script
# This script sets up PM2 to start automatically on system boot

echo "🚀 Setting up PM2 startup configuration..."

# Save current PM2 process list
pm2 save

# Generate startup script
pm2 startup

echo "✅ PM2 startup configuration completed!"
echo ""
echo "📋 The startup command has been generated above."
echo "Copy and run that command as root to complete the setup."
echo ""
echo "🔍 To check if startup is configured:"
echo "pm2 startup"
echo ""
echo "💾 To save current processes:"
echo "pm2 save"
