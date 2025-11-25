# Database Seed Data Guide

## Overview
This guide helps you populate your database with initial data for testing and development.

## Quick Start

### Option 1: Use Lovable Cloud Dashboard
1. Open the backend dashboard
2. Navigate to the table you want to populate
3. Click "Insert" and add records manually

### Option 2: Use SQL Directly
Copy and paste the SQL below into your database query tool.

## Categories Data

```sql
INSERT INTO categories (name, slug, description, image_url) VALUES
('Mirrorless Cameras', 'mirrorless', 'Professional mirrorless camera systems', 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b'),
('DSLR Cameras', 'dslr', 'Traditional DSLR camera bodies', 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b'),
('Camera Lenses', 'lenses', 'High-quality lenses for all mounts', 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b'),
('Camera Accessories', 'accessories', 'Essential camera accessories', 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b'),
('Lighting Equipment', 'lighting', 'Studio and portable lighting', 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b'),
('Camera Bags', 'bags', 'Protective camera bags and cases', 'https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b');
```

## Sample Products

```sql
-- Get category IDs first
-- Replace <mirrorless_id> with actual ID from categories table

INSERT INTO products (name, slug, description, price, original_price, brand, stock, is_featured, is_active, images, specifications) VALUES
(
  'Canon EOS R5',
  'canon-eos-r5',
  'Professional full-frame mirrorless camera with 45MP sensor and 8K video recording capabilities.',
  389900,
  429900,
  'Canon',
  10,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b'],
  '{"sensor": "Full Frame 45MP", "video": "8K RAW", "iso": "100-51200", "mount": "RF Mount"}'::jsonb
),
(
  'Sony A7 IV',
  'sony-a7-iv',
  'Versatile full-frame mirrorless camera perfect for hybrid creators. 33MP sensor with advanced autofocus.',
  249900,
  NULL,
  'Sony',
  15,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b'],
  '{"sensor": "Full Frame 33MP", "video": "4K60", "iso": "100-51200", "mount": "E Mount"}'::jsonb
),
(
  'Nikon Z9',
  'nikon-z9',
  'Flagship mirrorless camera with 8K video and advanced autofocus system.',
  549900,
  NULL,
  'Nikon',
  8,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b'],
  '{"sensor": "Full Frame 45.7MP", "video": "8K30", "iso": "64-25600", "mount": "Z Mount"}'::jsonb
),
(
  'Canon RF 24-70mm f/2.8L',
  'canon-rf-24-70mm',
  'Professional standard zoom lens with constant f/2.8 aperture.',
  229900,
  NULL,
  'Canon',
  12,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b'],
  '{"aperture": "f/2.8", "range": "24-70mm", "mount": "RF Mount", "weight": "900g"}'::jsonb
),
(
  'Peak Design Everyday Backpack 30L',
  'peak-design-backpack',
  'Premium camera backpack with customizable dividers and weatherproof construction.',
  29990,
  NULL,
  'Peak Design',
  25,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1606980395091-8a4d8c0b7c3b'],
  '{"capacity": "30L", "material": "Weatherproof Canvas", "weight": "1.8kg"}'::jsonb
);
```

## Admin User Setup

```sql
-- After creating your user account, run this to make yourself admin:
-- Replace <your_user_id> with your actual user ID from auth.users

INSERT INTO user_roles (user_id, role)
VALUES ('<your_user_id>', 'admin');
```

## Sample Order (Optional)

```sql
-- Create a test order (replace user_id and product_id with actual IDs)
INSERT INTO orders (user_id, order_number, status, total_amount, shipping_address, payment_method, payment_status)
VALUES (
  '<your_user_id>',
  'ORD-TEST-001',
  'pending',
  389900,
  '{"firstName": "John", "lastName": "Doe", "address": "123 Main St", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}'::jsonb,
  'card',
  'pending'
);

-- Add order items (replace order_id and product_id with actual IDs)
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (
  '<order_id>',
  '<product_id>',
  1,
  389900
);
```

## Product Reviews (Optional)

```sql
-- Add sample reviews (replace user_id and product_id with actual IDs)
INSERT INTO reviews (product_id, user_id, rating, comment)
VALUES (
  '<product_id>',
  '<user_id>',
  5,
  'Excellent camera! The image quality is outstanding and the autofocus is incredibly fast.'
);
```

## Updating Category References

After inserting categories, update products with category_id:

```sql
-- Get category IDs
SELECT id, name FROM categories;

-- Update products with category IDs (replace <category_id> with actual ID)
UPDATE products 
SET category_id = '<mirrorless_category_id>'
WHERE slug IN ('canon-eos-r5', 'sony-a7-iv', 'nikon-z9');

UPDATE products 
SET category_id = '<lenses_category_id>'
WHERE slug = 'canon-rf-24-70mm';

UPDATE products 
SET category_id = '<accessories_category_id>'
WHERE slug = 'peak-design-backpack';
```

## Verification Queries

Check if data was inserted correctly:

```sql
-- Count records
SELECT 'categories' as table_name, COUNT(*) FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'orders', COUNT(*) FROM orders;

-- View featured products
SELECT name, price, is_featured, stock FROM products WHERE is_featured = true;

-- Check admin users
SELECT ur.role, p.full_name, p.email 
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
LEFT JOIN profiles p ON au.id = p.user_id
WHERE ur.role = 'admin';
```

## Tips

1. **Product Images**: Replace placeholder URLs with real product images
2. **Stock Levels**: Adjust stock numbers based on your inventory
3. **Prices**: All prices are in paise (Indian currency), multiply by 100
4. **Categories**: Create subcategories by setting parent_id
5. **Featured Products**: Mark best-selling items as featured

## Next Steps

1. Add more products to each category
2. Create product variants (different colors, sizes)
3. Add more detailed specifications
4. Upload real product images
5. Create promotional categories (Best Sellers, New Arrivals)

## Troubleshooting

**Can't insert products?**
- Check if you have admin role assigned
- Verify category IDs exist

**Foreign key errors?**
- Ensure categories are created before products
- Verify user_id exists in auth.users

**RLS Policy errors?**
- Make sure you're logged in
- Check if you have the admin role

## Production Considerations

- Remove test data before going live
- Use real product information and images
- Set up proper inventory management
- Configure automated backups
- Enable CDN for product images
