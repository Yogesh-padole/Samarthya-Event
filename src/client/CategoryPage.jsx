import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Booking from "./Booking"; // ✅ IMPORT BOOKING

function CategoryPage() {
  const { categoryName } = useParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ NEW STATES FOR MODAL
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, [categoryName]);

  const fetchPackages = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://samarthya-event.onrender.com/api/decorations/${categoryName}`
      );

      const data = await res.json();
      setPackages(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED (NO NAVIGATE)
  const handleSelect = (pkg) => {
    setSelectedPkg(pkg);
    setShowBooking(true);
  };

  return (
    <>
      <div style={styles.container}>

        {/* BACK BUTTON */}
        <button 
          style={styles.backBtn}
          onClick={() => navigate("/")}
        >
          ⬅ Back
        </button>

        <h1 style={styles.heading}>
          {categoryName} Decorations
        </h1>

        {loading && <p style={styles.msg}>Loading...</p>}

        {!loading && packages.length === 0 && (
          <p style={styles.msg}>No decorations found 😢</p>
        )}

        <div style={styles.grid}>
          {packages.map((p) => (
            <div
              key={p._id}
              style={styles.card}
              onClick={() => handleSelect(p)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.7)";
                e.currentTarget.querySelector("img").style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.5)";
                e.currentTarget.querySelector("img").style.transform = "scale(1)";
              }}
            >
              <div style={styles.imgWrapper}>
                <img 
                  src={p.image} 
                  alt={p.name}
                  style={styles.img}
                />
              </div>

              <h3 style={styles.title}>{p.name}</h3>

              <p style={styles.price}>₹{p.price}</p>

              <p style={styles.id}>ID: {p.decorationIdx}</p>
            </div>
          ))}
        </div>

      </div>

      {/* ✅ BOOKING MODAL */}
      {showBooking && (
        <Booking
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #0f0f0f, #1c1c1c)",
    minHeight: "100vh",
    color: "white",
    padding: "20px",
    fontFamily: "sans-serif"
  },

  backBtn: {
    position: "fixed",
    top: "15px",
    left: "15px",
    background: "rgba(255,215,0,0.1)",
    border: "1px solid gold",
    color: "gold",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    backdropFilter: "blur(6px)",
    zIndex: 10
  },

  heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "clamp(22px, 4vw, 32px)",
    fontWeight: "600",
    background: "linear-gradient(90deg, gold, orange)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  msg: {
    textAlign: "center",
    marginTop: "30px",
    color: "#bbb",
    fontSize: "16px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    padding: "10px"
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "18px",
    padding: "12px",
    cursor: "pointer",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
  },

  imgWrapper: {
    overflow: "hidden",
    borderRadius: "12px",
    marginBottom: "10px"
  },

  img: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    transition: "transform 0.4s ease"
  },

  title: {
    fontSize: "15px",
    marginBottom: "5px",
    fontWeight: "500"
  },

  price: {
    color: "#00ff9d",
    fontWeight: "600",
    marginBottom: "5px"
  },

  id: {
    color: "gold",
    fontSize: "11px"
  }
};

export default CategoryPage;
