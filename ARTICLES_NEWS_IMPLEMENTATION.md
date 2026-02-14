# Articles & News Feature Implementation

This document outlines the complete implementation of the Articles and News features for the SUCF UNEC website.

## Overview

The implementation includes:
- **Articles Page**: Displays all articles with category filtering
- **News Page**: Displays all news updates
- **Detail Pages**: Individual pages for each article and news item
- **Home Page Sections**: Preview sections showing 3 latest articles and news
- **Admin Panel**: Full CRUD operations for managing articles and news
- **Routing**: Proper navigation and URL structure
- **Database**: Supabase tables with RLS policies

## Features Implemented

### 1. Public Pages

#### Articles Page (`/articles`)
- Modern card-based layout
- Category filtering (Faith, Campus Life, Testimonies, Events, Other)
- Search functionality
- Responsive design
- Emerald green accent color
- Links to individual article pages

#### News Page (`/news`)
- Similar layout to Articles
- Blue accent color for differentiation
- No category filtering (simpler structure)
- Links to individual news pages
- **Note**: News page is NOT in the main navigation (as per requirements)

#### Article Detail Page (`/articles/:id`)
- Full article view with featured image
- Rich text content rendering
- Author and date information
- Category badge
- Related articles section
- Back navigation

#### News Detail Page (`/news/:id`)
- Full news view with featured image
- Rich text content rendering
- Date information
- Related news section
- Back navigation

#### Home Page Sections
- **Latest Articles**: Shows 3 most recent articles
- **Fellowship News**: Shows 3 most recent news items
- Both sections include "View All" buttons
- Responsive grid layout
- Animated on scroll

### 2. Admin Panel

#### Articles Management
- Create new articles with:
  - Title
  - Author (optional)
  - Category selection
  - Featured image upload
  - Rich text editor (ReactQuill)
- Edit existing articles
- Delete articles
- View all articles in grid layout

#### News Management
- Create news updates with:
  - Title
  - Featured image upload
  - Rich text editor (ReactQuill)
- Edit existing news
- Delete news
- View all news in grid layout

### 3. Navigation

- **Articles** link added to main navbar
- **News** intentionally excluded from navbar (accessible via home page section)
- Mobile menu includes Articles link
- Proper routing in App.jsx

## Files Created/Modified

### New Files Created
1. `src/pages/Articles.jsx` - Articles listing page
2. `src/pages/News.jsx` - News listing page
3. `src/pages/ArticleDetail.jsx` - Individual article view
4. `src/pages/NewsDetail.jsx` - Individual news view
5. `src/components/ArticlesSection.jsx` - Home page articles section
6. `src/components/NewsSection.jsx` - Home page news section
7. `supabase_articles_news_tables.sql` - Database schema

### Modified Files
1. `src/App.jsx` - Added routes for articles and news
2. `src/components/Navbar.jsx` - Added Articles link
3. `src/pages/Home.jsx` - Added ArticlesSection and NewsSection
4. `src/pages/AdminPanel.jsx` - Added full CRUD for articles and news

## Database Setup

### Step 1: Create Tables

Run the SQL script `supabase_articles_news_tables.sql` in your Supabase SQL Editor:

```sql
-- The script creates:
-- 1. articles table
-- 2. news table
-- 3. RLS policies for both tables
-- 4. Indexes for performance
-- 5. Triggers for updated_at timestamps
```

### Step 2: Verify Tables

After running the script, verify that:
- `articles` table exists with columns: id, title, content, author, category, image_url, created_at, updated_at
- `news` table exists with columns: id, title, content, image_url, created_at, updated_at
- RLS is enabled on both tables
- Policies allow public read and authenticated write

### Step 3: Storage Bucket

Ensure you have a storage bucket for images:
- Bucket name: `content-images`
- Folders: `articles/` and `news/`
- Public access enabled for reading

## Usage Guide

### For Administrators

1. **Access Admin Panel**: Navigate to `/admin`
2. **Create Article**:
   - Click "Articles" tab
   - Fill in title, author, category
   - Upload featured image
   - Write content using rich text editor
   - Click "Publish Article"

3. **Create News**:
   - Click "News" tab
   - Fill in title
   - Upload featured image
   - Write content using rich text editor
   - Click "Publish News"

4. **Edit/Delete**:
   - Hover over any article/news card
   - Click edit icon to modify
   - Click delete icon to remove

### For Users

1. **View Articles**:
   - Click "Articles" in navigation
   - Browse or filter by category
   - Click any article to read full content

2. **View News**:
   - Scroll to "Fellowship News" section on home page
   - Click "View All News" or any news item
   - Read full news content

3. **Home Page**:
   - See latest 3 articles in "Latest Articles" section
   - See latest 3 news in "Fellowship News" section

## Design Decisions

1. **Color Scheme**:
   - Articles: Emerald green (#059669)
   - News: Blue (#2563eb)
   - Provides visual differentiation

2. **Navigation**:
   - Articles in main navbar (important content)
   - News not in navbar (accessible via home page)
   - Reduces navbar clutter

3. **Content Management**:
   - Rich text editor for flexible formatting
   - Image uploads for visual appeal
   - Category system for articles organization

4. **Performance**:
   - Lazy loading of images
   - Indexed database queries
   - Optimized component rendering

## Testing Checklist

- [ ] Articles page loads and displays correctly
- [ ] News page loads and displays correctly
- [ ] Article detail pages work
- [ ] News detail pages work
- [ ] Home page sections display latest items
- [ ] Admin can create articles
- [ ] Admin can create news
- [ ] Admin can edit articles/news
- [ ] Admin can delete articles/news
- [ ] Category filtering works on articles page
- [ ] Search works on both pages
- [ ] Images upload correctly
- [ ] Rich text formatting displays properly
- [ ] Mobile responsive design works
- [ ] Navigation links work correctly

## Troubleshooting

### Articles/News not displaying
- Check Supabase tables exist
- Verify RLS policies are correct
- Check browser console for errors

### Images not uploading
- Verify storage bucket exists
- Check bucket permissions
- Ensure file size is reasonable

### Admin panel not working
- Verify user is authenticated
- Check user has admin privileges
- Review browser console for errors

## Next Steps

1. Run the SQL script in Supabase
2. Test the application locally
3. Create sample articles and news
4. Deploy to production
5. Monitor for any issues

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify Supabase connection
3. Review the implementation files
4. Test with sample data first
