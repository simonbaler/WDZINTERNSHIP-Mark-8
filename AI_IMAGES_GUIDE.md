# AI Product Image Generation Guide

This guide explains how to use the AI image generation system to create professional 3D product images for your camera store.

## Overview

The system automatically generates realistic, studio-quality product images using AI (Google Gemini 2.5 Flash Image Preview) and seamlessly integrates them throughout your application.

## Features

✅ **Automatic Image Loading**: Generated images automatically replace placeholder images across the entire app
✅ **4 Angles Per Product**: Front, back, side, and top views for comprehensive product display
✅ **Storage Integration**: Images stored in Supabase Storage for fast, reliable delivery
✅ **Fallback Support**: Gracefully falls back to placeholder images if AI images aren't generated yet
✅ **Performance Optimized**: Images are cached to minimize storage API calls

## How to Generate Images

### Step 1: Access the Generator

1. Log in as an admin user
2. Navigate to **Admin Dashboard** → **AI Image Generator**
3. You'll see two options:
   - **Bulk Generation**: Generate images for all camera products
   - **Individual Product**: Generate images for specific products

### Step 2: Generate Images

**For All Products:**
```
1. Click "Generate All Images" button
2. Watch the progress bar as images are generated
3. Each product gets 4 images (takes ~8 seconds per product)
4. Total time for 25 cameras: ~3-4 minutes
```

**For Individual Products:**
```
1. Scroll to the product list
2. Click "Generate" next to any product
3. Wait for 4 images to be created (~8 seconds)
```

### Step 3: View Generated Images

After generation completes:
- Images appear in the gallery below the generator
- Each image shows the product name and angle
- Click "Download JSON" to export all image URLs

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────┐
│  User Interface (Admin Image Generator Page)        │
└────────────────┬────────────────────────────────────┘
                 │
                 │ API Request
                 ▼
┌─────────────────────────────────────────────────────┐
│  Edge Function (generate-product-images)            │
│  - Authenticates admin user                         │
│  - Creates AI prompt for realistic camera image     │
│  - Calls Lovable AI API                             │
│  - Converts base64 to image file                    │
│  - Uploads to Supabase Storage                      │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Stores image
                 ▼
┌─────────────────────────────────────────────────────┐
│  Supabase Storage (product-images bucket)           │
│  Path: generated/brand-product-angle-timestamp.png  │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Fetched by
                 ▼
┌─────────────────────────────────────────────────────┐
│  useProductImages Hook                              │
│  - Fetches all generated images on mount            │
│  - Caches results for performance                   │
│  - Maps images to products by slug                  │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Provides images
                 ▼
┌─────────────────────────────────────────────────────┐
│  Components (ProductCard, ProductDetail, etc)       │
│  - Use generated images when available              │
│  - Fall back to placeholder images                  │
└─────────────────────────────────────────────────────┘
```

### File Naming Convention

Generated images follow this pattern:
```
{brand-lowercase}-{product-name-lowercase}-{angle}-{timestamp}.png

Examples:
- canon-eos-r5-front-1234567890.png
- sony-a7-iv-back-1234567891.png
- nikon-z9-side-1234567892.png
```

### Image Storage Location

```
Supabase Storage Bucket: product-images
Path: generated/
Public URL: https://[project].supabase.co/storage/v1/object/public/product-images/generated/[filename]
```

## Integration Points

The generated images are automatically used in:

1. **Product Cards** (`ProductCard.tsx`)
   - Grid views on category pages
   - Search results
   - Related products

2. **Product Detail Page** (`ProductDetail.tsx`)
   - Main product gallery
   - Image carousel
   - Zoomed views

3. **Wishlist** 
   - Product thumbnails

4. **Compare Tool**
   - Side-by-side product images

5. **Cart**
   - Cart item previews

## API Details

### Edge Function Endpoint

```
POST /functions/v1/generate-product-images

