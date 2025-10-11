# WP Scan API Documentation (v1)

## Overview

The WP Scan API allows Enterprise users to programmatically scan WordPress websites, retrieve scan results, and manage monitored websites.

**Base URL:** `https://wp.instant.tw/api/v1`

**Authentication:** Bearer token (API Key)

**Rate Limit:** 1,000 requests per 24 hours

---

## Authentication

All API requests require an API key passed in the `Authorization` header:

```
Authorization: Bearer wp_scan_your_api_key_here
```

### Getting an API Key

1. Log in to your WP Scan dashboard
2. Navigate to Settings → API Keys
3. Click "Generate New API Key"
4. Give your key a name and optionally set an expiration
5. **Save the key securely** - you won't be able to see it again!

### API Key Management

- **List Keys:** View all your API keys in Settings
- **Revoke Key:** Deactivate a key (reversible)
- **Delete Key:** Permanently remove a key
- **View Usage:** See last used timestamp and request count

---

## Rate Limiting

All API endpoints are rate limited to **1,000 requests per 24 hours** per user.

Rate limit information is included in response headers:

- `X-RateLimit-Remaining`: Number of requests remaining
- `X-RateLimit-Reset`: Timestamp when the limit resets
- `Retry-After`: Seconds to wait if limit exceeded (only on 429 errors)

### Rate Limit Exceeded

When you exceed the rate limit, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 3600
}
```

---

## Endpoints

### 1. Scan WordPress Website

Scan a WordPress website for vulnerabilities.

**Endpoint:** `POST /api/v1/scan`

**Request Body:**

```json
{
  "url": "https://example.com",
  "saveToDatabase": false
}
```

**Parameters:**

- `url` (string, required): The WordPress website URL to scan
- `saveToDatabase` (boolean, optional): Save scan to your dashboard (default: false)

**Response (200 OK):**

```json
{
  "url": "https://example.com",
  "scannedAt": "2025-01-11T12:00:00Z",
  "riskScore": 45,
  "wordpress": {
    "version": "6.4.2",
    "latestVersion": "6.4.3",
    "isOutdated": true
  },
  "plugins": [
    {
      "name": "Contact Form 7",
      "slug": "contact-form-7",
      "version": "5.8.4",
      "latestVersion": "5.9.0",
      "isOutdated": true,
      "vulnerabilities": [
        {
          "severity": "HIGH",
          "title": "SQL Injection",
          "cveId": "CVE-2024-1234",
          "cvssScore": 7.5
        }
      ]
    }
  ],
  "themes": [],
  "vulnerabilities": {
    "total": 3,
    "critical": 0,
    "high": 1,
    "medium": 2,
    "low": 0,
    "details": [...]
  },
  "scanId": "scan_abc123"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid URL or not a WordPress site
- `401 Unauthorized`: Invalid API key
- `429 Too Many Requests`: Rate limit exceeded

**Example cURL:**

```bash
curl -X POST https://wp.instant.tw/api/v1/scan \
  -H "Authorization: Bearer wp_scan_your_key" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "saveToDatabase": true}'
```

---

### 2. List Websites

Retrieve all websites being monitored in your account.

**Endpoint:** `GET /api/v1/websites`

**Response (200 OK):**

```json
{
  "total": 5,
  "websites": [
    {
      "id": "web_abc123",
      "url": "https://example.com",
      "scanFrequency": "DAILY",
      "lastScannedAt": "2025-01-11T02:00:00Z",
      "nextScanAt": "2025-01-12T02:00:00Z",
      "isActive": true,
      "latestRiskScore": 45,
      "totalScans": 12,
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

**Example cURL:**

```bash
curl https://wp.instant.tw/api/v1/websites \
  -H "Authorization: Bearer wp_scan_your_key"
```

---

### 3. Get Scan Details

Retrieve detailed information about a specific scan.

**Endpoint:** `GET /api/v1/scans/{id}`

**Path Parameters:**

- `id` (string, required): The scan ID

**Response (200 OK):**

```json
{
  "id": "scan_abc123",
  "websiteUrl": "https://example.com",
  "scannedAt": "2025-01-11T02:00:00Z",
  "riskScore": 45,
  "wordpress": {
    "version": "6.4.2",
    "latestVersion": "6.4.3",
    "isOutdated": true
  },
  "plugins": [...],
  "themes": [...],
  "vulnerabilities": {
    "total": 3,
    "critical": 0,
    "high": 1,
    "medium": 2,
    "low": 0,
    "details": [
      {
        "severity": "HIGH",
        "title": "SQL Injection in Contact Form 7",
        "description": "An SQL injection vulnerability...",
        "affectedItem": "contact-form-7",
        "affectedVersion": "5.8.4",
        "fixedIn": "5.9.0",
        "cveId": "CVE-2024-1234",
        "cvssScore": 7.5
      }
    ]
  }
}
```

**Error Responses:**

- `403 Forbidden`: You don't own this scan
- `404 Not Found`: Scan doesn't exist

**Example cURL:**

```bash
curl https://wp.instant.tw/api/v1/scans/scan_abc123 \
  -H "Authorization: Bearer wp_scan_your_key"
```

---

## Response Format

### Success Response

All successful responses return JSON with a `200 OK` status code and relevant data.

### Error Response

Error responses include an error message:

```json
{
  "error": "Error message here",
  "details": "Optional additional details"
}
```

**Common Status Codes:**

- `200 OK`: Request successful
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid API key
- `403 Forbidden`: Action not allowed for your plan
- `404 Not Found`: Resource doesn't exist
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Data Types

### Scan Frequency

- `MANUAL`: No automated scans
- `WEEKLY`: Scanned once per week
- `DAILY`: Scanned once per day
- `REALTIME`: Scanned every 6 hours

### Severity Levels

- `CRITICAL`: Critical vulnerabilities requiring immediate attention
- `HIGH`: High severity vulnerabilities
- `MEDIUM`: Medium severity vulnerabilities
- `LOW`: Low severity vulnerabilities

### Risk Score

Risk scores range from `0` to `100`:

- `0-39`: Low risk (green)
- `40-69`: Medium risk (orange)
- `70-100`: High risk (red)

---

## Best Practices

### 1. Store API Keys Securely

- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Set expiration dates when possible

### 2. Handle Rate Limits

```javascript
const response = await fetch('https://wp.instant.tw/api/v1/scan', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ url: 'https://example.com' })
});

