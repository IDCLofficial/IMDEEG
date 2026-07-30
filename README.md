# Ministry of Finance Web App

This project is a modern, modular web application built with [Next.js](https://nextjs.org), TypeScript, and Tailwind CSS. It is designed for the Imo State Ministry of Finance, providing a comprehensive digital platform for transparent governance, accountable finance, and sustainable growth.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Components](#components)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Learn More](#learn-more)

## Features
- **Next.js 15** with App Router and Turbopack for modern routing and fast development
- **React 19** with the latest features and performance improvements
- **TypeScript** for type safety and maintainability
- **Tailwind CSS 4** for rapid, utility-first styling
- **Custom Satoshi font family** for consistent branding
- **Responsive, fixed navigation bar** with backdrop blur effect
- **Hero section** with dynamic background images and gradient overlays
- **Interactive statistics display** showcasing ministry achievements
- **Featured partners section** with partner logos and branding
- **Latest news and media sections** for content management
- **Call-to-action sections** for user engagement
- **Footer with ministry information** and contact details
- **Advertisement and quick links components** for enhanced user experience

## Project Structure
```
/mof
  /src
    /app
      /about-us          # About Us page
      /contact-us        # Contact Us page
      /events           # Events page
      /media            # Media page
      /news             # News page
      /projects         # Projects page
      /units            # Units page
      layout.tsx        # Root layout with navigation
      page.tsx          # Home page
      globals.css       # Global styles
    /components
      AboutCommisioner.tsx    # Commissioner information component
      AboutSection.tsx        # About section with images
      Advertisement.tsx       # Advertisement component
      AppLink.tsx            # Customizable link component
      CTABlock.tsx           # Call-to-action block
      CTASection.tsx         # Call-to-action section
      FeaturedPartners.tsx   # Partner logos display
      Footer.tsx             # Footer component
      Hero.tsx              # Hero section with background
      LatestNews.tsx         # Latest news component
      Navbar.tsx            # Fixed navigation bar
      NavLinks.tsx          # Navigation links
      QuickLinks.tsx        # Quick links component
      Stats.tsx             # Statistics display
      Title.tsx             # Styled title component
    /fonts
      /satoshi-cdnfonts     # Custom Satoshi font family
        Satoshi-Regular.otf
        Satoshi-Medium.otf
        Satoshi-Bold.otf
        Satoshi-Italic.otf
        ... (other weights)
  /public
    /images               # Image assets
      heroImage.png       # Hero background
      homeImage1.png      # About section images
      homeImage2.png
      commissioner.png    # Commissioner photo
      advert_flier.png   # Advertisement assets
      # Partner logos
      huawei.png
      cisco.png
      microsoft.png
      # ... other partner logos
```

### Main Pages
- **Home** (`/`) - Landing page with hero, about, stats, and partners
- **About Us** (`/about-us`) - Detailed ministry information
- **Projects** (`/projects`) - Ministry projects showcase
- **News** (`/news`) - Latest news and updates
- **Units** (`/units`) - Ministry units and departments
- **Events** (`/events`) - Upcoming and past events
- **Media** (`/media`) - Media resources and downloads
- **Contact Us** (`/contact-us`) - Contact information and form

## Components

### Core Components
- **Hero**: Full-screen hero section with dynamic background, gradient overlay, and compelling copy
- **Navbar**: Fixed header with logo and navigation, featuring backdrop blur effect
- **NavLinks**: Responsive navigation links for all main pages
- **AppLink**: Customizable link component supporting variants and sizes
- **Title**: Styled title component for consistent headings

### Content Components
- **AboutSection**: Two-column layout with images and descriptive text
- **AboutCommisioner**: Commissioner profile with image and information
- **Stats**: Achievement statistics with animated counters
- **FeaturedPartners**: Partner logos in a responsive grid layout
- **LatestNews**: News feed component with latest updates
- **QuickLinks**: Quick access links for common tasks
- **Advertisement**: Promotional content display

### Layout Components
- **CTASection**: Call-to-action section for user engagement
- **CTABlock**: Individual call-to-action blocks
- **Footer**: Comprehensive footer with ministry information, links, and contact details

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. **Configure environment variables:**
  Create a `.env.local` file with your existing project variables and add the support-ticket WhatsApp settings:
  ```bash
  # Required for fallback delivery link
  WHATSAPP_TO_NUMBER=9129259960

  # Termii direct delivery (optional, used first when configured)
  TERMII_API_KEY=your_termii_api_key
  TERMII_SENDER_ID=IMDEEG
  TERMII_CHANNEL=whatsapp
  TERMII_BASE_URL=https://api.ng.termii.com

  # Chatbot provider
  GROQ_API_KEY=your_groq_api_key
  ```

  Number handling notes:
  - `WHATSAPP_TO_NUMBER` can be provided as `9129259960`, `09129259960`, or `2349129259960`.
  - The contact form requires the visitor WhatsApp number and uses it as the preferred sender value for Termii requests.

  Support-ticket delivery strategy:
  - Try Termii first for automatic WhatsApp delivery.
  - If Termii fails, the system returns a prefilled `wa.me` link so the user can send the ticket manually.

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the app.

5. **Edit pages/components:**
   Modify files in `src/app/` or `src/components/` to update content and UI. The app supports hot reloading with Turbopack.

## Available Scripts
- `dev`: Start the development server with Turbopack
- `build`: Build the app for production
- `start`: Start the production server
- `lint`: Run ESLint for code quality

## Key Features Implemented

### Ministry-Specific Content
- **Transparent Governance**: Focus on accountability and transparency in financial management
- **Sustainable Growth**: Emphasis on economic development and fiscal responsibility
- **Digital Transformation**: Integration of modern technology for efficient service delivery
- **Partner Ecosystem**: Showcase of strategic partnerships with technology companies

### Technical Highlights
- **Performance Optimized**: Built with Next.js 15 and React 19 for optimal performance
- **Responsive Design**: Mobile-first approach with Tailwind CSS 4
- **Type Safety**: Full TypeScript implementation for robust development
- **Modern Styling**: Custom Satoshi font and professional design system
- **SEO Ready**: Optimized metadata and structured content

## Deployment
The recommended way to deploy this app is via [Vercel](https://vercel.com/). You can also use any platform that supports Node.js and Next.js.

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

_This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and customized for the Imo State Ministry of Finance, focusing on transparent governance and sustainable economic growth._

# IMDEEG