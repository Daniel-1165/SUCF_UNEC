-- Run this in your Supabase SQL Editor to populate the gallery table with your local images
-- This will allow them to be managed via the Admin Panel and load from the database

INSERT INTO public.gallery (image_url, caption, category)
VALUES 
    ('/assets/gallery/img1.jpg', 'Worship Session', 'Worship'),
    ('/assets/gallery/img2.jpg', 'Fellowship Moments', 'Fellowship'),
    ('/assets/gallery/img3.jpg', 'Bible Study Group', 'Events'),
    ('/assets/gallery/img4.jpg', 'Outdoor Outreach', 'Outreach'),
    ('/assets/gallery/img5.jpg', 'Prayer Meeting', 'Worship'),
    ('/assets/gallery/img6.jpg', 'Freshers Welcome', 'Events'),
    ('/assets/gallery/img7.jpg', 'Group Photo', 'Fellowship'),
    ('/assets/gallery/img8.jpg', 'Sunday Glory', 'Worship'),
    ('/assets/gallery/img9.jpg', 'Evangelism Drive', 'Outreach')
ON CONFLICT DO NOTHING;
