# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Architecture Overview

This is a Next.js 15 portfolio website using App Router with sophisticated performance optimizations and interactive elements.

### Component Structure

- `app/components/aurora/` - Canvas-based background effects with iOS optimizations
- `app/components/projects/` - Project showcase cards with shared types and interactive features
- `app/components/phone/` - Phone mockup component for mobile app previews
- `app/components/navigation/` - Responsive navigation with staggered animations
- `app/components/ui/` - Reusable UI components

### CSS Organization

- `app/globals.css` imports all component-specific CSS files
- `app/styles/components/` contains modular component styles
- Uses Tailwind CSS v4 with custom font configurations

## Key Technologies

- **React 19** with TypeScript for type safety
- **Framer Motion v12** for animations and gestures
- **Platform detection** for iOS-specific optimizations
- **Throttled event handlers** for 60fps performance

## Development Guidelines

### Platform Optimizations

- Aurora background uses Canvas rendering on iOS for performance
- Platform-specific body classes set via `PlatformDetector` component
- Mobile-first responsive design with breakpoint-based rendering

### Performance Patterns

- Use motion values for hardware-accelerated animations instead of state
- Throttle mouse/scroll events to maintain smooth performance
- Lazy load iframes and images on user interaction

### Component Patterns

- Each component directory exports via `index.ts` barrel files
- Project cards use shared `ProjectCardProps` interface in `projects/shared/types.ts`
- Interactive states handled through refs and motion values
- **For project cards with phone mockups**: Always check screenshot dimensions first to determine if a custom aspect ratio variant is needed

### Phone Mockup Component

The `PhoneMockup` component displays content within a device frame. Key considerations:

#### Variants

- `default` - Standard phone mockup with default padding
- `fullleaf` - Specific styling for the Full Leaf app
- `fullleaf-tea` - Full Leaf Tea Company website mockup (standard dimensions)
- `fullleaf-wholesale` - Full Leaf wholesale site mockup (custom 375/812 aspect ratio, 280px max-width)

#### Styling Guidelines

- **DO NOT override padding** for `fullleaf-tea` and `fullleaf-wholesale` variants - they should inherit the default phone mockup padding:
  - Mobile: `24px 8px 28px 8px`
  - Desktop (600px+): `28px 12px 32px 12px`
- Border-radius for images inside tea variants:
  - `fullleaf-tea`: 20px
  - `fullleaf-wholesale`: 18px
- Both tea variants use `object-fit: contain` to display the full image
- The wholesale variant has a white background color applied via inline styles

#### Handling Custom Image Dimensions

When adding new project cards with phone mockups that use screenshots with non-standard dimensions:

1. **Check image dimensions first** - If the screenshot aspect ratio differs from the default 350/600, create a custom variant
2. **Custom aspect ratio approach**:
   ```css
   .custom-variant-mockup {
     aspect-ratio: [image-width]/[image-height]; /* Match exact image dimensions */
     max-width: [calculated-width]px; /* Adjust to maintain proper proportions */
   }
   ```
3. **Example**: The wholesale variant uses `aspect-ratio: 375/812` for its 375×812 image, with `max-width: 280px`
4. **Avoid whitespace** - Matching the phone frame aspect ratio to the image prevents unnecessary side padding
5. **Keep default padding** - Don't override padding to fix dimension issues; adjust the frame dimensions instead

#### PhoneContent Props

- `type`: "iframe" or "image"
- `variant`: Matches PhoneMockup variants
- `src`: URL for iframe or image source
- `blurDataURL`: Base64 blur placeholder for image loading

#### Creating New Project Cards with Phone Mockups

When adding a new project card that includes a phone mockup with a screenshot:

1. **Measure the screenshot dimensions** using browser dev tools or image editor
2. **Compare to standard aspect ratio** (350/600 ≈ 0.583)
3. **If dimensions differ significantly**, create a new variant:

   ```typescript
   // In PhoneMockup component
   variant?: "default" | "fullleaf" | "fullleaf-tea" | "fullleaf-wholesale" | "your-new-variant"

   // In CSS
   .your-new-variant-mockup {
     aspect-ratio: [your-width]/[your-height];
     max-width: [appropriate-width]px;
     border-width: 1px;
     overflow: visible;
   }
   ```

4. **Test on mobile** to ensure borders look consistent with other cards

### Full Leaf Cards (Updated Implementation)

The Full Leaf Tea Company and Full Leaf Tea Company Wholesale cards have been updated to bypass the phone mockup UI entirely:

- **Images**: Use 592x1240 corner-to-corner phone mockup images from `public/project-images/`
  - `full-leaf-tea-phone-mockup-corner-to-corner.png`
  - `wholesale-full-leaf-phone-mockup-corner-to-corner.png`
- **Phone Mockup**: Disabled via `disablePhoneMockup={true}` prop since images contain the phone UI
- **Messaging**: Simplified to single direct link: "Click to visit the website for the full experience"
- **Animation**: Retains sliding animation mechanism on scroll/interaction

Other project cards will be updated to match this pattern in the future.

### TypeScript Configuration

- Absolute imports configured with `@/*` path mapping
- Strict mode enabled for type safety
- ES2017 target with modern React features

## Asset Management

- WebP conversion script available: `./convert-to-webp.sh`
- Images stored in `public/webp/` for optimized loading
- Blur placeholders used for smooth image loading transitions

## Mobile Considerations

- Viewport height handling for Safari toolbar issues
- Touch-optimized interactions and hover states
- Hamburger navigation with staggered Framer Motion animations