if (response.status === 429) {
  const retryAfter = response.headers.get('retry-after');
  console.log(`Rate limited. Retry after ${retryAfter} seconds`);
  // Wait and retry
}
```

### 3. Error Handling

Always implement error handling:

```javascript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  const data = await response.json();
  // Process data
} catch (error) {
  console.error('API Error:', error.message);
}
```

### 4. Batch Processing

If scanning multiple sites, add delays between requests to stay within rate limits:

```javascript
for (const url of urls) {
  await scanWebsite(url);
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
}
```

---

## Code Examples

### Node.js

```javascript
const WPScanAPI = {
  baseUrl: 'https://wp.instant.tw/api/v1',
  apiKey: process.env.WPSCAN_API_KEY,
  
  async scan(url, saveToDatabase = false) {
    const response = await fetch(`${this.baseUrl}/scan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, saveToDatabase })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    return await response.json();
  },
  
  async listWebsites() {
    const response = await fetch(`${this.baseUrl}/websites`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    return await response.json();
  },
  
  async getScan(scanId) {
    const response = await fetch(`${this.baseUrl}/scans/${scanId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    return await response.json();
  }
};

// Usage
const scan = await WPScanAPI.scan('https://example.com', true);
console.log(`Risk Score: ${scan.riskScore}`);
```

### Python

```python
import requests
import os

class WPScanAPI:
    BASE_URL = 'https://wp.instant.tw/api/v1'
    API_KEY = os.getenv('WPSCAN_API_KEY')
    
    @classmethod
    def scan(cls, url, save_to_database=False):
        response = requests.post(
            f'{cls.BASE_URL}/scan',
            headers={'Authorization': f'Bearer {cls.API_KEY}'},
            json={'url': url, 'saveToDatabase': save_to_database}
        )
        response.raise_for_status()
        return response.json()
    
    @classmethod
    def list_websites(cls):
        response = requests.get(
            f'{cls.BASE_URL}/websites',
            headers={'Authorization': f'Bearer {cls.API_KEY}'}
        )
        return response.json()
    
    @classmethod
    def get_scan(cls, scan_id):
        response = requests.get(
            f'{cls.BASE_URL}/scans/{scan_id}',
            headers={'Authorization': f'Bearer {cls.API_KEY}'}
        )
        return response.json()

# Usage
scan = WPScanAPI.scan('https://example.com', save_to_database=True)
print(f"Risk Score: {scan['riskScore']}")
```

---

## Support

For API support, Enterprise users can:

- **Email:** support@instant.tw
- **Dashboard:** Settings → Support
- **Documentation:** wp.instant.tw/docs/api

---

## Changelog

### v1.0.0 (2025-01-11)

- Initial API release
- Scan WordPress websites
- List monitored websites
- Get scan details
- Rate limiting: 1000 requests/24h

---

## Terms of Service

- API access is exclusively for Enterprise plan subscribers
- Rate limits are enforced per account
- Abuse or excessive usage may result in temporary suspension
- API keys are personal and should not be shared
- You are responsible for keeping your API keys secure

---

**Questions?** Contact our support team at support@instant.tw
