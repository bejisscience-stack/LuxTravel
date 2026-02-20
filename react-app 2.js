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
                onMouseEnter={(e) => {
                  e.target.querySelector('.nav-underline').style.width = '100%';
                }}
                onMouseLeave={(e) => {
                  e.target.querySelector('.nav-underline').style.width = '0';
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

const BookingBar = () => {
  const [bookingData, setBookingData] = useState({
    origin: 'Manhattan, NY',
    destination: 'The Hamptons',
    departure: 'Oct 12, 2023',
    guests: '02 Adults'
  });

  const handleBookingClick = (field) => {
    console.log(`Edit ${field}`);
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      zIndex: 10,
      background: '#000000',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      height: '100px'
    }} className="animate-in delay-2">
      <div 
        onClick={() => handleBookingClick('origin')}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        style={{
          flex: 1,
          borderRight: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 40px',
          position: 'relative',
          transition: 'background 0.3s',
          cursor: 'pointer'
        }}
      >
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.65rem',
          color: '#A0A0A0',
          letterSpacing: '0.2em',
          marginBottom: '8px'
        }}>ORIGIN</span>
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.25rem',
          color: '#F0F2F5'
        }}>{bookingData.origin}</span>
      </div>
      
      <div 
        onClick={() => handleBookingClick('destination')}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        style={{
          flex: 1,
          borderRight: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 40px',
          position: 'relative',
          transition: 'background 0.3s',
          cursor: 'pointer'
        }}
      >
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.65rem',
          color: '#A0A0A0',
          letterSpacing: '0.2em',
          marginBottom: '8px'
        }}>DESTINATION</span>
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.25rem',
          color: '#F0F2F5'
        }}>{bookingData.destination}</span>
      </div>
      
      <div 
        onClick={() => handleBookingClick('departure')}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        style={{
          flex: 1,
          borderRight: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 40px',
          position: 'relative',
          transition: 'background 0.3s',
          cursor: 'pointer'
        }}
      >
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.65rem',
          color: '#A0A0A0',
          letterSpacing: '0.2em',
          marginBottom: '8px'
        }}>DEPARTURE</span>
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.25rem',
          color: '#F0F2F5'
        }}>{bookingData.departure}</span>
      </div>
      
      <div 
        onClick={() => handleBookingClick('guests')}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        style={{
          flex: 1,
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 40px',
          position: 'relative',
          transition: 'background 0.3s',
          cursor: 'pointer'
        }}
      >
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.65rem',
          color: '#A0A0A0',
          letterSpacing: '0.2em',
          marginBottom: '8px'
        }}>GUESTS</span>
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.25rem',
          color: '#F0F2F5'
        }}>{bookingData.guests}</span>
      </div>
      
      <button 
        onClick={() => alert('Journey requested!')}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#B8182F';
          e.currentTarget.style.color = '#F0F2F5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#F0F2F5';
          e.currentTarget.style.color = '#050505';
        }}
        style={{
          flex: '0 0 200px',
          background: '#F0F2F5',
          color: '#050505',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          fontWeight: 600,
          transition: 'all 0.3s',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        REQUEST JOURNEY
      </button>
    </div>
  );
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
        <div style={{
          content: '',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '100px',
          background: '#B8182F',
          top: '-100px'
        }}></div>
        <div style={{
          content: '',
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