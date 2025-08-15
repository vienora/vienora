# 🔌 SPOCKET INTEGRATION SETUP GUIDE

## ⚡ IMMEDIATE SETUP (15 minutes)

### Step 1: Get Spocket API Credentials

1. **Login to Spocket**: https://www.spocket.co/ → Click "Login" (top right)
2. **Find API Section** (navigation varies by account):
   - Try **Integrations** → **API & Integrations**
   - OR **Tools** → **API & Integrations**
   - OR look for **"Developers"** or **"API"** in main menu
   - OR **Settings** → **Integrations**
3. **Generate/Copy your credentials**:
   - API Key (starts with `sk_`)
   - API Secret
   - Webhook Secret (create if needed)

**Note**: If you can't find the API section, contact Spocket support - some plan types may have different access.

### Step 2: Configure Environment Variables

Update your `.env.local` file with real Spocket credentials:

```bash
# Replace these with your actual Spocket credentials
SPOCKET_API_KEY=sk_live_your_actual_api_key_here
SPOCKET_API_SECRET=your_actual_api_secret_here
SPOCKET_WEBHOOK_SECRET=your_webhook_secret_here
SPOCKET_BASE_URL=https://api.spocket.co/v1

# Set a secure admin key for sync operations
ADMIN_API_KEY=your_secure_admin_key_here
```

### Step 3: Configure Spocket Webhook

1. **In Spocket Dashboard**: Settings → Webhooks
2. **Add webhook URL**: `https://your-domain.netlify.app/api/webhooks/spocket`
3. **Select events**:
   - ✅ order.shipped
   - ✅ order.delivered
   - ✅ order.cancelled
   - ✅ inventory.updated

### Step 4: Test Integration

```bash
# Start your development server
bun run dev

# Test Spocket connection
curl http://localhost:3000/api/sync/spocket

# Should return connection status
```

## 🚀 GOING LIVE CHECKLIST

### Before Deployment:

- [ ] **Spocket API credentials** configured in .env.local
- [ ] **Webhook URL** set in Spocket dashboard
- [ ] **Test product fetch**: Visit `/api/products` and verify real products load
- [ ] **Test order creation**: Process a test order
- [ ] **Verify webhook**: Check webhook receives notifications

### After Deployment:

- [ ] **Update webhook URL** to production domain
- [ ] **Test live integration**
- [ ] **Monitor error logs**
- [ ] **Set up inventory sync schedule**

## 📊 MONITORING & MAINTENANCE

### Check Integration Status:
```bash
# Get current status
GET /api/sync/spocket

# Manual sync (requires admin key)
POST /api/sync/spocket
Authorization: Bearer your_admin_api_key_here
```

### Expected Response:
```json
{
  "configured": true,
  "apiKey": "configured",
  "webhookSecret": "configured",
  "apiStatus": "connected",
  "productCount": 1250,
  "webhookUrl": "https://your-domain.netlify.app/api/webhooks/spocket"
}
```

## 🛍️ PRODUCT CATEGORIES TO FOCUS ON

**High-Converting Luxury Categories:**

1. **Jewelry & Watches** ($50-500)
   - High margins (60-80%)
   - Fast shipping from US suppliers
   - Strong luxury appeal

2. **Home & Lifestyle** ($25-300)
   - Premium home decor
   - Luxury kitchen items
   - Designer accessories

3. **Tech Accessories** ($20-200)
   - Premium phone cases
   - Wireless chargers
   - Smart home devices

4. **Fashion Accessories** ($15-150)
   - Designer-style bags
   - Luxury scarves
   - Premium sunglasses

## 💰 PRICING STRATEGY

**Automated Markup in Code:**
- **Spocket Price × 2.5** = Your Price (150% markup)
- **Spocket Price × 3** = Compare At Price (show savings)

**Example:**
- Spocket: $40 → Your Price: $100 → Compare At: $120

## 🔧 TROUBLESHOOTING

### Common Issues:

**"API Key not configured"**
- Check `.env.local` has correct SPOCKET_API_KEY
- Restart development server after changes

**"No products returned"**
- Verify API key is valid in Spocket dashboard
- Check API rate limits
- Ensure account has access to products

**"Webhook not receiving"**
- Verify webhook URL is accessible
- Check webhook secret matches
- Review Spocket dashboard webhook logs

### Debug Commands:

```bash
# Check environment variables
echo $SPOCKET_API_KEY

# Test API directly
curl -H "Authorization: Bearer $SPOCKET_API_KEY" \
  https://api.spocket.co/v1/products?per_page=1

# Check webhook logs
tail -f logs/webhook.log
```

## 📈 EXPECTED RESULTS

**Week 1:**
- ✅ 50-200 real products imported
- ✅ Real orders processing through Spocket
- ✅ Automated inventory sync

**Week 2-4:**
- ✅ 200-500 products optimized
- ✅ Customer orders fulfilled automatically
- ✅ Revenue: $100-500/day potential

**Month 2+:**
- ✅ 500+ premium products
- ✅ Automated operations
- ✅ Revenue: $500-2000/day potential

## 🆘 NEED HELP?

**If integration fails:**
1. Check environment variables
2. Verify Spocket API key permissions
3. Review webhook configuration
4. Check logs for specific errors

**Platform will fall back to demo products** if Spocket integration fails, so your site remains functional during setup.

---

**🎯 RESULT**: Real products, real orders, real revenue within 1 week of setup!
