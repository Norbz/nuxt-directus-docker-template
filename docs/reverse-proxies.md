# Setting Up a Reverse Proxy for n8n

This guide explains how to set up a reverse proxy for n8n using either Apache or Nginx, with Let's Encrypt for HTTPS.

---

## Prerequisites
- A server with Apache or Nginx installed.
- A domain name pointing to your server.
- `certbot` installed for managing Let's Encrypt certificates.

---

## Using Apache

### Step 1: Install Required Modules
Ensure the following modules are enabled:
```bash
sudo a2enmod proxy proxy_http ssl headers rewrite
sudo systemctl restart apache2
```
Beware that certbot is still available on apt, but you should be using snapd. Read the [Certbot documentation](https://certbot.eff.org/instructions?ws=apache&os=snap)

### Step 2: Configure Virtual Host
Create a new virtual host configuration file:
```bash
sudo nano /etc/apache2/sites-available/n8n.conf
```

Add the following configuration:
```apache
<VirtualHost *:80>
    ServerName your-domain.com

    RewriteEngine On
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com

    SSLEngine On
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</VirtualHost>

<VirtualHost *:80>
    ServerName api.your-domain.com

    RewriteEngine On
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>

<VirtualHost *:443>
    ServerName api.your-domain.com

    SSLEngine On
    SSLCertificateFile /etc/letsencrypt/live/api.your-domain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/api.your-domain.com/privkey.pem
    ProxyPreserveHost On
    ProxyPass / http://localhost:8055/
    ProxyPassReverse / http://localhost:8055/

    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</VirtualHost>
```

### Step 3: Enable the Site and Obtain SSL Certificate
```bash
sudo a2ensite n8n.conf
sudo certbot --apache -d your-domain.com
sudo systemctl reload apache2
```

---

## Using Nginx

### Step 1: Prerequisites
Ensure Nginx is installed and `certbot` is available.
Beware that certbot is still available on apt, but you should be using snapd. Read the [Certbot documentation](https://certbot.eff.org/instructions?ws=nginx&os=snap)


### Step 2: Configure Nginx
Create a new server block:
```bash
sudo nano /etc/nginx/sites-available/my-website
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name api.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/api.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8055;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

### Step 3: Enable the Site and Obtain SSL Certificate
```bash
sudo ln -s /etc/nginx/sites-available/my-website /etc/nginx/sites-enabled/
sudo certbot --nginx -d your-domain.com
sudo systemctl reload nginx
```

---

## Notes
- Replace `your-domain.com` with your actual domain name.
- Ensure port `5678` is open and accessible on your server.
- Use `sudo ufw allow` to manage firewall rules if needed.

---

With these configurations, your n8n instance will be accessible securely via HTTPS through your chosen reverse proxy.
