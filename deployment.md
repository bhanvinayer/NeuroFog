# NeuroFog Deployment Guide

This guide covers deploying NeuroFog to various platforms and environments. NeuroFog is a Next.js application that can be deployed to multiple hosting providers.

## 📋 Prerequisites

- Node.js 18.0 or later
- Git repository with your NeuroFog code
- Package manager (pnpm recommended, npm or yarn also work)
- Environment variables configured (see Environment Setup section)

## 🚀 Quick Deploy Options

### Vercel (Recommended)

Vercel is the fastest way to deploy NeuroFog, as it's built by the creators of Next.js.

#### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/neurofog&project-name=neurofog&repository-name=neurofog)

#### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Navigate to your project**
   ```bash
   cd neurofog/src
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Follow the prompts**
   - Set root directory to `src`
   - Keep build command as default (`npm run build`)
   - Keep output directory as default

### Netlify

1. **Connect your repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your Git provider
   - Select your NeuroFog repository

2. **Configure build settings**
   - **Base directory**: `src`
   - **Build command**: `npm run build`
   - **Publish directory**: `src/.next`

3. **Deploy**
   - Click "Deploy site"

### Railway

1. **Create new project**
   - Go to [Railway](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure deployment**
   - **Root Directory**: `src`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **Deploy**
   - Railway will automatically build and deploy

## 🐳 Docker Deployment

### Docker with Multi-stage Build

Create a `Dockerfile` in the project root:

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY src/package.json src/yarn.lock* src/package-lock.json* src/pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src/ .

# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Build and Run Docker Container

```bash
# Build the image
docker build -t neurofog .

# Run the container
docker run -p 3000:3000 neurofog
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  neurofog:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_ANALYTICS_ID=${NEXT_PUBLIC_ANALYTICS_ID}
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## ☁️ Cloud Platform Deployments

### AWS (Amazon Web Services)

#### AWS Amplify

1. **Connect repository**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your Git provider

2. **Configure build settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd src
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: src/.next
       files:
         - '**/*'
     cache:
       paths:
         - src/node_modules/**/*
   ```

#### AWS EC2

1. **Launch EC2 instance**
   - Choose Ubuntu 22.04 LTS
   - Configure security groups (ports 22, 80, 443)

2. **Setup on EC2**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install pm2 -g
   
   # Clone repository
   git clone https://github.com/yourusername/neurofog.git
   cd neurofog/src
   
   # Install dependencies
   npm ci
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "neurofog" -- start
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx (optional)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/neurofog
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Google Cloud Platform

#### Google App Engine

Create `app.yaml` in the src directory:

```yaml
runtime: nodejs18

env_variables:
  NODE_ENV: production
  NEXT_PUBLIC_ANALYTICS_ID: your_analytics_id

automatic_scaling:
  min_instances: 1
  max_instances: 10
```

Deploy:
```bash
cd src
gcloud app deploy
```

#### Google Cloud Run

1. **Build and push image**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/neurofog
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy neurofog \
     --image gcr.io/PROJECT-ID/neurofog \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Microsoft Azure

#### Azure Static Web Apps

1. **Create static web app**
   - Go to Azure Portal
   - Create Static Web App
   - Connect to your GitHub repository

2. **Configure build**
   Azure will auto-detect Next.js and configure the build process.

## 🔧 Environment Configuration

### Environment Variables

Create appropriate environment files for each deployment:

#### Production (.env.production)
```env
NODE_ENV=production
NEXT_PUBLIC_ANALYTICS_ID=your_production_analytics_id
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

#### Development (.env.local)
```env
NODE_ENV=development
NEXT_PUBLIC_ANALYTICS_ID=your_dev_analytics_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Platform-Specific Environment Variables

#### Vercel
Set in Project Settings → Environment Variables

#### Netlify
Set in Site Settings → Environment Variables

#### Railway
Set in Project Variables

#### AWS Amplify
Set in Environment Variables section

## 📊 Performance Optimization

### Next.js Configuration

Update `next.config.mjs` for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports if deploying to CDN
  // output: 'export',
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Enable compression
  compress: true,
  
  // Optimize bundles
  experimental: {
    optimizeCss: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

### CDN Configuration

For static assets, consider using a CDN:

1. **Cloudflare**: Add your domain to Cloudflare
2. **AWS CloudFront**: Set up distribution for your S3 bucket
3. **Azure CDN**: Configure CDN profile

### Caching Strategy

```javascript
// In next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## 🔒 Security Considerations

### Security Headers

Implement security headers in your deployment:

```javascript
// next.config.mjs
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob:;
      font-src 'self';
      connect-src 'self';
    `.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]
```

### HTTPS Configuration

Always use HTTPS in production:

1. **Let's Encrypt** (Free SSL)
2. **Cloudflare SSL** (Free with Cloudflare)
3. **AWS Certificate Manager** (Free with AWS)
4. **Platform SSL** (Usually included with hosting platforms)

## 🔍 Monitoring & Analytics

### Application Monitoring

1. **Vercel Analytics** (Built-in)
2. **Google Analytics** (GA4)
3. **Plausible Analytics** (Privacy-friendly)
4. **Sentry** (Error tracking)

### Performance Monitoring

1. **Web Vitals**: Monitor Core Web Vitals
2. **Lighthouse**: Regular performance audits
3. **NewRelic**: Application performance monitoring
4. **DataDog**: Infrastructure monitoring

### Error Tracking

Set up error tracking for production:

```javascript
// Install Sentry
npm install @sentry/nextjs

// Configure in sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: src/package-lock.json
    
    - name: Install dependencies
      run: |
        cd src
        npm ci
    
    - name: Run tests
      run: |
        cd src
        npm run test
    
    - name: Build application
      run: |
        cd src
        npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: src/
```

### Continuous Integration

Set up automated testing:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: src/package-lock.json
    
    - run: cd src && npm ci
    - run: cd src && npm run lint
    - run: cd src && npm run type-check
    - run: cd src && npm run build
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures

1. **Out of Memory**
   ```bash
   # Increase Node.js memory limit
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

2. **Type Errors**
   ```bash
   # Run type check
   npx tsc --noEmit
   ```

3. **Missing Dependencies**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

#### Runtime Issues

1. **Environment Variables Not Loaded**
   - Check variable names start with `NEXT_PUBLIC_` for client-side
   - Verify variables are set in deployment platform

2. **404 Errors**
   - Check routing configuration
   - Verify build output includes all pages

3. **Performance Issues**
   - Enable Next.js analytics
   - Review bundle size
   - Implement proper caching

### Platform-Specific Issues

#### Vercel
- Check Function timeout limits
- Review serverless function size limits
- Monitor bandwidth usage

#### Netlify
- Check build time limits
- Review function execution limits
- Verify redirect rules

#### Self-Hosted
- Check server resources (CPU, RAM, disk)
- Monitor PM2 process status
- Review Nginx/Apache logs

## 📚 Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [AWS Amplify Hosting](https://docs.amplify.aws/guides/hosting/)
- [Netlify Documentation](https://docs.netlify.com/)

---

**Need help?** Open an issue on [GitHub Issues](https://github.com/yourusername/neurofog/issues) or check our [Documentation Wiki](https://github.com/yourusername/neurofog/wiki).