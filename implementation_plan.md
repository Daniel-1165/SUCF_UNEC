# SUCF UNEC Website Implementation Plan

## 1. Project Overview
**Goal**: Create a premium, modern, and welcoming website for the Scripture Union Campus Fellowship, University of Nigeria Enugu Campus (SUCF UNEC).
**Access Model**: Gated Content. The Home page is public, but all other feature pages (About, Gallery, Articles, etc.) require authentication/registration via Supabase.
**Vibe**: Spiritual, Academic/Student-friendly, Fresh, and "Premium" (using modern UI trends like glassmorphism and smooth animations).
**Slogan**: "Unique fellowship on campus" (To be prominently featured).

## 2. Design Inspiration & References
*   **Visual Style**: Based on the "InstaVision AI" reference image.
    *   **Layout**: Clean split-screen hero sections, floating grid images, ample whitespace.
    *   **Aesthetics**: Glassmorphism (frosted glass effects), soft green gradients, rounded corners.
*   **Color Palette**:
    *   **Primary Green**: `#064e3b` (Deep fellowship green) - for text/strong accents.
    *   **Accents**: `#10b981` to `#34d399` (Vibrant green gradients) - for buttons and backgrounds.
    *   **Neutral**: `#ffffff` (White) & `#f3f4f6` (Light Grey).
    *   **Highlight**: `#f59e0b` (Gold/Yellow) - subtle touches (drawn from the freshers flyer).
*   **Content Source**:
    *   **Welcome Message**: "Welcome to the Den", "Upholding righteous standards".
    *   **Weekly Activities**:
        *   **Sunday**: Sunday Fellowship @ Architecture Auditorium Unec (3:00 PM PROMPT).
        *   **Wednesday**: General Prayers @ Freedom Square (Opp Marierre Hostel) Unec (6:00 PM PROMPT).
        *   **Thursday**: Bible Study & Follow up @ Architecture Auditorium Unec (5:00 PM PROMPT).
        *   *Note*: "And other Weekly Wing Activities and special programs."
    *   **Contact**: Phone numbers and Social handles from flyers.

## 3. Technology Stack
*   **Framework**: React (via Vite) - for a fast, responsive Single Page Application (SPA).
*   **Language**: JavaScript (JSX).
*   **Styling**: Vanilla CSS (CSS Modules or standard CSS with Variables) - to ensure custom, pixel-perfect design without fighting framework defaults.
*   **Routing**: `react-router-dom` for navigation between pages.
*   **Animations**: `framer-motion` (optional, for entry animations) or standard CSS transitions.
*   **Icons**: `react-icons` (using Phosphor or Heroicons sets).

## 4. Sitemap & Page Structure

### A. Navigation Bar (Sticky/Floating)
*   **Left**: SUCF UNEC Logo.
*   **Center**: Home, About, Activities, Gallery, Articles, Contact.
*   **Right**: "Join Us" CTA Button.

### B. Pages

#### 1. Home Page
*   **Hero Section**:
    *   Headline: "Empowering You for Destiny".
    *   Subheadline: "The Unique Fellowship on Campus."
    *   Visual: Modern masonry grid of fellowship moments with glass effects.
*   **Highlights**: Quick preview of latest Articles or Gallery items.
*   **Event Countdown**: Next fellowship timer.

#### 2. About Us
*   **History**: Brief story of SUCF UNEC.
*   **Values**: "Upholding Righteous Standards".
*   **Executives**: Leadership team grid.

#### 3. Activities (Weekly)
*   Visual Timeline/Cards for Sunday, Wednesday, Thursday meetings.
*   Maps/Directions to Architecture Auditorium & Freedom Square.

#### 4. Gallery (New)
*   A masonry or grid layout of high-quality images.
*   Categories: "Worship", "Drama", "Outreach", "Sunday Service".
*   Lightbox effect (clicking image opens full screen).

#### 5. Articles / Blog (New)
*   **Purpose**: Spiritual articles, President's address, testimonies, student creative writing.
*   **Layout**:
    *   Featured Article (Large card with image).
    *   List of recent articles (Grid).
    *   "Read More" individual article view.

#### 6. Contact
*   "Get in Touch" form, Phone numbers, Social Media links.

#### 8. Gallery Update
*   Add 5 new user-uploaded images to the gallery.
*   Categorize them under "Events" and "Fellowship".
*   Ensure responsive grid layout handles the new items.

## 5. Development Phases
1.  **Setup**: Initialize Vite project, set up folder structure. (Done)
2.  **Styles**: Define CSS variables (green palette, glass effects) in `index.css`. (Done)
3.  **Components**: Build Navbar, Footer, Button, Card, ImageGrid. (Done)
4.  **Feature Pages**: Build Home, Gallery, and Articles pages first (high impact). (Done - Basic versions)
5.  **Join Us Page**: Implementation of Supabase Auth for student registration. (Done)
6.  **Refinement & Content Depth**: (Done)
    *   **Home Page**: Add "Latest Articles" preview and "Gallery Sneak Peek".
    *   **Home Page**: Implement high-impact "Next Fellowship Countdown".
    *   **Article System**: Implement individual article view pages (`/articles/:id`).
    *   **About Page**: Finalize Executive profiles and historical content.
    *   **Gallery**: Integration of final 5 high-res fellowship images.
7.  **Technical Polish**: (Done)
    *   Precise "InstaVision" styling (glassmorphism), responsiveness, and scroll-triggered animations.

---
**Status**: Project Completed (Frontend Only) - Supabase integration removed as per request.
**Current Focus**: Handover / Maintenance.
