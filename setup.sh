#!/bin/bash

# LuxTravel Setup Script
# This script will help set up Node.js and install dependencies

echo "=== LuxTravel Setup Script ==="
echo ""

# Check if Node.js is installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js is installed: $NODE_VERSION"
else
    echo "✗ Node.js is not installed"
    echo ""
    echo "Please install Node.js using one of these methods:"
    echo "1. Homebrew: brew install node"
    echo "2. Official installer: https://nodejs.org/"
    echo "3. nvm (Node Version Manager): https://github.com/nvm-sh/nvm"
    echo ""
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm is installed: $NPM_VERSION"
else
    echo "✗ npm is not installed"
    exit 1
fi

echo ""
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Dependencies installed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Copy .env.example to .env.local and add your Supabase credentials"
    echo "2. Run 'npm run dev' to start the development server"
    echo ""
else
    echo ""
    echo "✗ Failed to install dependencies"
    echo "Please check the error messages above"
    exit 1
fi
