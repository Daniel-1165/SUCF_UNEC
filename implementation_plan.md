# Implementation Plan - Design System Update

This plan outlines the changes made to the project's design system to align with the provided inspiration images (specifically the "Approven" aesthetic).

## User Objective
Update the background and font of the project based on the uploaded inspiration images.

## Design Decisions
1.  **Typography**: 
    -   Adopted **'Inter'** as the primary typeface. It matches the clean, geometric sans-serif look of the "Approven" text.
    -   Adopted **'Space Grotesk'** for headings to give a bold, modern, and slightly quirky "tech/premium" feel that complements the "Shopify/Approven" bold header styles.
2.  **Color Palette**:
    -   **Background**: Shifted from a Mint/Green radial gradient to a **Sophisticated Light Gray (`#E5E5E5`)**. This mimics the distinct gray background in the inspiration image.
    -   **Text**: Shifted main text to a sharp black/dark gray (`#111111`) to ensure high contrast against the gray.
    -   **Accents**: Retained the **Emerald Green** brand colors but used them more selectively (buttons, highlights) rather than as the base wash.
3.  **Visual Depth**:
    -   Updated the `zeni-mesh-gradient` to use white and silver highlights instead of green, creating a subtle "foggy/glass" texture on the gray background.
    -   Neutralized card borders to `gray-200` to sit softly on the gray background.

## Changes Verified
-   [x] Updated `src/index.css`:
    -   New Google Fonts import (Inter + Space Grotesk).
    -   Updated `:root` variables (`--bg-main`, `--text-main`, `--font-main`).
    -   Updated `body` background.
    -   Refined `.zeni-mesh-gradient` to be gray-scale.
    -   Refined `.zeni-card` and `.zeni-card-dark` styles.
-   [x] Updated `tailwind.config.js`:
    -   Mapped `sans` to 'Inter'.
    -   Mapped `heading` and `serif` to 'Space Grotesk'.

## Next Steps
-   The user should review the changes in the browser.
-   If specific components (like the Navbar or Footer) feel too "Green" still, we can refine them individually, but the global theme is now set.
