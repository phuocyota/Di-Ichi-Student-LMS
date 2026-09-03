echo "pull code"
git pull

echo "install dependencies"
npm run build

sudo systemctl reload nginx