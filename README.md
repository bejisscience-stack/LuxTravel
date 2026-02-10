# LuxTravel - Premium Bus Tours

Next.js 14 website for LuxTravel, a bus tour company.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Backend**: Supabase
- **Internationalization**: next-intl (EN/KA/RU)
- **Icons**: lucide-react
- **Animations**: framer-motion
- **Styling**: Custom CSS (CSS Modules)

## Project Structure

```
/app              - Next.js App Router pages and layouts
/components       - Reusable React components
/lib              - Utility functions and Supabase client
/messages         - i18n translation files (EN/KA/RU)
/styles           - Global styles and CSS modules
/types            - TypeScript type definitions
/public           - Static assets (images, fonts, etc.)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Add your Supabase credentials to `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Design System

### Colors
- Primary Background: `#050505`
- Secondary Background: `#000000`
- Text Primary: `#F0F2F5`
- Text Secondary: `#A0A0A0`
- Accent Red: `#B8182F`

### Typography
- **Headings**: Montserrat (100, 200, 300, 400, 600)
- **Body**: Cormorant Garamond (300, 400, italic)

## Features (Phase 1)

- Home page with hero section
- Bus fleet showcase
- Real bus features list
- Contact CTA
- Multi-language support (EN/KA/RU)
- Responsive design

## Reference Files

- `ORIGINAL_REACT_CODE_REFERENCE.md` - Original React code reference
- `LuxTravel_Phase1_Project_Guide.md` - Project guide
- `LuxTravel_Phase1_Prompts_Guide.md` - Prompts guide
