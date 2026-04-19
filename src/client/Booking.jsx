import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const categories = [
  { name: "Birthday" },
  { name: "Kids Party" },
  { name: "Anniversary" },
  { name: "Newborn" },
  { name: "Balloon Decoration" },
  { name: "Wedding" },
  { name: "Corporate Event" },
  { name: "Mandap Decoration" },
  { name: "Welcome Decoration" },
  { name: "Rangoli Decoration" },
  { name: "Flower Decoration" },
  { name: "Stage Decoration" },
];

function Booking({ onClose }) {

  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // ✅ CUSTOM ALERT
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState(""); // success / error

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
      showAlert("Enter valid 10-digit mobile number", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/book`, {
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
        showAlert("Booking Successful 🎉", "success");

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

        setTimeout(() => {
          navigate("/");
        }, 1500);

      } else {
        showAlert(data.message || "Booking failed", "error");
      }

    } catch (err) {
      console.error(err);
      showAlert("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= ALERT FUNCTION =================
  const showAlert = (msg, type) => {
    setAlertMsg(msg);
    setAlertType(type);

    setTimeout(() => {
      setAlertMsg("");
    }, 3000);
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>

      {/* ✅ ALERT */}
      {alertMsg && (
        <div style={{
          ...styles.alert,
          background: alertType === "success" ? "#00c853" : "#ff1744"
        }}>
          {alertMsg}
        </div>
      )}

      <div style={styles.box} onClick={(e) => e.stopPropagation()}>

        <h2 style={styles.title}>✨ Book Your Event</h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          <input style={styles.input} name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required />

          <input style={styles.input} name="mobile"
            type="tel"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            required />

          <input style={styles.input} name="email"
            type="email"
            placeholder="Your Email (optional)"
            value={form.email}
            onChange={handleChange}
          />

          <select style={styles.input} name="event"
            value={form.event}
            onChange={handleChange}
            required>
            <option value="">Select Event Type</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <input style={styles.input}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required />

          <input style={styles.input}
            name="location"
            placeholder="Enter Event Address"
            value={form.location}
            onChange={handleChange}
            required />

          <textarea style={styles.textarea}
            name="description"
            placeholder="Event details (optional)"
            value={form.description}
            onChange={handleChange}
          />

          <input style={styles.input}
            type="number"
            name="decorationIdx"
            placeholder="Decoration ID"
            value={form.decorationIdx}
            onChange={handleChange}
            required />

          {/* ✅ LOADING BUTTON */}
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span style={styles.loader}></span>
            ) : (
              "Submit Booking 🚀"
            )}
          </button>

        </form>

        <button onClick={handleClose} style={styles.closeBtn}>
          Close
        </button>

      </div>
    </div>
  );
}

// ================= STYLES =================
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
    boxShadow: "0 20px 60px rgba(0,0,0,0.8)"
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
    color: "white"
  },

  textarea: {
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(0,0,0,0.6)",
    color: "white",
    minHeight: "80px"
  },

  submitBtn: {
    marginTop: "10px",
    background: "linear-gradient(45deg, gold, orange)",
    border: "none",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  closeBtn: {
    marginTop: "15px",
    background: "transparent",
    border: "1px solid #555",
    color: "#ccc",
    padding: "10px",
    borderRadius: "10px"
  },

  // ✅ LOADER
  loader: {
    width: "18px",
    height: "18px",
    border: "3px solid #fff",
    borderTop: "3px solid transparent",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 1s linear infinite"
  },

  // ✅ ALERT
  alert: {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 20px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    zIndex: 999
  }
};

export default Booking;
