# Delivery Services Update Guide

## Current Status

✅ **DoorDash** - Active and working
- URL: `https://www.doordash.com/store/howdy-cafe-williams-lake-36009249`
- Status: Live and functional

⏳ **Skip the Dishes** - Coming Soon
- URL: `#` (placeholder)
- Status: Disabled with "Coming Soon" badge

⏳ **Uber Eats** - Coming Soon  
- URL: `#` (placeholder)
- Status: Disabled with "Coming Soon" badge

## How to Update URLs

When you get the Skip the Dishes and Uber Eats URLs, update them in:

### File: `src/components/DeliveryServices.tsx`

Find the `deliveryServices` array around line 15 and update the URLs:

```typescript
const deliveryServices: DeliveryService[] = [
  {
    name: 'DoorDash',
    logo: DoorDashLogo,
    url: 'https://www.doordash.com/store/howdy-cafe-williams-lake-36009249', // ✅ Already set
    color: '#EF3B24',
    hoverColor: '#D32F2F',
    description: 'Order for delivery'
  },
  {
    name: 'Skip the Dishes',
    logo: SkipLogo,
    url: 'YOUR_SKIP_THE_DISHES_URL_HERE', // 🔄 Update this
    color: '#FF8000',
    hoverColor: '#E65100',
    description: 'Order for delivery' // 🔄 Change from "Coming soon"
  },
  {
    name: 'Uber Eats',
    logo: UberLogo,
    url: 'YOUR_UBER_EATS_URL_HERE', // 🔄 Update this
    color: '#06C167',
    hoverColor: '#00A651',
    description: 'Order for delivery' // 🔄 Change from "Coming soon"
  }
];
```

### File: `src/components/Menu.tsx`

Also update the URLs in the Menu section around line 390:

```typescript
// Update the Skip the Dishes link
<a
  href="YOUR_SKIP_THE_DISHES_URL_HERE" // 🔄 Update this
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
>
  <img src="/Skip.svg" alt="Skip the Dishes" className="w-6 h-6 filter brightness-0 invert" />
  <span>Order on Skip the Dishes</span> {/* 🔄 Remove "- Coming Soon" */}
</a>

// Update the Uber Eats link
<a
  href="YOUR_UBER_EATS_URL_HERE" // 🔄 Update this
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
>
  <img src="/UberLogo.svg" alt="Uber Eats" className="w-6 h-6 filter brightness-0 invert" />
  <span>Order on Uber Eats</span> {/* 🔄 Remove "- Coming Soon" */}
</a>
```

## Features Added

### Hero Section
- Beautiful animated delivery service buttons
- Hover effects and animations
- Responsive design for mobile and desktop
- "Coming Soon" badges for inactive services

### Menu Section  
- Additional delivery options in the menu header
- Consistent styling with the rest of the site
- Easy access when customers are viewing the menu

### Styling Features
- Brand colors for each service (DoorDash red, Skip orange, Uber green)
- Smooth hover animations and transitions
- Professional "Coming Soon" badges
- Responsive design that works on all devices
- External link icons with subtle animations

## Testing

After updating the URLs:
1. Run `npm run build` to test the build
2. Run `npm run dev` to test locally
3. Check that the links open in new tabs
4. Verify the hover effects work properly

## Notes

- All logos are properly imported and styled
- The buttons are disabled (non-clickable) until URLs are provided
- The design matches your site's aesthetic perfectly
- Mobile responsive design included
- Accessibility features included (proper alt text, keyboard navigation)
