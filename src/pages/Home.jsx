import { useEffect, useState } from "react";
import { getPlants, getEcoProducts } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import ProductCard from "../components/ProductCard";
import { addToCart } from "../services/api";

function Home() {

  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getPlants(), getEcoProducts()])
      .then(([plantsRes, ecoRes]) => {
        setFeatured([
          ...plantsRes.data.slice(0, 4),
          ...ecoRes.data.slice(0, 4)
        ]);
      });
  }, []);

  return (
    <>
      <div className="home">

        <div className="eco-bg"></div>
        <div className="overlay"></div>

        <div className="hero-content">

          <h1>Eco Living Store</h1>

          <p className="tagline">
            Grow green. Live clean. Breathe better.
          </p>

          <div className="quotes">
            <span> Nature at your doorstep</span>
            <span> Where life meets sustainability</span>
            <span> Small choices. Big impact.</span>
          </div>

          <div className="hero-buttons">
            <a href="/plants">Explore Plants</a>
            <a href="/terrariums" className="outline">View Terrariums</a>
            <a href="/eco-products" className="outline">Eco Product</a>
          </div>

        </div>
      </div>

      
      <section className="featured">

        <h2>Featured Green Pick 🌿</h2>

        <div className="slider">
          {featured.map(item => (
          <ProductCard 
            key={item.id}
            item={item}
            onAdd={addToCart}/>
          ))}

        </div>

      </section>
      <section className="why-eco">
           <div className="why-card">🌱 100% Eco Friendly</div>
           <div className="why-card">🚚 Fast Delivery</div>
           <div className="why-card">♻️ Sustainable Products</div>
           <div className="why-card">💚 Planet Friendly</div>
      </section>

      <section className="categories">
        <div className="cat-card" onClick={() => navigate("/plants")}>
          Indoor Plants
        </div>

        <div className="cat-card" onClick={() => navigate("/eco-products")}>
          Eco Products
        </div>

        <div className="cat-card" onClick={() => navigate("/terrariums")}>
          Terrariums
        </div>
      </section>


    </>
  );
}
export default Home;