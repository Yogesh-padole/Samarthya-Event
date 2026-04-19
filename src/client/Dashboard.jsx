import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Booking from "./Booking";
import Contact from "./Contact";
import logo from "../assets/logo.png";

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);


  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const categories = [
    { name: "Birthday", img: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84" },
    { name: "Kids Party", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9" },
    { name: "Anniversary", img: "https://images.unsplash.com/photo-1519741497674-611481863552" },
    { name: "Newborn", img: "https://images.unsplash.com/photo-1609220136736-443140cffec6" },
    { name: "Balloon Decoration", img:"https://images.unsplash.com/photo-1530104091755-015d31dfa0b9?q=80&w=1009&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    { name: "Wedding", img: "https://plus.unsplash.com/premium_photo-1682092632793-c7d75b23718e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Corporate Event", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
    {name:"Mandap Decoration", img:"https://images.unsplash.com/photo-1587271636175-90d58cdad458?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {name:"Welcome Decoration", img:"https://images.unsplash.com/photo-1684265441432-11a6ae9c27b1?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {name:"Rangoli Decoration", img:"https://media.istockphoto.com/id/1351437650/photo/diwali-rangoli.webp?a=1&b=1&s=612x612&w=0&k=20&c=Jyd1pmM8pYIViXZ2HYCMXH5C7nSEMEdYRedwKVfJN_w="},
    {name:"Flower Decoration", img:"https://images.unsplash.com/photo-1746044159277-ced38bb9ae58?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {name:"Stage Decoration", img:"https://images.unsplash.com/photo-1568989357443-057c03fb10fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHN0YWdlJTIwZGVjb3JlY3Rpb258ZW58MHx8MHx8fDA%3D"},
  ];

  return (
    <>
      <div style={styles.container}>

        {/* NAVBAR */}
        <div style={styles.navbar}>
          <div style={styles.logoWrap}>
            <img src={logo} alt="logo" style={styles.logoImg} />
            <h2 style={styles.logo}>Samarthya Events</h2>
          </div>

          <div style={styles.navButtons}>
            <button 
              style={styles.adminBtn} 
              onClick={() => navigate("/admin-login")}
            >
              Admin Login
            </button>

<button 
  style={styles.btn} 
  onClick={() => setShowForm(true)}
>
  Book Now
</button>

<button 
  style={styles.contactBtn} 
  onClick={() => setShowContact(true)}
>
  Contact Us
</button>

          </div>
        </div>

        {/* HERO */}
        <div style={{
          ...styles.hero,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)"
        }}>
          <h1 style={styles.heroTitle}>
            Make Your Event <span style={{color:"#ffd700"}}>Special</span> ✨
          </h1>
          <p style={styles.heroSubtitle}>
            Premium Decoration Services for all your celebrations
          </p>

          <button 
            style={styles.btn}
            onClick={() => setShowForm(true)}
            onMouseEnter={(e)=>{
              e.target.style.transform="scale(1.05)";
              e.target.style.boxShadow="0 10px 30px rgba(255,215,0,0.6)";
            }}
            onMouseLeave={(e)=>{
              e.target.style.transform="scale(1)";
              e.target.style.boxShadow="none";
            }}
          >
            Get Started
          </button>
        </div>

        {/* CARDS */}
        <div style={styles.cards}>
          {categories.map((item) => (
            <div 
              key={item.name} 
              style={styles.card} 
              onClick={() => navigate(`/category/${item.name}`)}

              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.6)";
                e.currentTarget.querySelector("img").style.transform = "scale(1.1)";
              }}

              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.4)";
                e.currentTarget.querySelector("img").style.transform = "scale(1)";
              }}
            >
              <img src={item.img} alt={item.name} style={styles.cardImage} />
              <div style={styles.overlay}></div>
              <h3 style={styles.cardTitle}>{item.name}</h3>
            </div>
          ))}
        </div>

      </div>

      {showForm && (
        <Booking onClose={() => setShowForm(false)} />
      )}

      {showContact && (
  <Contact onClose={() => setShowContact(false)} />
)}

    </>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a192f, #0f3057)",
    color: "white",
    padding: "20px",
    fontFamily: "sans-serif"
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap"
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  logoImg: {
    width: "45px",
    height: "45px",
    borderRadius: "50%"
  },

  logo: {
    color: "gold",
    fontSize: "20px"
  },

navButtons: {
  display: "flex",
  gap: "8px",
  flexWrap: "nowrap",  
  overflowX: "auto",    
},


  hero: {
    textAlign: "center",
    marginTop: "80px",
    transition: "all 1s ease"
  },

  heroTitle: {
    fontSize: "clamp(30px, 6vw, 56px)",
    fontWeight: "bold"
  },

  heroSubtitle: {
    color: "#ccc",
    marginTop: "10px"
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "60px"
  },

  card: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.4s ease",
    background: "#111"
  },

  cardImage: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    transition: "transform 0.5s ease"
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
  },

  cardTitle: {
    position: "absolute",
    bottom: "10px",
    left: "10px"
  },

  btn: {
    background: "linear-gradient(45deg, gold, orange)",
    border: "none",
    padding: "10px 18px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease"
  },

  contactBtn: {
  border: "1px solid #00d4ff",
  color: "#00d4ff",
  padding: "10px 18px",
  borderRadius: "20px",
  background: "transparent",
  cursor: "pointer",
  transition: "0.3s"
},


  adminBtn: {
    border: "1px solid gold",
    color: "gold",
    padding: "10px 18px",
    borderRadius: "20px",
    background: "transparent",
    cursor: "pointer"
  }
};

export default Dashboard;
