#!/usr/bin/env sh
# 
# Dotnity Static Website - Quick Deploy Script
# Use this to quickly deploy to GitHub Pages
#

echo "?? Dotnity Static Website Deployment"
echo "===================================="
echo ""
echo "This script helps you deploy to GitHub Pages"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "? Git is not installed. Please install git first."
    exit 1
fi

echo "? Git detected"
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "?? Initializing git repository..."
    git init
    echo "? Repository initialized"
    echo ""
fi

# Ask for repository URL
echo "?? GitHub Repository Setup"
echo "-------------------------"
echo "What is your GitHub repository URL?"
echo "Example: https://github.com/yourusername/dotnity.git"
read -p "Enter repository URL: " repo_url

# Add remote if not exists
if ! git remote get-url origin &> /dev/null; then
    echo "?? Adding remote repository..."
    git remote add origin "$repo_url"
    echo "? Remote added"
else
    echo "?? Remote already exists"
fi

echo ""
echo "?? Staging files..."
git add .

echo ""
echo "?? Commit message?"
read -p "Enter commit message (default: 'Add Dotnity static website'): " commit_msg
commit_msg="${commit_msg:-Add Dotnity static website}"

echo "?? Creating commit..."
git commit -m "$commit_msg"

echo ""
echo "?? Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "? Push complete!"
echo ""
echo "Next steps:"
echo "1. Go to your repository on GitHub"
echo "2. Click Settings ? Pages"
echo "3. Select 'main' branch as source"
echo "4. Click Save"
echo "5. Your site will be live in 2-3 minutes!"
echo ""
echo "Your site will be available at:"
echo "  https://yourusername.github.io/dotnity"
echo ""