Headers:
  Authorization: Bearer [user-jwt-token]
  Content-Type: application/json

Body:
{
  "productName": "EOS R5",
  "productBrand": "Canon",
  "productType": "camera",
  "angle": "front"  // front|back|side|top
}

Response:
{
  "success": true,
  "imageUrl": "https://[project].supabase.co/storage/v1/object/public/product-images/generated/canon-eos-r5-front-1234567890.png",
  "fileName": "canon-eos-r5-front-1234567890.png"
}
```

### AI Prompt Template

The system generates images using prompts like:
```
Ultra-realistic professional product photography of Canon EOS R5 camera, 
front view facing camera, studio lighting, white background, sharp focus, 
highly detailed, 8K resolution, commercial product shot, no text or watermarks
```

## Performance Considerations

### Caching Strategy

The `useProductImages` hook implements intelligent caching:

```typescript
// First load: Fetches from storage (slower)
const { imageMap } = useProductImages();

// Subsequent loads: Uses cached data (instant)
const { imageMap } = useProductImages();
```

### Rate Limiting

- Lovable AI has rate limits (requests per minute)
- The generator adds 2-second delays between images
- Bulk generation is throttled to prevent hitting limits

### Storage Costs

- Each image: ~200-500 KB
- 25 cameras × 4 angles = 100 images
- Total storage: ~20-50 MB
- Supabase free tier: 1 GB storage (plenty of room)

## Troubleshooting

### Images Not Showing

1. **Check if images were generated:**
   ```
   Go to Admin → Image Generator
   Look for generated images in the gallery
   ```

2. **Check storage bucket:**
   ```
   Go to Lovable Cloud backend
   Navigate to Storage → product-images
   Look in the "generated" folder
   ```

3. **Check browser console:**
   ```
   Open DevTools → Console
   Look for image loading errors
   ```

### Generation Failed

Common issues:

1. **Rate limit exceeded (429 error):**
   - Wait 1 minute between bulk generations
   - Use individual generation for single products

2. **Payment required (402 error):**
   - Add credits to your Lovable workspace
   - Go to Settings → Workspace → Usage

3. **Authentication failed:**
   - Ensure you're logged in as admin
   - Check that your user has admin role in user_roles table

### Slow Performance

If image loading is slow:

1. **Reduce image quality** (modify edge function):
   ```typescript
   // In generate-product-images/index.ts
   // Add image optimization
   ```

2. **Implement lazy loading**:
   ```typescript
   <img loading="lazy" ... />
   ```

3. **Use thumbnails** for grid views

## Best Practices

### When to Generate Images

✅ **Generate when:**
- Adding new products
- Updating product information
- Improving image quality
- Changing product angles

❌ **Don't regenerate when:**
- Making price changes
- Updating inventory
- Minor description edits

### Image Quality

For best results:
- Generate images in good lighting conditions
- Use consistent backgrounds
- Maintain aspect ratios
- Generate all 4 angles for completeness

### Storage Management

Keep storage organized:
```
product-images/
  ├── generated/           # AI-generated images
  ├── uploaded/            # Manually uploaded images
  └── optimized/           # Processed/resized versions
```

## Future Enhancements

Potential improvements:

1. **Batch size control**: Generate 5 products at a time
2. **Custom prompts**: Let admins customize lighting, background
3. **Image optimization**: Auto-resize for different screen sizes
4. **Background removal**: Generate transparent PNGs
5. **Style consistency**: Ensure all products match visual style
6. **Quality presets**: High/Medium/Low quality options
7. **Progress notifications**: Email when bulk generation completes

## Support

If you need help:
1. Check this guide first
2. Review console logs for errors
3. Contact Lovable support for Lovable AI issues
4. Check Supabase documentation for storage issues

---

**Note**: The AI image generator uses Lovable AI which requires credits. Monitor your usage in Settings → Workspace → Usage to avoid service interruptions.
