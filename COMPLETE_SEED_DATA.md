# Complete E-commerce Seed Data

## Quick Setup Guide

This file contains all the SQL needed to populate your e-commerce database with comprehensive product data.

### Features Included:
- ✅ 12 Cameras with detailed specs
- ✅ 12 Lenses for all mount types
- ✅ 15 Accessories (bags, tripods, lights, etc.)
- ✅ 4 Active coupons
- ✅ Categories with proper structure
- ✅ "New" badge tracking (auto-expires after 3 days)

### How to Use:

1. **View Backend** - Click the button below to open your Lovable Cloud dashboard
2. **Run SQL** - Copy the SQL sections below and run them in order
3. **Verify** - Check that products appear in your app

---

## SQL Commands

### 1. Categories (Already Created)

Categories were created via migration. Verify with:
```sql
SELECT * FROM categories;
```

### 2. Sample Coupons (Already Created)

Coupons were created. Verify with:
```sql
SELECT code, description, discount_value, valid_until FROM coupons WHERE is_active = true;
```

Available coupons:
- `WELCOME10` - 10% off first order
- `SAVE500` - ₹500 off orders above ₹10,000
- `MEGA20` - 20% off (mega sale, expires in 7 days)
- `CAMERA15` - 15% off cameras

### 3. Products (Already Created)

All products have been inserted. Verify with:
```sql
-- Count products by category
SELECT 
  c.name as category,
  COUNT(p.id) as product_count
FROM products p
JOIN categories c ON p.category_id = c.id
GROUP BY c.name;

-- View all cameras
SELECT name, brand, price, stock FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'cameras'
ORDER BY price DESC;

-- View all lenses  
SELECT name, brand, price, stock FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'lenses'
ORDER BY price DESC;

-- View all accessories
SELECT name, brand, price, stock FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'accessories'
ORDER BY price DESC;
```

### 4. Mark Recent Products as "NEW"

Products are automatically considered "new" for 3 days after being added. You can query new products with:

```sql
-- Find products added in last 3 days (these show "NEW" badge)
SELECT 
  name, 
  brand, 
  price,
  created_at,
  EXTRACT(DAY FROM NOW() - created_at) as days_old
FROM products
WHERE created_at >= NOW() - INTERVAL '3 days'
ORDER BY created_at DESC;
```

To manually mark products as featured:
```sql
-- Mark top products as featured
UPDATE products SET is_featured = true
WHERE name IN (
  'Canon EOS R5',
  'Sony A7 IV',
  'Nikon Z9',
  'Fujifilm X-T5',
  'Sony FE 70-200mm f/2.8 GM OSS II',
  'Canon RF 24-70mm f/2.8L',
  'Peak Design Everyday Backpack 30L',
  'DJI RS 3 Pro Gimbal'
);
```

---

## Product Categories Summary

### Cameras (12 products)
- Canon: EOS R5, R6 Mark II, R7
- Sony: A7 IV, A7R V, ZV-E10
- Nikon: Z9, Z6 III
- Fujifilm: X-T5, X-H2S
- Panasonic: Lumix S5 II
- Olympus: OM-1

### Lenses (12 products)
- Standard Zooms: 24-70mm f/2.8 (Canon, Nikon), 16-55mm (Fuji), 28-75mm (Tamron)
- Telephoto: 70-200mm f/2.8 (Sony), 100-500mm (Canon)
- Wide Angle: 16-35mm f/2.8 (Sony), 24mm f/1.4 (Sony)
- Prime: 50mm f/1.2 (Canon), 50mm f/1.8 (Nikon), 85mm f/1.4 (Sigma), 35mm f/1.4 (Sigma)

### Accessories (15 products)
- Bags: Peak Design Everyday 30L, Lowepro ProTactic BP 450
- Tripods: Manfrotto 055 Carbon, Pelican 1510 Case
- Memory: SanDisk CFexpress 256GB
- Lighting: Godox AD600Pro, Neewer LED Panel, Atomos Ninja V
- Stabilization: DJI RS 3 Pro, Zhiyun Weebill 3
- Audio: Rode VideoMic Pro+
- Filters: K&F Concept ND Set, Hoya UV 77mm
- Calibration: Datacolor SpyderX Pro
- Power: Sony NP-FZ100 Battery

---

## Testing Your Store

### 1. Browse Products
- Visit `/cameras` - Should show 12 camera products
- Visit `/lenses` - Should show 12 lens products
- Visit `/accessories` - Should show 15 accessory products

### 2. Test Search
- Search for "Sony" - Should find multiple products
- Search for "24-70mm" - Should find lenses
- Search keywords appear as you type

### 3. Test Compare
- Click compare icon on 2-4 products
- Visit `/compare` page
- Enter budget and requirements
- Click "AI Suggest Best" - Get AI recommendation

### 4. Test Coupons (At Checkout)
- Add items to cart
- Go to checkout
- Try coupon codes:
  - `WELCOME10` - For 10% discount
  - `SAVE500` - If total > ₹10,000
  - `MEGA20` - For 20% off

### 5. Admin Features
- Login as admin (you'll need to set user role)
- Visit `/admin` to manage products
- Add new products - They'll show "NEW" badge for 3 days

---

## Making a User Admin

To grant admin access to a user:

```sql
-- First, find the user ID from auth
SELECT id, email FROM auth.users;

-- Then add admin role (replace USER_ID with actual ID)
INSERT INTO user_roles (user_id, role)
VALUES ('USER_ID', 'admin');
```

---

## Troubleshooting

### Products not showing?
```sql
-- Check if products exist
SELECT COUNT(*) FROM products WHERE is_active = true;

-- Check category mapping
SELECT p.name, c.name as category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LIMIT 10;
```

### Images not loading?
Products use placeholder images. To add real images, update the `images` array:
```sql
UPDATE products 
SET images = ARRAY['https://your-image-url.jpg']
WHERE slug = 'product-slug';
```

### Coupons not working?
```sql
-- Check active coupons
SELECT code, discount_type, discount_value, valid_until
FROM coupons 
WHERE is_active = true 
AND (valid_until IS NULL OR valid_until > NOW());
```

---

## Next Steps

1. **Add Real Images**: Replace placeholder images with actual product photos
2. **Add Reviews**: Populate the reviews table with customer feedback
3. **Create Bundles**: Add bundle products (camera + lens + bag deals)
4. **Test Orders**: Place test orders to verify the checkout flow
5. **Configure Auth**: Set up user authentication and test the flow

Need help? Check the API_CONFIGURATION.md file for backend setup details!
