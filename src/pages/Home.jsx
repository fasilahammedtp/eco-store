import { useEffect, useState } from "react";
import { getPlants, getEcoProducts, getTerrariums } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import ProductCard from "../components/ProductCard";
import { addToCart } from "../services/api";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=1600&q=90",
      tag: "Indoor Plants",
      title: "Bring Nature",
      highlight: "Into Your Home",
      sub: "Curated plants that purify your air and elevate your space",
      btn1: { label: "Shop Plants", link: "/plants" },
      btn2: { label: "View All", link: "/plants" },
    },
    {
      image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=1600&q=90",
      tag: "Eco Products",
      title: "Live Green,",
      highlight: "Live Better",
      sub: "Sustainable everyday essentials for a zero-waste lifestyle",
      btn1: { label: "Eco Products", link: "/eco-products" },
      btn2: { label: "Explore", link: "/eco-products" },
    },
    {
      image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=1600&q=90",
      tag: "Terrariums",
      title: "Tiny Worlds,",
      highlight: "Endless Wonder",
      sub: "Handcrafted glass terrariums — nature in miniature",
      btn1: { label: "Shop Terrariums", link: "/terrariums" },
      btn2: { label: "Discover", link: "/terrariums" },
    },
  ];

  useEffect(() => {
    Promise.all([getPlants(), getEcoProducts()])
      .then(([plantsRes, ecoRes]) => {
        setFeatured([
          ...plantsRes.data.slice(0, 4),
          ...ecoRes.data.slice(0, 4)
        ]);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(p => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearched(true);
    try {
      const [plantsRes, ecoRes, terrariumsRes] = await Promise.all([
        getPlants(), getEcoProducts(), getTerrariums()
      ]);
      const all = [...plantsRes.data, ...ecoRes.data, ...terrariumsRes.data];
      const results = all.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearched(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <>
      <div className="home">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`slide ${i === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}

        <div className="overlay" />

        <div className="hero-content">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`slide-content ${i === currentSlide ? "active" : ""}`}
            >
              <span className="hero-tag">{slide.tag}</span>
              <h1>
                {slide.title}<br />
                <span className="hero-highlight">{slide.highlight}</span>
              </h1>
              <p className="tagline">{slide.sub}</p>

              <div className="hero-search">
                <svg className="search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search plants, eco products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                />
              </div>

              <div className="hero-buttons">
                <a href={slide.btn1.link} className="btn-primary">{slide.btn1.label}</a>
                <a href={slide.btn2.link} className="btn-outline">{slide.btn2.label} &rarr;</a>
              </div>
            </div>
          ))}

          <div className="slide-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-dot" />
        </div>
      </div>

      {searched && (
        <section className="home-search-results">
          <div className="search-results-header">
            <h2>
              {searchLoading ? "Searching..." : `${searchResults.length} results for "${searchQuery}"`}
            </h2>
            <button className="clear-search" onClick={clearSearch}>Clear</button>
          </div>
          {searchLoading ? (
            <div className="search-spinner"><div className="spinner" /></div>
          ) : searchResults.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">No results found</div>
              <p>No products found for "<strong>{searchQuery}</strong>"</p>
              <span>Try "monstera", "bamboo", "terrarium"...</span>
            </div>
          ) : (
            <div className="product-grid">
              {searchResults.map(item => (
                <ProductCard key={item.id} item={item} onAdd={addToCart} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="home-stats-bar">
        <div className="home-stat">
          <div className="home-stat-value">10,000+</div>
          <div className="home-stat-label">Happy Customers</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-value">500+</div>
          <div className="home-stat-label">Plant Varieties</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-value">100%</div>
          <div className="home-stat-label">Eco Packaging</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-value">15,000+</div>
          <div className="home-stat-label">Trees Planted</div>
        </div>
      </section>

      <section className="featured">
        <div className="featured-title-row">
          <h2>Featured Green Picks</h2>
          <a href="/plants" className="view-all-link">View All &rarr;</a>
        </div>
        <div className="slider">
          {featured.map(item => (
            <ProductCard key={item.id} item={item} onAdd={addToCart} />
          ))}
        </div>
      </section>

      <section className="why-eco">
        <div className="why-card">
          <div className="why-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
              <path d="M8 12s1.5-3 4-3 4 3 4 3-1.5 3-4 3-4-3-4-3z"/>
            </svg>
          </div>
          <h4>100% Eco Friendly</h4>
          <p>Sustainably sourced products</p>
        </div>
        <div className="why-card">
          <div className="why-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <h4>Fast Delivery</h4>
          <p>Same-day in select cities</p>
        </div>
        <div className="why-card">
          <div className="why-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/>
            </svg>
          </div>
          <h4>Zero Waste</h4>
          <p>100% plastic-free packaging</p>
        </div>
        <div className="why-card">
          <div className="why-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h4>Planet Friendly</h4>
          <p>Carbon neutral shipping</p>
        </div>
      </section>

      <section className="categories">
        <div className="cat-card" onClick={() => navigate("/plants")}>
          <span className="cat-label">Indoor Plants</span>
          <span className="cat-sub">Explore collection</span>
        </div>
        <div className="cat-card cat-brown" onClick={() => navigate("/eco-products")}>
          <span className="cat-label">Eco Products</span>
          <span className="cat-sub">Shop sustainable</span>
        </div>
        <div className="cat-card cat-dark" onClick={() => navigate("/terrariums")}>
          <span className="cat-label">Terrariums</span>
          <span className="cat-sub">Discover worlds</span>
        </div>
      </section>
    </>
  );
}

export default Home;