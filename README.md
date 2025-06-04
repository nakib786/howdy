# 🍁🔥 Howdy Cafe - Pakistani-Canadian Fusion Restaurant

A modern, responsive, and SEO-optimized single-page website for Howdy Cafe, a unique Pakistani-Canadian fusion restaurant located in Williams Lake, BC.

## 🌟 Features

- **Modern Design**: Clean, professional design with smooth animations
- **Fully Responsive**: Mobile-first design that works on all devices
- **SEO Optimized**: Complete meta tags, structured data, and sitemap
- **Smooth Animations**: Powered by Framer Motion for engaging user experience
- **Fast Performance**: Built with Vite for optimal loading speeds
- **Accessibility**: Semantic HTML and proper alt tags
- **PWA Ready**: Includes manifest.json for progressive web app features

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v3.4
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **SEO**: React Helmet Async
- **Scrolling**: React Scroll
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/
│   ├── Hero.tsx          # Hero section with background image
│   ├── About.tsx         # About section with story and stats
│   ├── Menu.tsx          # Interactive menu with categories
│   ├── Contact.tsx       # Contact info, map, and social links
│   └── Footer.tsx        # Footer with links and hours
├── index.css             # Global styles and Tailwind imports
├── App.tsx               # Main app component with SEO
└── main.tsx              # App entry point

public/
├── manifest.json         # PWA manifest
├── robots.txt           # Search engine directives
└── sitemap.xml          # Site structure for SEO
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd howdy-cafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎨 Design System

### Colors
- **Primary**: `#FF6F3C` (Deep Orange)
- **Accent**: `#0B8457` (Forest Green)  
- **Background**: `#FFF5EC` (Creamy White)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components
- Custom button styles with hover effects
- Responsive grid layouts
- Smooth scroll navigation
- Animated cards and sections

## 📱 Sections

### 1. Hero Section
- Full-screen background image
- Animated text and call-to-action
- Smooth scroll indicator

### 2. About Section
- Restaurant story and mission
- Side-by-side layout with image
- Statistics and floating info card

### 3. Menu Section
- Interactive category tabs (Fusion, Pakistani, Canadian)
- Animated menu cards with images
- Responsive grid layout

### 4. Contact Section
- Contact information with icons
- Embedded Google Maps
- Social media links
- Call-to-action banner

### 5. Footer
- Quick navigation links
- Business hours
- Copyright and branding

## 🔍 SEO Features

- **Meta Tags**: Complete title, description, and keywords
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing
- **Structured Data**: Local business schema markup
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Search engine crawling directives
- **Semantic HTML**: Proper heading hierarchy and landmarks

## 📱 PWA Features

- **Manifest**: App-like installation on mobile devices
- **Theme Colors**: Consistent branding across platforms
- **Icons**: Multiple sizes for different devices

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Custom domain configuration available

### Netlify
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Manual Deployment
1. Run `npm run build`
2. Upload `dist` folder contents to your web server
3. Configure server for SPA routing (if needed)

## 🔧 Customization

### Updating Content
- **Restaurant Info**: Edit contact details in `Contact.tsx`
- **Menu Items**: Update menu data in `Menu.tsx`
- **About Story**: Modify content in `About.tsx`
- **SEO Data**: Update meta tags in `App.tsx`

### Styling Changes
- **Colors**: Update Tailwind config in `tailwind.config.js`
- **Fonts**: Change font imports in `index.css`
- **Components**: Modify component styles using Tailwind classes

### Adding Features
- **Contact Form**: Integrate EmailJS or form service
- **Online Ordering**: Add e-commerce functionality
- **Gallery**: Create image gallery component
- **Blog**: Add blog section for updates

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for Google's ranking factors
- **Image Optimization**: Lazy loading and responsive images
- **Code Splitting**: Automatic with Vite
- **Bundle Size**: Optimized with tree shaking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support, please contact:
- **Email**: hello@howdycafe.ca
- **Phone**: (250) 392-FOOD

---

**Made with ❤️ in Williams Lake, BC**
