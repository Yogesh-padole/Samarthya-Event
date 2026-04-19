import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ CATEGORIES (SAME AS DASHBOARD)
const categories = [
  { name: "Birthday", img: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84" },
  { name: "Kids Party", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9" },
  { name: "Anniversary", img: "https://images.unsplash.com/photo-1519741497674-611481863552" },
  { name: "Newborn", img: "https://images.unsplash.com/photo-1609220136736-443140cffec6" },
  { name: "Balloon Decoration", img:"https://images.unsplash.com/photo-1530104091755-015d31dfa0b9" },
  { name: "Wedding", img: "https://plus.unsplash.com/premium_photo-1682092632793-c7d75b23718e" },
  { name: "Corporate Event", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
  { name: "Mandap Decoration", img:"https://images.unsplash.com/photo-1587271636175-90d58cdad458" },
  { name: "Welcome Decoration", img:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
  { name: "Rangoli Decoration", img:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3" },
  { name: "Flower Decoration", img:"https://images.unsplash.com/photo-1490750967868-88aa4486c946" },
  { name: "Stage Decoration", img:"https://images.unsplash.com/photo-1568989357443-057c03fb10fc" },
];

function Booking({ onClose }) {

  const location = useLocation();
  const navigate = useNavigate();

 const [form, setForm] = useState({
  name: "",
  mobile: "",
  email: "",   
  event: "",
  date: "",
  location: "",
  description: "",
  decorationIdx: ""
});


  // ✅ AUTO-FILL decorationIdx FROM URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idx = params.get("decorationIdx");

    if (idx) {
      setForm((prev) => ({
        ...prev,
        decorationIdx: idx
      }));
    }
  }, [location]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.mobile.length !== 10) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    try {
      const res = await fetch("https://samarthya-event.onrender.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          decorationIdx: Number(form.decorationIdx)
        })
      });

      const data = await res.json();

     if (data.success) {
  alert("Booking Successful 🎉");

  // ✅ RESET FORM
  setForm({
    name: "",
    mobile: "",
    email: "",
    event: "",
    date: "",
    location: "",
    description: "",
    decorationIdx: ""
  });

  navigate("/");
}
 else {
        alert("Failed: " + data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // ================= CLOSE =================
 const handleClose = () => {
  if (onClose) {
    onClose();   // close modal
  }
};


  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.box} onClick={(e) => e.stopPropagation()}>

        <h2 style={styles.title}>✨ Book Your Event</h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          <input
            style={styles.input}
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            name="mobile"
            type="tel"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Your Email (for booking updates)"
            value={form.email}
            onChange={handleChange}
          />


          {/* ✅ DYNAMIC DROPDOWN */}
          <select
            style={styles.input}
            name="event"
            value={form.event}
            onChange={handleChange}
            required
          >
            <option value="">Select Event Type</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            style={styles.input}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            name="location"
            placeholder="Enter Event Address"
            value={form.location}
            onChange={handleChange}
            required
          />

          <textarea
            style={styles.textarea}
            name="description"
            placeholder="Enter event details (optional)"
            value={form.description}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            type="number"
            name="decorationIdx"
            placeholder="Enter Decoration ID associated with your package (see category page)"
            value={form.decorationIdx}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            style={styles.submitBtn}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            Submit Booking 🚀
          </button>
        </form>

        <button
          onClick={handleClose}
          style={styles.closeBtn}
        >
          Close
        </button>

      </div>
    </div>
  );
}

// ================= PRO STYLES =================
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(8px)",
    padding: "10px"
  },

  box: {
    background: "linear-gradient(145deg, #0f2027, #203a43, #2c5364)",
    padding: "25px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "420px",
    color: "white",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
    animation: "fadeIn 0.5s ease"
  },

  title: {
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "bold",
    background: "linear-gradient(45deg, gold, orange)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.6)",
    color: "white",
    outline: "none",
    fontSize: "14px",
    transition: "0.3s"
  },

  textarea: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.6)",
    color: "white",
    minHeight: "90px",
    resize: "none"
  },

  submitBtn: {
    marginTop: "10px",
    background: "linear-gradient(45deg, gold, orange)",
    border: "none",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "0.3s",
    boxShadow: "0 5px 20px rgba(255,165,0,0.4)"
  },

  closeBtn: {
    marginTop: "15px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#ccc",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer"
  }
};

export default Booking;
