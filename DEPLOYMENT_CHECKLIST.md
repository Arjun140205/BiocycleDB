# 🚀 Deployment Checklist - BioCycleDB

## Pre-Deployment Checklist

### Environment Setup
- [ ] Create production `.env` file for server
- [ ] Create production `.env` file for client
- [ ] Update `REACT_APP_API_URL` to production URL
- [ ] Update `MONGO_URI` to production MongoDB
- [ ] Generate strong `JWT_SECRET` (32+ characters)
- [ ] Add production `OPENAI_API_KEY`

### Security
- [ ] Remove any exposed credentials from code
- [ ] Add `.env` to `.gitignore`
- [ ] Enable CORS only for production domain
- [ ] Add rate limiting middleware
- [ ] Add helmet.js for security headers
- [ ] Enable HTTPS/SSL
- [ ] Validate all user inputs

### Database
- [ ] Backup existing data
- [ ] Run index creation script
- [ ] Test database connection
- [ ] Set up automated backups
- [ ] Configure connection pooling

### Testing
- [ ] Test all API endpoints
- [ ] Test file upload functionality
- [ ] Test AI paper parsing
- [ ] Test 3D molecule rendering
- [ ] Test pagination on all pages
- [ ] Test error boundaries
- [ ] Test on multiple browsers
- [ ] Test mobile responsiveness

### Performance
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Minify JavaScript/CSS
- [ ] Enable caching headers
- [ ] Test with large datasets
- [ ] Monitor API response times

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (Google Analytics)
- [ ] Set up uptime monitoring
- [ ] Set up log aggregation
- [ ] Configure alerts

---

## Environment Variables

### Server (.env)
```bash
# Server Configuration
PORT=5001
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/biocycledb

# Authentication
JWT_SECRET=your-super-secure-random-string-min-32-chars

# OpenAI
OPENAI_API_KEY=sk-proj-...

# CORS (optional)
ALLOWED_ORIGINS=https://yourdomain.com
```

### Client (.env)
```bash
# API Configuration
REACT_APP_API_URL=https://api.yourdomain.com

# Build Configuration
GENERATE_SOURCEMAP=false
```

---

## Deployment Steps

### Option 1: Traditional Server (VPS/EC2)

#### Server Deployment
```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Clone repository
git clone https://github.com/yourusername/biocycledb.git
cd biocycledb

# 3. Install dependencies
cd server
npm install --production

# 4. Create .env file
nano .env
# (paste production environment variables)

# 5. Start with PM2
npm install -g pm2
pm2 start server.js --name biocycledb-api
pm2 save
pm2 startup

# 6. Set up Nginx reverse proxy
sudo nano /etc/nginx/sites-available/biocycledb
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Client Deployment
```bash
# 1. Build React app
cd client
npm install
npm run build

# 2. Copy build to web server
sudo cp -r build/* /var/www/biocycledb/

# 3. Configure Nginx
sudo nano /etc/nginx/sites-available/biocycledb-client
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/biocycledb;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

### Option 2: Heroku

#### Server Deployment
```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create biocycledb-api

# 4. Set environment variables
heroku config:set MONGO_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="..."
heroku config:set OPENAI_API_KEY="..."

# 5. Deploy
cd server
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Client Deployment (Netlify/Vercel)
```bash
# Using Netlify CLI
npm install -g netlify-cli
cd client
netlify deploy --prod

# Or connect GitHub repo to Netlify dashboard
```

---

### Option 3: Docker

**Dockerfile (Server):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5001
CMD ["node", "server.js"]
```

**Dockerfile (Client):**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  api:
    build: ./server
    ports:
      - "5001:5001"
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: always

  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - api
    restart: always
```

---

## Post-Deployment

### Verification
- [ ] Visit production URL
- [ ] Test user registration/login
- [ ] Upload a test paper
- [ ] View compounds and papers
- [ ] Test 3D visualizations
- [ ] Check error handling
- [ ] Monitor server logs

### Monitoring Setup
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs biocycledb-api

# Check status
pm2 status
```

### Backup Strategy
```bash
# MongoDB backup script
mongodump --uri="mongodb+srv://..." --out=/backups/$(date +%Y%m%d)

# Automate with cron
0 2 * * * /path/to/backup-script.sh
```

---

## Troubleshooting

### Common Issues

**1. API not connecting**
- Check CORS settings
- Verify API_URL in client .env
- Check firewall rules
- Verify server is running

**2. Database connection failed**
- Check MONGO_URI format
- Verify IP whitelist in MongoDB Atlas
- Check network connectivity

**3. File uploads failing**
- Check uploads directory permissions
- Verify multer configuration
- Check file size limits

**4. 3D molecules not rendering**
- Check 3Dmol.js CDN availability
- Verify SMILES strings are valid
- Check browser console for errors

---

## Performance Optimization

### Server
```javascript
// Add compression
const compression = require('compression');
app.use(compression());

// Add caching
const apicache = require('apicache');
let cache = apicache.middleware;
app.use('/api/compounds', cache('5 minutes'), compoundRoutes);
```

### Client
```javascript
// Code splitting
const CompoundExplorer = lazy(() => import('./pages/CompoundExplorer'));

// Memoization
const MemoizedComponent = React.memo(Component);
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, AWS ELB)
- Deploy multiple server instances
- Use Redis for session storage
- Implement caching layer

### Database Scaling
- Enable MongoDB sharding
- Use read replicas
- Implement connection pooling
- Add database caching

### CDN
- Serve static assets via CDN
- Cache API responses
- Use edge locations

---

## Maintenance

### Regular Tasks
- [ ] Weekly: Check error logs
- [ ] Weekly: Review performance metrics
- [ ] Monthly: Update dependencies
- [ ] Monthly: Database backup verification
- [ ] Quarterly: Security audit
- [ ] Quarterly: Performance optimization

### Update Process
```bash
# 1. Backup database
mongodump --uri="..."

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
npm install

# 4. Run migrations (if any)
npm run migrate

# 5. Restart server
pm2 restart biocycledb-api

# 6. Verify deployment
curl https://api.yourdomain.com/health
```

---

## Support & Documentation

### Resources
- GitHub Repository: [link]
- API Documentation: [link]
- User Guide: [link]
- Admin Dashboard: [link]

### Contact
- Technical Support: support@yourdomain.com
- Bug Reports: GitHub Issues
- Feature Requests: GitHub Discussions

---

## Success Metrics

### Track These KPIs
- Uptime percentage (target: 99.9%)
- Average response time (target: <500ms)
- Error rate (target: <1%)
- User registrations
- Papers uploaded
- Compounds added
- API usage

---

**Deployment Date:** _____________

**Deployed By:** _____________

**Version:** _____________

**Status:** ⬜ Development | ⬜ Staging | ⬜ Production

---

Good luck with your deployment! 🚀
