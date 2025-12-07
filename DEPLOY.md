# Hướng dẫn Deploy Sorokid lên Linux Host

## 1. Yêu cầu hệ thống
- Node.js >= 18.x
- MySQL >= 8.0
- npm hoặc yarn
- PM2 (để chạy process)

## 2. Chuẩn bị trên Server Linux

### Cài đặt Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Kiểm tra version
node -v
npm -v
```

### Cài đặt PM2
```bash
sudo npm install -g pm2
```

### Cài đặt MySQL (nếu chưa có)
```bash
sudo apt install mysql-server
sudo mysql_secure_installation
```

## 3. Clone và Setup Project

### Clone từ GitHub
```bash
cd /var/www
git clone https://github.com/nqh2610/sorokid.git
cd sorokid
```

### Tạo file .env
```bash
cp .env.example .env
nano .env
```

Cập nhật các giá trị trong `.env`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/sorokid"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-random-secret-key"
NODE_ENV="production"
```

**Tạo NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## 4. Cài đặt Dependencies và Build

```bash
# Cài đặt dependencies
npm install

# Generate Prisma client
npx prisma generate

# Tạo database và migrate
npx prisma db push

# Seed data (nếu cần)
npm run prisma:seed

# Build production
npm run build
```

## 5. Chạy ứng dụng

### Cách 1: Chạy với PM2 (Khuyến nghị)
```bash
# Start với PM2
pm2 start npm --name "sorokid" -- start

# Hoặc sử dụng ecosystem file
pm2 start ecosystem.config.js

# Lưu config để auto-start khi reboot
pm2 save
pm2 startup
```

### Cách 2: Chạy Standalone (nếu dùng output: 'standalone')
```bash
# Copy static files
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Chạy
cd .next/standalone
node server.js
```

## 6. Cấu hình Nginx (Reverse Proxy)

### Tạo file config
```bash
sudo nano /etc/nginx/sites-available/sorokid
```

### Nội dung config:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Kích hoạt config
```bash
sudo ln -s /etc/nginx/sites-available/sorokid /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Cài đặt SSL với Certbot
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 8. Các lỗi thường gặp và cách khắc phục

### Lỗi: Module not found
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
rm -f package-lock.json
npm install
```

### Lỗi: Prisma Client
```bash
# Regenerate Prisma
npx prisma generate
```

### Lỗi: Permission denied
```bash
# Fix quyền thư mục
sudo chown -R $USER:$USER /var/www/sorokid
chmod -R 755 /var/www/sorokid
```

### Lỗi: Database connection
- Kiểm tra MySQL đang chạy: `sudo systemctl status mysql`
- Kiểm tra connection string trong `.env`
- Đảm bảo user MySQL có quyền truy cập database

### Lỗi: Port 3000 đã được sử dụng
```bash
# Tìm process đang dùng port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Lỗi: NEXTAUTH_URL không đúng
Đảm bảo `NEXTAUTH_URL` trong `.env` khớp với domain thực tế:
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

## 9. Monitoring và Logs

### Xem logs PM2
```bash
pm2 logs sorokid
pm2 logs sorokid --lines 100
```

### Xem trạng thái
```bash
pm2 status
pm2 monit
```

### Restart khi cập nhật code
```bash
git pull
npm install
npm run build
pm2 restart sorokid
```

## 10. Cập nhật và Backup

### Backup database
```bash
mysqldump -u username -p sorokid > backup_$(date +%Y%m%d).sql
```

### Restore database
```bash
mysql -u username -p sorokid < backup_file.sql
```
