import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

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

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: ""
  });

  const [decoration, setDecoration] = useState({
    name: "",
    price: "",
    category: "",
    decorationIdx: ""
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  const navigate = useNavigate();

  // ================= TOAST =================
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ================= INIT =================
  useEffect(() => {
    fetchBookings();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= BOOKINGS =================
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      showToast("Error fetching bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= ACTIONS =================
  const handleApprove = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/approve/${id}`,
        { method: "PUT" }
      );

      const data = await res.json();
      showToast(data.message);
      fetchBookings();
    } catch {
      showToast("Error approving booking", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/decline/${id}`,
        { method: "PUT" }
      );

      const data = await res.json();
      showToast(data.message);
      fetchBookings();
    } catch {
      showToast("Error declining booking", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      showToast(data.message);
      fetchBookings();
    } catch {
      showToast("Error deleting booking", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    navigate("/");
  };

  // ================= ADMIN =================
  const handleAdminChange = (e) => {
    setNewAdmin({
      ...newAdmin,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/add-admin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAdmin)
        }
      );

      const data = await res.json();

      if (data.success) {
        showToast("Admin Added ✅");
        setNewAdmin({ username: "", password: "" });
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Error adding admin", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= DECORATION =================
  const handleDecorationChange = (e) => {
    setDecoration({
      ...decoration,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreview(files.map(file => URL.createObjectURL(file)));
  };

  const handleAddDecoration = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      showToast("Select images", "error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(decoration).forEach(key =>
        formData.append(key, decoration[key])
      );

      imageFiles.forEach(file => {
        formData.append("images", file);
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/decorations/add`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (data.success) {
        showToast("Decoration Added 🎉");
        setDecoration({ name: "", price: "", category: "", decorationIdx: "" });
        setImageFiles([]);
        setPreview([]);
      }
    } catch {
      showToast("Error adding decoration", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={styles.container}>

      {/* TOAST */}
      {toast && (
        <div style={{
          ...styles.toast,
          background: toast.type === "error" ? "#ff4444" : "#00c853"
        }}>
          {toast.msg}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div style={styles.loaderOverlay}>
          <div style={styles.loader}></div>
        </div>
      )}

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <h1 style={styles.heading}>Admin Dashboard</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* BOOKINGS */}
      <div style={styles.card}>
        <h2 style={styles.subHeading}>All Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Event</th>
                  <th style={styles.th}>Location</th>
                  {!isMobile && <th style={styles.th}>Date</th>}
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{b.name}</td>
                    <td style={styles.td}>{b.event}</td>
                    <td style={styles.td}>{b.location}</td>
                    {!isMobile && <td style={styles.td}>{b.date}</td>}

                    <td style={styles.td}>
                      <div style={styles.actionGroup}>
                        <button style={styles.approveBtn} onClick={() => handleApprove(b._id)}>Approve</button>
                        <button style={styles.declineBtn} onClick={() => handleDecline(b._id)}>Decline</button>
                        <button style={styles.deleteBtn} onClick={() => handleDelete(b._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD DECORATION */}
      <div style={styles.card}>
        <h2 style={styles.subHeading}>Add Decoration</h2>
        <form onSubmit={handleAddDecoration} style={styles.form}>
          <input style={styles.input} name="name" placeholder="Name" value={decoration.name} onChange={handleDecorationChange} required />
          <input type="file" multiple onChange={handleImageChange} style={styles.input} />
          <div style={styles.previewContainer}>
            {preview.map((img, i) => <img key={i} src={img} style={styles.previewImg} />)}
          </div>
          <input style={styles.input} name="price" placeholder="Price" value={decoration.price} onChange={handleDecorationChange} required />

          <select style={styles.input} name="category" value={decoration.category} onChange={handleDecorationChange} required>
            <option value="">Select Category</option>
            {categories.map((cat, i) => <option key={i}>{cat.name}</option>)}
          </select>

          <input style={styles.input} name="decorationIdx" placeholder="ID" value={decoration.decorationIdx} onChange={handleDecorationChange} required />
          <button style={styles.addBtn}>Add</button>
        </form>
      </div>

      {/* ADD ADMIN */}
      <div style={styles.card}>
        <h2 style={styles.subHeading}>Add Admin</h2>
        <form onSubmit={handleAddAdmin} style={styles.form}>
          <input style={styles.input} name="username" placeholder="Username" value={newAdmin.username} onChange={handleAdminChange} required />
          <input style={styles.input} type="password" name="password" placeholder="Password" value={newAdmin.password} onChange={handleAdminChange} required />
          <button style={styles.addBtn}>Add Admin</button>
        </form>
      </div>

    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: { background: "#0b0b0b", minHeight: "100vh", padding: "20px", color: "white" },
  topBar: { display: "flex", justifyContent: "space-between" },
  heading: { color: "gold" },

  logoutBtn: { border: "1px solid red", color: "red", background: "transparent", padding: "8px", borderRadius: "8px" },

  card: { background: "#111", padding: "20px", borderRadius: "16px", marginTop: "20px" },
  subHeading: { marginBottom: "10px" },

  table: { width: "100%" },
  th: { background: "gold", color: "#000", padding: "10px" },
  td: { padding: "10px" },

  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: "8px", background: "#000", color: "white" },

  addBtn: { background: "gold", padding: "10px", borderRadius: "8px" },

  actionGroup: { display: "flex", gap: "5px" },
  approveBtn: { background: "green", color: "#fff", padding: "5px" },
  declineBtn: { background: "orange", padding: "5px" },
  deleteBtn: { background: "red", color: "#fff", padding: "5px" },

  previewContainer: { display: "flex", gap: "10px" },
  previewImg: { width: "60px", height: "60px", borderRadius: "8px" },

  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "10px 20px",
    borderRadius: "8px",
    color: "#fff",
    zIndex: 1000
  },

  loaderOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  },

  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid #ccc",
    borderTop: "5px solid gold",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};

export default AdminDashboard;
