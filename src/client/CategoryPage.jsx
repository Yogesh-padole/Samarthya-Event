import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Booking from "./Booking";

function CategoryPage() {
  const { categoryName } = useParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ MODAL STATES
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showBooking, setShowBooking] = useState(false);

  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    fetchPackages();
  }, [categoryName]);

  const fetchPackages = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/decorations/${categoryName}`
      );

      const data = await res.json();
      setPackages(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ OPEN MODAL
  const handleOpen = (pkg) => {
    setSelectedPkg(pkg);
    setCurrentImg(0);
    setShowModal(true);
  };

  const nextImage = (length) => {
    setCurrentImg((prev) => (prev + 1) % length);
  };

  const prevImage = (length) => {
    setCurrentImg((prev) => (prev - 1 + length) % length);
  };

  return (
    <>
      <div style={styles.container}>

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
          {packages.map((p) => {
            const img = p.images?.[0] || p.image;

            return (
              <div
                key={p._id}
                style={styles.card}
                onClick={() => handleOpen(p)}
              >
                <img src={img} alt={p.name} style={styles.img} />
                <h3 style={styles.title}>{p.name}</h3>
                <p style={styles.price}>₹{p.price}</p>
              </div>
            );
          })}
        </div>

      </div>

      {/* ================= MODAL ================= */}
      {showModal && selectedPkg && (
        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            {/* CLOSE */}
            <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
              ✖
            </button>

            {/* IMAGES */}
            <div style={styles.modalImgWrapper}>
              <img
                src={selectedPkg.images?.[currentImg] || selectedPkg.image}
                style={styles.modalImg}
              />

              {selectedPkg.images?.length > 1 && (
                <>
                  <button
                    style={styles.leftBtn}
                    onClick={() => prevImage(selectedPkg.images.length)}
                  >
                    ◀
                  </button>

                  <button
                    style={styles.rightBtn}
                    onClick={() => nextImage(selectedPkg.images.length)}
                  >
                    ▶
                  </button>
                </>
              )}
            </div>

            {/* DETAILS */}
            <h2 style={styles.modalTitle}>{selectedPkg.name}</h2>
            <p style={styles.modalPrice}>₹{selectedPkg.price}</p>
            <p style={styles.modalId}>ID: {selectedPkg.decorationIdx}</p>

            {/* BOOK BUTTON */}
            <button
              style={styles.bookBtn}
              onClick={() => {
                setShowModal(false);
                setShowBooking(true);
              }}
            >
              Book Now
            </button>

          </div>
        </div>
      )}

      {/* BOOKING */}
      {showBooking && (
        <Booking onClose={() => setShowBooking(false)} />
      )}
    </>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    background: "linear-gradient(135deg, #0f0f0f, #1c1c1c)",
    minHeight: "100vh",
    color: "white",
    padding: "20px"
  },

  backBtn: {
    position: "fixed",
    top: "15px",
    left: "15px",
    background: "transparent",
    border: "1px solid gold",
    color: "gold",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "26px",
    color: "gold"
  },

  msg: { textAlign: "center", color: "#bbb" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#111",
    padding: "10px",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "center"
  },

  img: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  title: { fontSize: "14px" },
  price: { color: "#00ff9d" },

  // 🔥 MODAL
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },

  modal: {
    background: "#111",
    padding: "20px",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
    position: "relative"
  },

  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    padding: "5px 8px",
    cursor: "pointer"
  },

  modalImgWrapper: {
    position: "relative"
  },

  modalImg: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "12px"
  },

  leftBtn: {
    position: "absolute",
    top: "50%",
    left: "10px",
    transform: "translateY(-50%)",
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "5px",
    cursor: "pointer"
  },

  rightBtn: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "5px",
    cursor: "pointer"
  },

  modalTitle: { marginTop: "10px" },
  modalPrice: { color: "#00ff9d" },
  modalId: { color: "gold", fontSize: "12px" },

  bookBtn: {
    marginTop: "15px",
    background: "gold",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default CategoryPage;
