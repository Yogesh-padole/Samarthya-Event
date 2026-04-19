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
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

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

  useEffect(() => {
    fetchBookings();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔔 TOAST
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  // ================= BOOKINGS =================
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      showToast("Failed to load bookings", "error");
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
      showToast("Error approving", "error");
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
      showToast("Error declining", "error");
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
      showToast("Error deleting", "error");
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
      return showToast("Select images", "error");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", decoration.name);
      formData.append("price", decoration.price);
      formData.append("category", decoration.category);
      formData.append("decorationIdx", decoration.decorationIdx);

      imageFiles.forEach(file => {
        formData.append("images", file);
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/decorations/add`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      if (data.success) {
        showToast("Decoration Added 🎉");
        setDecoration({
          name: "",
          price: "",
          category: "",
          decorationIdx: ""
        });
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
      {toast.show && (
        <div style={{
          ...styles.toast,
          background: toast.type === "error" ? "#ff1744" : "#00c853"
        }}>
          {toast.message}
        </div>
      )}

      {/* LOADER */}
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
        <h2 style={styles.subHeading}>
          All Bookings {isMobile && "(Tap row to view details)"}
        </h2>

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
                <React.Fragment key={i}>
                  <tr
                    onClick={() => isMobile && toggleRow(i)}
                    style={styles.row}
                  >
                    <td style={styles.td}>{b.name}</td>
                    <td style={styles.td}>{b.event}</td>
                    <td style={styles.td}>{b.location}</td>
                    {!isMobile && <td style={styles.td}>{b.date}</td>}

                    <td style={styles.td}>
                      <div style={styles.actionGroup}>
                        <button disabled={loading} style={styles.approveBtn}
                          onClick={(e) => { e.stopPropagation(); handleApprove(b._id); }}>
                          ✔
                        </button>

                        <button disabled={loading} style={styles.declineBtn}
                          onClick={(e) => { e.stopPropagation(); handleDecline(b._id); }}>
                          ✖
                        </button>

                        <button disabled={loading} style={styles.deleteBtn}
                          onClick={(e) => { e.stopPropagation(); handleDelete(b._id); }}>
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isMobile && openIndex === i && (
                    <tr>
                      <td colSpan="5" style={styles.expandBox}>
                        <p><b>Date:</b> {b.date}</p>
                        <p><b>ID:</b> {b.decorationIdx}</p>
                        <p><b>Mobile:</b> {b.mobile}</p>
                        <p><b>Description:</b> {b.description}</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD DECORATION + ADMIN SAME AS BEFORE */}

    </div>
  );
}

const styles = {
  container: { padding: "20px", background: "#0f0f0f", minHeight: "100vh", color: "#fff" },

  topBar: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },

  heading: { color: "#FFD700" },

  logoutBtn: { border: "1px solid red", color: "red", padding: "8px 14px", background: "transparent", borderRadius: "8px" },

  card: { background: "#181818", padding: "18px", borderRadius: "14px", marginBottom: "20px" },

  subHeading: { marginBottom: "12px", color: "#ccc" },

  tableWrapper: { overflowX: "auto" },

  table: { width: "100%", borderCollapse: "collapse" },

  th: { background: "#FFD700", color: "#000", padding: "10px" },

  td: { padding: "10px", borderBottom: "1px solid #333" },

  row: { cursor: "pointer" },

  expandBox: { padding: "10px", background: "#222" },

  actionGroup: { display: "flex", gap: "5px" },

  approveBtn: { background: "#00e676", border: "none", padding: "6px 10px", borderRadius: "6px" },

  declineBtn: { background: "#ffb300", border: "none", padding: "6px 10px", borderRadius: "6px" },

  deleteBtn: { background: "#ff1744", border: "none", padding: "6px 10px", borderRadius: "6px", color: "#fff" },

  loaderOverlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.6)", display: "flex",
    justifyContent: "center", alignItems: "center", zIndex: 999
  },

  loader: {
    width: "50px", height: "50px",
    border: "5px solid #333",
    borderTop: "5px solid gold",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  toast: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    zIndex: 1000
  }
};

export default AdminDashboard;
