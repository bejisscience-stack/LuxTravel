# LuxTravel - Phase 1: Showcase Website
## Complete Project Guide for Claude Code + Cursor

---

## 📋 Project Overview

**Company:** LuxTravel  
**Founded:** 2021  
**Location:** Georgia (operates tours everywhere)  
**Website Purpose:** Showcase website for partner presentations  
**Timeline:** 1 month  

---

## 🎨 Existing Frontend Code

We have a complete React app ready. This should be converted to Next.js components.

### Reference React App (react-app.js)

This is your existing React code that needs to be converted to Next.js:

```jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const customStyles = {
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2671&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'grayscale(100%) contrast(120%) brightness(50%)',
    zIndex: 1,
    transition: 'transform 10s ease'
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.05) 100%)',
    zIndex: 2,
    pointerEvents: 'none'
  }
};

const Header = () => {
  const [activeNav, setActiveNav] = useState('');

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 100,
      padding: '40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mixBlendMode: 'difference'
    }}>
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 200,
        border: '1px solid #F0F2F5',
        padding: '10px 15px',
        position: 'relative',
        fontFamily: 'Montserrat, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '0.15em'
      }}>
        LUX<span style={{ fontWeight: 600 }}>TRAVEL</span>
        <span style={{
          content: '',
          position: 'absolute',
          top: 0,
          left: '50%',
          height: '100%',
          width: '1px',
          background: '#F0F2F5',
          transform: 'skewX(-20deg)',
          display: 'block'
        }}></span>
      </div>
      <nav>
        <ul style={{
          display: 'flex',
          gap: '60px',
          listStyle: 'none'
        }}>
          {['The Fleet', 'Destinations', 'Private Charter', 'Concierge'].map((item, index) => (
            <li key={index}>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActiveNav(item); }}
                style={{
                  fontSize: '0.75rem',
                  position: 'relative',
                  color: '#F0F2F5',
                  fontFamily: 'Montserrat, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 300,
                  textDecoration: 'none',
                  transition: '0.3s'
                }}
              >
                {item}
                <span 
                  className="nav-underline"
                  style={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: 0,
                    width: 0,
                    height: '1px',
                    background: '#B8182F',
                    transition: 'width 0.4s ease',
                    display: 'block'
                  }}
                ></span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

// BookingBar component - TO BE REMOVED FOR PHASE 1
const BookingBar = () => {
  // ... booking bar code - NOT NEEDED
};

const Hero = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <section 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <div style={{
        ...customStyles.heroBackground,
        transform: hovered ? 'scale(1.05)' : 'scale(1)'
      }}></div>
      <div style={customStyles.glassOverlay}></div>
      
      <div style={{
        zIndex: 3,
        textAlign: 'center',
        borderLeft: '1px solid rgba(255,255,255,0.3)',
        borderRight: '1px solid rgba(255,255,255,0.3)',
        padding: '0 60px',
        position: 'relative'
      }}>
        {/* Red accent line above */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '100px',
          background: '#B8182F',
          top: '-100px'
        }}></div>
        {/* Red accent line below */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '100px',
          background: '#B8182F',
          bottom: '-100px'
        }}></div>
        
        <h1 className="animate-in" style={{
          fontSize: '5rem',
          marginBottom: '20px',
          lineHeight: '0.9',
          fontFamily: 'Montserrat, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontWeight: 300
        }}>
          The Art of<br />Arrival
        </h1>
        <p className="animate-in delay-1" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontSize: '1.5rem',
          color: '#A0A0A0',
          marginBottom: '40px'
        }}>
          Executive ground travel, redefined.
        </p>
      </div>

      {/* REMOVE BookingBar for Phase 1 */}
      <BookingBar />
    </section>
  );
};

const FeatureList = () => {
  const features = [
    { name: 'FULL LIE-FLAT SUITES', icon: '01' },
    { name: '4K CINEMA DISPLAY', icon: '02' },
    { name: 'VINTAGE CHAMPAGNE BAR', icon: '03' }
  ];

  return (
    <div style={{ marginTop: '60px' }}>
      {features.map((feature, index) => (
        <div 
          key={index}
          onMouseEnter={(e) => {
            e.currentTarget.style.paddingLeft = '20px';
            e.currentTarget.style.borderColor = '#B8182F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.paddingLeft = '0';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'padding-left 0.3s ease, border-color 0.3s ease',
            cursor: 'default'
          }}
        >
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.9rem',
            letterSpacing: '0.1em'
          }}>{feature.name}</span>
          <span style={{
            color: '#A0A0A0',
            fontSize: '1.2rem',
            fontFamily: 'Cormorant Garamond, serif'
          }}>{feature.icon}</span>
        </div>
      ))}
    </div>
  );
};

const Showcase = () => {
  const [imageHovered, setImageHovered] = useState(false);

  return (
    <section style={{
      minHeight: '100vh',
      background: '#050505',
      position: 'relative'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40% 60%',
        height: '100vh'
      }}>
        <div style={{
          padding: '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRight: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            color: '#B8182F',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            marginBottom: '30px',
            display: 'inline-block'
          }}>ONBOARD EXPERIENCE</span>
          <h2 style={{
            fontSize: '2.5rem',
            color: '#F0F2F5',
            marginBottom: '20px',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 300
          }}>
            Sanctuary<br />in Motion.
          </h2>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#A0A0A0',
            letterSpacing: '0.02em',
            marginBottom: '40px'
          }}>
            Silence is the ultimate luxury. Our cabins are engineered for absolute acoustic isolation, featuring hand-stitched Italian leather and ambient lighting that mimics the circadian rhythm of twilight.
          </p>

          <FeatureList />
        </div>
        <div 
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}
          style={{
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1551525212-a1dc18871d4e?q=80&w=2669&auto=format&fit=crop" 
            alt="Luxury Bus Interior"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: imageHovered ? 'saturate(0.5) contrast(1.1)' : 'saturate(0) contrast(1.1)',
              transition: 'filter 0.5s ease'
            }}
          />
        </div>
      </div>
    </section>
  );
};

const FleetCard = ({ title, subtitle, image, specs }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#0f0f0f' : '#050505',
        padding: '60px 40px',
        position: 'relative',
        transition: 'background 0.4s',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '500px'
      }}
    >
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h3 style={{
          fontSize: '1.2rem',
          marginBottom: '10px',
          fontFamily: 'Montserrat, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontWeight: 300
        }}>{title}</h3>
        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          color: '#A0A0A0',
          fontSize: '0.7rem',
          letterSpacing: '0.3em'
        }}>{subtitle}</p>
      </div>
      <img 
        src={image} 
        alt={title}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: hovered ? 'translate(-50%, -50%) scale(0.9)' : 'translate(-50%, -50%) scale(0.8)',
          width: '80%',
          height: 'auto',
          opacity: hovered ? 1 : 0.4,
          transition: 'all 0.5s ease',
          filter: hovered ? 'grayscale(0%)' : 'grayscale(100%)'
        }}
      />
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '0.7rem',
        color: '#A0A0A0',
        letterSpacing: '0.1em'
      }}>
        <span>{specs[0]}</span>
        <span>{specs[1]}</span>
      </div>
    </div>
  );
};

const Fleet = () => {
  const fleetData = [
    {
      title: 'The Sovereign',
      subtitle: 'Flagship Liner',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2669&auto=format&fit=crop',
      specs: ['12 SUITES', 'LOUNGE CONFIG']
    },
    {
      title: 'The Obsidian',
      subtitle: 'Executive Sprinter',
      image: 'https://images.unsplash.com/photo-1600320254374-ce2d293c324e?q=80&w=2670&auto=format&fit=crop',
      specs: ['06 SEATS', 'CONFERENCE MODE']
    },
    {
      title: 'The Phantom',
      subtitle: 'Private Coach',
      image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=2670&auto=format&fit=crop',
      specs: ['30 SEATS', 'EVENT TRANSIT']
    }
  ];

  return (
    <section style={{
      padding: '120px 40px',
      background: '#000000'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '100px',
        position: 'relative'
      }}>
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          color: '#B8182F',
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          display: 'inline-block'
        }}>THE COLLECTION</span>
        <h2 style={{
          fontSize: '2.5rem',
          color: '#F0F2F5',
          fontFamily: 'Montserrat, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontWeight: 300
        }}>Our Fleet</h2>
        <div style={{
          display: 'block',
          width: '1px',
          height: '60px',
          background: '#F0F2F5',
          margin: '30px auto 0',
          transform: 'skewX(-20deg)'
        }}></div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {fleetData.map((fleet, index) => (
          <FleetCard key={index} {...fleet} />
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  const links = ['Instagram', 'Corporate', 'Legal', 'Contact'];

  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '80px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }}>
      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '2rem',
        letterSpacing: '0.1em'
      }}>
        LUX<br />TRAVEL
      </div>
      <div style={{
        display: 'flex',
        gap: '40px'
      }}>
        {links.map((link, index) => (
          <a 
            key={index}
            href="#"
            onClick={(e) => e.preventDefault()}
            onMouseEnter={(e) => e.currentTarget.style.color = '#B8182F'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#A0A0A0'}
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#A0A0A0',
              textDecoration: 'none',
              transition: '0.3s'
            }}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <Showcase />
      <Fleet />
      <Footer />
    </>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        background-color: #050505;
        color: #F0F2F5;
        font-family: 'Cormorant Garamond', serif;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-in {
        animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        opacity: 0;
      }

      .delay-1 { animation-delay: 0.2s; }
      .delay-2 { animation-delay: 0.4s; }
      .delay-3 { animation-delay: 0.6s; }
    `;
    document.head.appendChild(style);

    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@100;200;300;400;600&display=swap';
    link1.rel = 'stylesheet';
    document.head.appendChild(link1);

    return () => {
      document.head.removeChild(style);
      document.head.removeChild(link1);
    };
  }, []);

  return (
    <Router basename="/">
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
```

### Existing Components to Convert:
1. **Header** - Logo with skewed line, navigation with hover underline
2. **Hero** - Grayscale background with scale animation, glass overlay, red accent lines
3. **Showcase (Why Choose Us)** - Split layout 40/60, feature list with hover effect
4. **FleetCard** - Card with grayscale-to-color image hover effect
5. **Fleet** - Section header with decorative line, 3-column grid
6. **Footer** - Brand text, link list with hover effect

### What to KEEP from this code:
- All inline styles and styling logic
- Hover effects (grayscale to color, scale, etc.)
- Animation classes (fadeIn, delays)
- Color scheme (#050505, #F0F2F5, #A0A0A0, #B8182F)
- Typography (Montserrat, Cormorant Garamond)
- Layout structures (split layout, grid)

### What to REMOVE:
1. **BookingBar component** - Not needed for Phase 1
2. **react-router-dom** - Will use Next.js routing instead
3. **Navigation items** - "Destinations", "Private Charter", "Concierge"

### What to MODIFY:
1. **Navigation** - Change to: "Home", "Buses" + Language Switcher (EN/KA/RU)
2. **Hero** - Add "Contact Us" CTA button below subtitle (remove BookingBar)
3. **FeatureList** - Change fake amenities to REAL ones:
   - WiFi Connectivity (01)
   - Air Conditioning (02)
   - USB Charging Ports (03)
   - Comfortable Seating (04)
   - Onboard Toilet (05)
   - Entertainment System (06)
   - Refreshments Available (07)
4. **Footer links** - Change to: Home, Buses, Facebook, Instagram, TikTok + Contact info

### What to ADD:
1. **Language Switcher** - EN / KA / RU in header
2. **Gallery Section** - New section after "Why Choose Us"
3. **Contact Section** - New section with form and contact info
4. **Social icons** - Facebook, Instagram, TikTok in footer
5. **Contact info** - Phone, Email, Address, WhatsApp in footer

---

## 🛠 Tech Stack
        :root {
            --color-void: #050505;
            --color-void-deep: #000000;
            --color-diamond: #F0F2F5;
            --color-silver: #A0A0A0;
            --color-lip-red: #B8182F; 
            
            --font-geo: 'Montserrat', sans-serif; 
            --font-serif: 'Cormorant Garamond', serif; 
            
            --spacing-unit: 8px;
            --container-width: 1400px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: var(--color-void);
            color: var(--color-diamond);
            font-family: var(--font-serif);
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }

        a { text-decoration: none; color: inherit; transition: 0.3s; }
        ul { list-style: none; }
        img { width: 100%; display: block; object-fit: cover; }

        h1, h2, h3, h4, .nav-link, .btn-text {
            font-family: var(--font-geo);
            text-transform: uppercase;
            letter-spacing: 0.15em; 
            font-weight: 300;
        }

        p {
            font-family: var(--font-serif);
            font-size: 1.1rem;
            line-height: 1.6;
            color: var(--color-silver);
            letter-spacing: 0.02em;
        }

        .container {
            max-width: var(--container-width);
            margin: 0 auto;
            padding: 0 40px;
        }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); }

        /* HEADER */
        header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 100;
            padding: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            mix-blend-mode: difference; 
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 200;
            border: 1px solid var(--color-diamond);
            padding: 10px 15px;
            position: relative;
        }
        
        .logo::after {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            height: 100%;
            width: 1px;
            background: var(--color-diamond);
            transform: skewX(-20deg);
        }

        nav ul {
            display: flex;
            gap: 60px;
        }

        .nav-link {
            font-size: 0.75rem;
            position: relative;
            color: var(--color-diamond);
        }

        .nav-link::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 1px;
            background: var(--color-lip-red);
            transition: width 0.4s ease;
        }

        .nav-link:hover::after {
            width: 100%;
        }

        /* HERO */
        .hero {
            height: 100vh;
            width: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .hero-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2671&auto=format&fit=crop'); 
            background-size: cover;
            background-position: center;
            filter: grayscale(100%) contrast(120%) brightness(50%); 
            z-index: 1;
            transition: transform 10s ease;
        }
        
        .hero:hover .hero-bg {
            transform: scale(1.05);
        }

        .glass-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.05) 100%);
            z-index: 2;
            pointer-events: none;
        }

        .hero-content {
            z-index: 3;
            text-align: center;
            border-left: 1px solid rgba(255,255,255,0.3);
            border-right: 1px solid rgba(255,255,255,0.3);
            padding: 0 60px;
            position: relative;
        }

        .hero-content::before, .hero-content::after {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 1px;
            height: 100px;
            background: var(--color-lip-red);
        }
        .hero-content::before { top: -100px; }
        .hero-content::after { bottom: -100px; }

        h1 {
            font-size: 5rem;
            margin-bottom: 20px;
            line-height: 0.9;
        }

        .hero-sub {
            font-family: var(--font-serif);
            font-style: italic;
            font-size: 1.5rem;
            color: var(--color-silver);
            margin-bottom: 40px;
        }

        /* SHOWCASE / WHY CHOOSE US */
        .showcase {
            min-height: 100vh;
            background: var(--color-void);
            position: relative;
        }

        .split-layout {
            display: grid;
            grid-template-columns: 40% 60%;
            height: 100vh;
        }

        .split-content {
            padding: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-right: 1px solid rgba(255,255,255,0.1);
        }

        .section-tag {
            font-family: var(--font-geo);
            color: var(--color-lip-red);
            font-size: 0.7rem;
            letter-spacing: 0.3em;
            margin-bottom: 30px;
            display: inline-block;
        }

        .split-image-container {
            position: relative;
            overflow: hidden;
        }

        .split-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: saturate(0) contrast(1.1); 
            transition: filter 0.5s ease;
        }
        
        .split-image-container:hover .split-image {
            filter: saturate(0.5) contrast(1.1); 
        }

        .feature-list {
            margin-top: 60px;
        }

        .feature-item {
            border-top: 1px solid rgba(255,255,255,0.2);
            padding: 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: padding-left 0.3s ease, border-color 0.3s ease;
            cursor: default;
        }

        .feature-item:hover {
            padding-left: 20px;
            border-color: var(--color-lip-red);
        }

        .feature-name {
            font-family: var(--font-geo);
            font-size: 0.9rem;
            letter-spacing: 0.1em;
        }

        .feature-icon {
            color: var(--color-silver);
            font-size: 1.2rem;
            font-family: var(--font-serif); 
        }

        /* FLEET SECTION */
        .fleet-section {
            padding: 120px 40px;
            background: var(--color-void-deep);
        }

        .fleet-header {
            text-align: center;
            margin-bottom: 100px;
            position: relative;
        }
        
        .fleet-header::after {
            content: '';
            display: block;
            width: 1px;
            height: 60px;
            background: var(--color-diamond);
            margin: 30px auto 0;
            transform: skewX(-20deg);
        }

        .fleet-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px; 
            background: rgba(255,255,255,0.1); 
            border: 1px solid rgba(255,255,255,0.1);
        }

        .fleet-card {
            background: var(--color-void);
            padding: 60px 40px;
            position: relative;
            transition: background 0.4s;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 500px;
        }

        .fleet-card:hover {
            background: #0f0f0f;
        }

        .fleet-img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            width: 80%;
            height: auto;
            opacity: 0.4;
            transition: all 0.5s ease;
            filter: grayscale(100%);
        }

        .fleet-card:hover .fleet-img {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.9);
            filter: grayscale(0%);
        }

        .fleet-title {
            position: relative;
            z-index: 2;
            font-size: 1.5rem;
            border-bottom: 1px solid transparent;
            display: inline-block;
        }

        .fleet-specs {
            position: relative;
            z-index: 2;
            display: flex;
            justify-content: space-between;
            font-family: var(--font-geo);
            font-size: 0.7rem;
            color: var(--color-silver);
            letter-spacing: 0.1em;
        }
        
        h2 { font-size: 2.5rem; color: var(--color-diamond); }
        h3 { font-size: 1.2rem; margin-bottom: 10px; }

        /* FOOTER */
        footer {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding: 80px 40px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .footer-brand {
            font-family: var(--font-geo);
            font-size: 2rem;
            letter-spacing: 0.1em;
        }

        .footer-links {
            display: flex;
            gap: 40px;
        }

        .footer-links a {
            font-family: var(--font-geo);
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: var(--color-silver);
        }
        
        .footer-links a:hover {
            color: var(--color-lip-red);
        }

        /* ANIMATIONS */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-in {
            animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            opacity: 0;
        }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@100;200;300;400;600&display=swap" rel="stylesheet">
</head>
<body>

    <header>
        <div class="logo">LUX<span style="font-weight:600">TRAVEL</span></div>
        <nav>
            <ul>
                <li><a href="#" class="nav-link">The Fleet</a></li>
                <li><a href="#" class="nav-link">Destinations</a></li>
                <li><a href="#" class="nav-link">Private Charter</a></li>
                <li><a href="#" class="nav-link">Concierge</a></li>
            </ul>
        </nav>
    </header>

    <section class="hero">
        <div class="hero-bg"></div>
        <div class="glass-overlay"></div>
        
        <div class="hero-content">
            <h1 class="animate-in">The Art of<br>Arrival</h1>
            <p class="hero-sub animate-in delay-1">Executive ground travel, redefined.</p>
        </div>

        <!-- REMOVED: Booking bar - not needed for Phase 1 -->
    </section>

    <section class="showcase">
        <div class="split-layout">
            <div class="split-content">
                <span class="section-tag">ONBOARD EXPERIENCE</span>
                <h2 style="margin-bottom: 20px;">Sanctuary<br>in Motion.</h2>
                <p style="margin-bottom: 40px;">
                    Silence is the ultimate luxury. Our cabins are engineered for absolute acoustic isolation, featuring hand-stitched Italian leather and ambient lighting that mimics the circadian rhythm of twilight.
                </p>

                <div class="feature-list">
                    <div class="feature-item">
                        <span class="feature-name">FULL LIE-FLAT SUITES</span>
                        <span class="feature-icon">01</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-name">4K CINEMA DISPLAY</span>
                        <span class="feature-icon">02</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-name">VINTAGE CHAMPAGNE BAR</span>
                        <span class="feature-icon">03</span>
                    </div>
                </div>
            </div>
            <div class="split-image-container">
                <img src="https://images.unsplash.com/photo-1551525212-a1dc18871d4e?q=80&w=2669&auto=format&fit=crop" alt="Luxury Bus Interior" class="split-image">
            </div>
        </div>
    </section>

    <section class="fleet-section">
        <div class="fleet-header">
            <span class="section-tag">THE COLLECTION</span>
            <h2>Our Fleet</h2>
        </div>

        <div class="fleet-grid">
            <div class="fleet-card">
                <div class="card-content">
                    <h3>The Sovereign</h3>
                    <p class="section-tag" style="color: var(--color-silver)">Flagship Liner</p>
                </div>
                <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2669&auto=format&fit=crop" class="fleet-img" alt="Bus Exterior">
                <div class="fleet-specs">
                    <span>12 SUITES</span>
                    <span>LOUNGE CONFIG</span>
                </div>
            </div>

            <div class="fleet-card">
                <div class="card-content">
                    <h3>The Obsidian</h3>
                    <p class="section-tag" style="color: var(--color-silver)">Executive Sprinter</p>
                </div>
                <img src="https://images.unsplash.com/photo-1600320254374-ce2d293c324e?q=80&w=2670&auto=format&fit=crop" class="fleet-img" alt="Sprinter Exterior">
                <div class="fleet-specs">
                    <span>06 SEATS</span>
                    <span>CONFERENCE MODE</span>
                </div>
            </div>

            <div class="fleet-card">
                <div class="card-content">
                    <h3>The Phantom</h3>
                    <p class="section-tag" style="color: var(--color-silver)">Private Coach</p>
                </div>
                <img src="https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=2670&auto=format&fit=crop" class="fleet-img" alt="Coach Exterior">
                <div class="fleet-specs">
                    <span>30 SEATS</span>
                    <span>EVENT TRANSIT</span>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="footer-brand">LUX<br>TRAVEL</div>
        <div class="footer-links">
            <a href="#">Instagram</a>
            <a href="#">Corporate</a>
            <a href="#">Legal</a>
            <a href="#">Contact</a>
        </div>
    </footer>

</body>
</html>
```

### What to KEEP from this template:
- All CSS variables and design tokens
- Header styling (logo with skewed line, nav link hover effects)
- Hero section styling (grayscale background, glass overlay, red accent lines)
- Showcase/Why Choose Us split layout styling
- Fleet section grid and card styling (grayscale to color hover)
- Footer styling
- All animations (fadeIn, delays)
- Typography system (Montserrat + Cormorant Garamond)

### What to REMOVE:
1. **Booking Bar** - The entire `booking-bar` section at bottom of hero
2. **Navigation items** - "Destinations", "Private Charter", "Concierge" links

### What to MODIFY:
1. **Navigation** - Change to: "Home", "Buses" + Language Switcher (EN/KA/RU)
2. **Hero** - Add "Contact Us" CTA button below subtitle
3. **Feature list** - Change fake amenities to real ones:
   - WiFi Connectivity
   - Air Conditioning  
   - USB Charging Ports
   - Comfortable Seating
   - Onboard Toilet
   - Entertainment System
   - Refreshments Available
4. **Footer links** - Change to: Home, Buses, Facebook, Instagram, TikTok + Contact info

### What to ADD:
1. **Language Switcher** - EN / KA / RU in header
2. **Gallery Section** - After "Why Choose Us", before footer
3. **Contact Section** - With form and contact info, before footer
4. **Social icons** - Facebook, Instagram, TikTok in footer
5. **Contact info** - Phone, Email, Address, WhatsApp in footer

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Backend/Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Storage | Supabase Storage (images) |
| Email | Resend (for future use) |
| Languages | English (EN), Georgian (KA), Russian (RU) |
| Styling | CSS (custom, converted from existing React inline styles) |
| Fonts | Montserrat + Cormorant Garamond (Google Fonts) |

---

## 🎨 Design System (from existing code)

### Color Palette
```
#050505  - void (Primary background)
#000000  - void-deep (Deep black)
#F0F2F5  - diamond (Primary text)
#A0A0A0  - silver (Secondary text)
#B8182F  - lip-red (Accent color)
```

### Typography
- **Headings:** Montserrat (uppercase, letter-spacing: 0.15em, font-weight: 300)
- **Body:** Cormorant Garamond (serif, 1.1rem, line-height: 1.6)

### Design Aesthetic
- Dark, luxury, premium feel
- Grayscale images with hover color transitions
- Subtle animations and micro-interactions
- Red accent lines and elements
- Glass overlay effects

---

## 📄 Pages Structure

### Public Pages
1. **Homepage** (`/`)
2. **Buses/Fleet Page** (`/buses`)
3. **Individual Bus Detail** (`/buses/[id]`)

### Admin Pages
1. **Admin Login** (`/admin/login`)
2. **Admin Dashboard** (`/admin`)
3. **Bus Management** (`/admin/buses`)
4. **Content Management** (`/admin/content`)
5. **Gallery Management** (`/admin/gallery`)
6. **Settings** (`/admin/settings`)

---

## 🏠 Homepage Sections

### 1. HEADER
- Logo: "LUX**TRAVEL**" (with border and skewed line)
- Navigation: Home, Buses
- Language Switcher: EN / KA / RU (flags or dropdown)

### 2. HERO SECTION
- Full-screen background image (grayscale, admin-editable)
- Glass overlay effect
- Main headline (admin-editable, e.g., "The Art of Arrival")
- Subtitle (admin-editable, e.g., "Executive ground travel, redefined")
- CTA Button: "Contact Us" → links to contact section or WhatsApp
- Red accent lines above and below content

### 3. BUS LISTING SECTION ("Our Fleet")
- Section tag: "THE COLLECTION"
- Section title: "Our Fleet"
- 3-column grid of bus cards
- Each bus card displays:
  - Bus photo (grayscale → color on hover)
  - Bus name/model
  - Class/tier tag (Standard/Premium/VIP)
  - Capacity (number of seats)
  - "View Details" or hover to reveal more

### 4. ONBOARD EXPERIENCE SECTION ("Why Choose Us")
- Split layout: 40% content / 60% image
- Section tag: "ONBOARD EXPERIENCE"
- Title: "Sanctuary in Motion" (or admin-editable)
- Description paragraph (admin-editable)
- Feature list with hover effects:
  - WiFi Connectivity
  - Air Conditioning
  - USB Charging Ports
  - Comfortable Seating
  - Onboard Toilet
  - Entertainment System
  - Refreshments Available
- Large image on right side

### 5. GALLERY SECTION
- Section title: "Journey Moments" or similar
- Grid of 6-8 images from past tours
- Lightbox on click
- Admin can add/remove images

### 6. CONTACT SECTION
- Section title: "Get in Touch"
- Contact information:
  - Phone number
  - Email address
  - Physical address
  - WhatsApp number
- Contact form:
  - Name
  - Email
  - Message
  - Submit button

### 7. FOOTER
- Logo: "LUX TRAVEL"
- Navigation links: Home, Buses
- Social media icons: Facebook, Instagram, TikTok
- Contact info: Phone, Email, Address, WhatsApp
- Copyright text

---

## 🚌 Buses/Fleet Page

### Layout
- Hero banner with title "Our Fleet"
- Filter options (by class: All, Standard, Premium, VIP)
- Grid of all buses (larger cards than homepage)

### Bus Card (Detailed)
- Large bus photo
- Bus name/model
- Class badge
- Capacity
- Amenities icons (WiFi, AC, USB, Toilet, TV, etc.)
- "View Details" button

---

## 🚌 Individual Bus Detail Page (`/buses/[id]`)

### Content
- Hero image of the bus
- Bus name and class
- Photo gallery (multiple images)
- Full specifications:
  - Capacity
  - Class
  - All amenities with descriptions
- "Contact Us" CTA button

---

## 👤 Admin Dashboard

### Authentication
- Email/password login
- Supabase Auth

### Dashboard Home (`/admin`)
- Quick stats (total buses, gallery images)
- Quick links to management sections

### Bus Management (`/admin/buses`)
- Table view of all buses
- Add new bus button
- For each bus: Edit, Delete actions
- Bus form fields:
  - Name/model
  - Class (Standard/Premium/VIP)
  - Capacity (number of seats)
  - Amenities (checkboxes): WiFi, AC, USB, Toilet, TV, Refreshments
  - Description (multilingual: EN, KA, RU)
  - Photos (multiple upload)
  - Status (Active/Inactive)
  - Maintenance status (Available/In Maintenance)

### Content Management (`/admin/content`)
- Edit all website text:
  - Hero headline (EN, KA, RU)
  - Hero subtitle (EN, KA, RU)
  - "Why Choose Us" title (EN, KA, RU)
  - "Why Choose Us" description (EN, KA, RU)
  - Feature list items (EN, KA, RU)
  - Contact section title (EN, KA, RU)
- Edit hero background image
- Edit "Why Choose Us" section image

### Gallery Management (`/admin/gallery`)
- Grid view of all gallery images
- Upload new images
- Delete images
- Reorder images (drag & drop)

### Settings (`/admin/settings`)
- Contact Information:
  - Phone number
  - Email address
  - Physical address
  - WhatsApp number
- Social Media Links:
  - Facebook URL
  - Instagram URL
  - TikTok URL
- Company Information:
  - Logo upload

---

## 🗄 Database Schema (Supabase)

### Tables

#### `buses`
```sql
CREATE TABLE buses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class VARCHAR(50) NOT NULL, -- 'standard', 'premium', 'vip'
    capacity INTEGER NOT NULL,
    description_en TEXT,
    description_ka TEXT,
    description_ru TEXT,
    amenities JSONB DEFAULT '[]', -- ['wifi', 'ac', 'usb', 'toilet', 'tv', 'refreshments']
    photos TEXT[] DEFAULT '{}', -- Array of image URLs
    is_active BOOLEAN DEFAULT true,
    maintenance_status VARCHAR(50) DEFAULT 'available', -- 'available', 'maintenance'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `site_content`
```sql
CREATE TABLE site_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL, -- 'hero_title', 'hero_subtitle', etc.
    value_en TEXT,
    value_ka TEXT,
    value_ru TEXT,
    image_url TEXT, -- For content with images
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `gallery`
```sql
CREATE TABLE gallery (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    alt_text_en VARCHAR(255),
    alt_text_ka VARCHAR(255),
    alt_text_ru VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `settings`
```sql
CREATE TABLE settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `contact_messages`
```sql
CREATE TABLE contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Buckets
- `bus-images` - Bus photos
- `gallery` - Gallery images
- `site-assets` - Hero images, section images, logo

---

## 🌐 Internationalization (i18n)

### Supported Languages
- English (EN) - Default
- Georgian (KA)
- Russian (RU)

### Implementation
- Use `next-intl` or similar library
- URL-based locale: `/en/`, `/ka/`, `/ru/`
- Language switcher in header
- All dynamic content from database has `_en`, `_ka`, `_ru` columns
- Static UI text in translation JSON files

### Translation Files Structure
```
/messages
  /en.json
  /ka.json
  /ru.json
```

---

## 🔧 Key Features to Implement

### Public Website
- [x] Responsive design (mobile, tablet, desktop)
- [x] SEO optimization (meta tags, Open Graph, sitemap)
- [x] Multi-language support
- [x] Smooth animations and transitions
- [x] Image lazy loading
- [x] Contact form with validation
- [x] Grayscale to color image hover effects
- [x] Glass overlay effects

### Admin Dashboard
- [x] Secure authentication
- [x] CRUD operations for buses
- [x] Content management (edit all text)
- [x] Gallery management (upload, delete, reorder)
- [x] Settings management
- [x] Image upload to Supabase Storage
- [x] Form validation

---

## 📁 Project Structure

```
luxtravel/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                 # Homepage
│   │   ├── buses/
│   │   │   ├── page.tsx             # Fleet listing
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Bus detail
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── buses/
│   │   │   └── page.tsx
│   │   ├── content/
│   │   │   └── page.tsx
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── api/
│       └── contact/
│           └── route.ts             # Contact form API
├── components/
│   ├── public/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── BusCard.tsx
│   │   ├── FleetSection.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── Gallery.tsx
│   │   ├── ContactSection.tsx
│   │   └── LanguageSwitcher.tsx
│   └── admin/
│       ├── Sidebar.tsx
│       ├── BusForm.tsx
│       ├── ContentEditor.tsx
│       ├── GalleryUploader.tsx
│       └── ImageUpload.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── messages/
│   ├── en.json
│   ├── ka.json
│   └── ru.json
├── styles/
│   └── globals.css
├── public/
│   └── fonts/
└── types/
    └── index.ts
```

---

## 🚀 Deployment Notes

- Deploy frontend on Vercel
- Supabase handles backend/database
- Environment variables needed:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

---

## ⚠️ Important Notes from Original Design

### Elements to REMOVE from provided HTML template:
1. **Booking Bar** - Remove the entire booking bar at the bottom of hero section
2. **Navigation items** - Change from "The Fleet, Destinations, Private Charter, Concierge" to just "Home, Buses"
3. **"Destinations" link** - Remove
4. **"Private Charter" link** - Remove
5. **"Concierge" link** - Remove

### Elements to MODIFY:
1. **Hero CTA** - Add "Contact Us" button instead of booking bar
2. **Feature list in "Onboard Experience"** - Change to real amenities:
   - WiFi Connectivity
   - Air Conditioning
   - USB Charging Ports
   - Comfortable Seating
   - Onboard Toilet
   - Entertainment System
   - Refreshments Available
3. **Footer links** - Change to: Home, Buses, Facebook, Instagram, TikTok, Contact info
4. **Add Language Switcher** - EN / KA / RU in header

### Elements to ADD:
1. **Language Switcher** in header
2. **Gallery Section** after "Why Choose Us"
3. **Contact Section** with form before footer
4. **WhatsApp** in contact info
5. **Facebook, Instagram, TikTok** social links in footer

---

## 📞 Contact Information Fields

Admin should be able to edit:
- Phone number
- Email address
- Physical address
- WhatsApp number
- Facebook URL
- Instagram URL
- TikTok URL

---

*Document Version: 1.0*  
*Phase: 1 - Showcase Website*  
*Last Updated: February 2025*
