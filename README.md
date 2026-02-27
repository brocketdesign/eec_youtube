# EEC Landing Page

A high-converting React landing page for "EEC - Email Engagement Community" targeting YouTube gaming creators with 1M+ subscribers.

![EEC Landing Page](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-0055FF?logo=framer)

## 🎯 Project Overview

**EEC (Email Engagement Community)** helps gaming content creators build email lists they own, reducing dependency on YouTube's algorithm and creating sustainable revenue streams.

### Target Audience
- YouTube gamers with 1M+ subscribers
- Age: 18-35
- Games: Fortnite, GTA, Minecraft, Call of Duty
- Pain points: Algorithm dependency, low engagement, sponsor reliance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd eec-landing

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server
The dev server runs at `http://localhost:5173` by default.

## 📁 Project Structure

```
eec-landing/
├── public/
│   ├── favicon.svg          # Site favicon
│   └── og-image.jpg         # Open Graph image (to be added)
├── src/
│   ├── components/
│   │   ├── sections/        # Page sections
│   │   │   ├── Navigation.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Problem.jsx
│   │   │   ├── Solution.jsx
│   │   │   ├── CaseStudy.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── FinalCTA.jsx
│   │   │   └── Footer.jsx
│   │   └── ui/              # Reusable UI components
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── AnimatedCounter.jsx
│   │       ├── ParticleBackground.jsx
│   │       └── Accordion.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useScrollAnimation.js
│   │   └── useSmoothScroll.js
│   ├── styles/              # Global styles
│   │   └── variables.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | `#0a0a0a` | Main background |
| `--color-bg-secondary` | `#111111` | Section backgrounds |
| `--color-bg-card` | `#1a1a1a` | Card backgrounds |
| `--color-neon-green` | `#00ff88` | Primary accent, CTAs |
| `--color-neon-cyan` | `#00d4aa` | Secondary accent |
| `--color-neon-orange` | `#ff6b35` | Warning, contrast |
| `--color-text-primary` | `#ffffff` | Headings |
| `--color-text-secondary` | `#a0a0a0` | Body text |

### Typography

- **Primary Font**: Inter (weights: 400, 500, 600, 700, 800)
- **Display Font**: Poppins (weights: 600, 700, 800, 900)

### Spacing Scale

- Base unit: 4px
- Scale: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24

## 🎬 Animations

### Implemented Animations

| Animation | Library | Trigger |
|-----------|---------|---------|
| Scroll fade-in | Framer Motion | Viewport |
| Number counters | Framer Motion + RAF | Viewport |
| Card hover lift | CSS + Framer Motion | Hover |
| Flip cards | CSS 3D transforms | Hover |
| Button pulse glow | CSS keyframes | Always |
| Particle background | Canvas API | Always |
| Smooth scroll | CSS + JS | Click |
| Accordion expand | Framer Motion | Click |

### Animation Timing

- Fast transitions: 150ms
- Base transitions: 250ms
- Slow transitions: 350ms
- Counter duration: 2000ms

## 📱 Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | < 640px | Phones |
| Tablet | 640px - 1024px | Tablets |
| Desktop | > 1024px | Laptops |
| Large | > 1280px | Desktops |

## 🔧 Component Usage

### Button

```jsx
import Button from './components/ui/Button';

// Variants: primary, secondary, outline, ghost, orange
// Sizes: sm, md, lg, xl

<Button variant="primary" size="lg" onClick={handleClick}>
  Get Started
</Button>

<Button variant="outline" href="https://example.com">
  Learn More
</Button>
```

### Card

```jsx
import Card from './components/ui/Card';

<Card hover glow>
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>
```

### Animated Counter

```jsx
import AnimatedCounter from './components/ui/AnimatedCounter';

<AnimatedCounter 
  value={32800000} 
  formatter={(v) => `${(v / 1000000).toFixed(1)}M`}
/>
```

### Accordion

```jsx
import Accordion from './components/ui/Accordion';

const items = [
  { question: 'Q1?', answer: 'A1' },
  { question: 'Q2?', answer: 'A2' },
];

<Accordion items={items} />
```

## 🪝 Custom Hooks

### useScrollAnimation

```jsx
import { useScrollAnimation } from './hooks/useScrollAnimation';

const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });
```

### useSmoothScroll

```jsx
import { useSmoothScroll } from './hooks/useSmoothScroll';

const { scrollToSection, scrollToTop } = useSmoothScroll();

scrollToSection('pricing');
```

## 🔍 SEO

### Meta Tags Implemented

- Title & description
- Open Graph (Facebook)
- Twitter Cards
- Canonical URL
- Structured data (JSON-LD)

### To Update Before Launch

1. Replace `https://eec.community` with actual domain in `index.html`
2. Add actual Open Graph image at `/public/og-image.jpg` (1200x630px)
3. Update social media links in footer
4. Add Google Analytics/Tag Manager
5. Verify structured data with Google's Rich Results Test

## 🚀 Deployment

### Build

```bash
npm run build
```

Output goes to `dist/` folder.

### Recommended Platforms

- **Vercel**: `vercel --prod`
- **Netlify**: Drag `dist/` folder or use CLI
- **Cloudflare Pages**: Connect Git repo

### Environment Variables

Create `.env` file for environment-specific values:

```env
VITE_CALENDLY_URL=https://calendly.com/your-link
VITE_API_ENDPOINT=https://api.example.com
```

## 🧪 Performance

### Current Metrics (Estimated)

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: 90+

### Optimization Techniques

- Code splitting with dynamic imports
- Lazy loading for below-fold content
- Optimized images (WebP format recommended)
- CSS containment for animations
- Preconnect to external domains

## 📝 Content Customization

### Updating Copy

All section content is inline in component files:

- `Hero.jsx`: Headline, subheadline, counter values
- `Problem.jsx`: Fear cards content
- `Solution.jsx`: Steps and stats
- `CaseStudy.jsx`: Before/after numbers
- `Features.jsx`: Feature list
- `Pricing.jsx`: Price and features
- `FAQ.jsx`: Questions and answers

### Updating Colors

Edit `src/styles/variables.css` to change the color scheme.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For questions or issues:
- Email: hello@eec.community
- Twitter: @eec_community

---

Built with ⚡ by the EEC Team
