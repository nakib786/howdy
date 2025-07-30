import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Hero from './components/Hero'
import About from './components/About'
import Menu from './components/Menu'

import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* React 19 Native Metadata Support */}
          <title>Howdy Cafe | Pakistani-Canadian Fusion in Williams Lake</title>
          <meta 
            name="description" 
            content="Howdy Cafe offers a unique fusion of Pakistani and Canadian flavors in Williams Lake, BC. Visit us for a warm welcome and spicy delight." 
          />
          <meta name="keywords" content="Pakistani food, Canadian cuisine, fusion restaurant, Williams Lake, BC, biryani, poutine, halal" />
          <meta name="author" content="Howdy Cafe" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://howdycafe.ca/" />
          <meta property="og:title" content="Howdy Cafe | Pakistani-Canadian Fusion in Williams Lake" />
          <meta property="og:description" content="Experience the perfect fusion of Pakistani and Canadian flavors in the heart of Williams Lake, BC." />
          <meta property="og:image" content="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" />
          
          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://howdycafe.ca/" />
          <meta property="twitter:title" content="Howdy Cafe | Pakistani-Canadian Fusion in Williams Lake" />
          <meta property="twitter:description" content="Experience the perfect fusion of Pakistani and Canadian flavors in the heart of Williams Lake, BC." />
          <meta property="twitter:image" content="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" />
          
          {/* Additional SEO */}
          <meta name="robots" content="index, follow" />
          <meta name="language" content="English" />
          <meta name="revisit-after" content="7 days" />
          <link rel="canonical" href="https://howdycafe.ca/" />
          
          {/* Local Business Schema */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "Howdy Cafe",
              "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
              "description": "Pakistani-Canadian fusion restaurant in Williams Lake, BC",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "275 B Clearview Crescent #112",
                "addressLocality": "Williams Lake",
                "addressRegion": "BC",
                "postalCode": "V2G 4H6",
                "addressCountry": "CA"
              },
              "telephone": "+1-250-392-3663",
              "url": "https://howdycafe.ca",
              "servesCuisine": ["Pakistani", "Canadian", "Fusion"],
              "priceRange": "$$",
              "openingHours": [
                "Mo-Th 11:00-21:00",
                "Fr-Sa 11:00-22:00", 
                "Su 12:00-20:00"
              ]
            })}
          </script>
          
          <Routes>
            <Route path="/" element={
              <main>
                <Hero />
                <About />
                <Menu />
                <Contact />
                <Footer />
              </main>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
