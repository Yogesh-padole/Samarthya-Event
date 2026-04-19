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

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

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
      const res = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ACTIONS =================
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/approve/${id}`, {
        method: "PUT"
      });

      const data = await res.json();
      alert(data.message);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/decline/${id}`, {
        method: "PUT"
      });

      const data = await res.json();
      alert(data.message);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      alert(data.message);
      fetchBookings();
    } catch (err) {
      console.error(err);
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

    try {
      const res = await fetch("http://localhost:5000/api/admin/add-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin)
      });

      const data = await res.json();

      if (data.success) {
        alert("Admin Added ✅");
        setNewAdmin({ username: "", password: "" });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding admin");
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
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddDecoration = async (e) => {
    e.preventDefault();

    if (!imageFile) return alert("Select image");

    try {
      const formData = new FormData();
      formData.append("name", decoration.name);
      formData.append("price", decoration.price);
      formData.append("category", decoration.category);
      formData.append("decorationIdx", decoration.decorationIdx);
      formData.append("image", imageFile);

      const res = await fetch("http://localhost:5000/api/decorations/add", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert("Decoration Added 🎉");

        setDecoration({
          name: "",
          price: "",
          category: "",
          decorationIdx: ""
        });

        setImageFile(null);
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleRow = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={styles.container}>

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
                {!isMobile && (
                  <>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Decoration ID</th>
                    <th style={styles.th}>Mobile</th>
                    <th style={styles.th}>Description</th>
                  </>
                )}
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b, i) => (
                <React.Fragment key={i}>
                  <tr
                    onClick={() => isMobile && toggleRow(i)}
                    style={{
                      cursor: isMobile ? "pointer" : "default",
                      background: openIndex === i ? "#222" : ""
                    }}
                  >
                    <td style={styles.td}>{b.name}</td>
                    <td style={styles.td}>{b.event}</td>
                    <td style={styles.td}>{b.location}</td>

                    {!isMobile && (
                      <>
                        <td style={styles.td}>{b.date}</td>
                        <td style={styles.td}>{b.decorationIdx}</td>
                        <td style={styles.td}>{b.mobile || "N/A"}</td>
                        <td style={styles.td}>{b.description || "-"}</td>
                      </>
                    )}

                  <td style={styles.td}>
                  <div style={styles.actionGroup}>

                    <button
                      style={styles.approveBtn}
                      onClick={(e) => { e.stopPropagation(); handleApprove(b._id); }}
                    >
                       Approve
                    </button>

                    <button
                      style={styles.declineBtn}
                      onClick={(e) => { e.stopPropagation(); handleDecline(b._id); }}
                    >
                       Decline
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={(e) => { e.stopPropagation(); handleDelete(b._id); }}
                    >
                      Delete
                    </button>

                  </div>
                </td>

                  </tr>

                  {isMobile && openIndex === i && (
                    <tr>
                      <td colSpan="4" style={styles.expandBox}>
                        <p><strong>Date:</strong> {b.date}</p>
                        <p><strong>Decoration ID:</strong> {b.decorationIdx}</p>
                        <p><strong>Mobile:</strong> {b.mobile || "N/A"}</p>
                        <p><strong>Description:</strong> {b.description || "-"}</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD DECORATION */}
      <div style={styles.card}>
        <h2 style={styles.subHeading}>Add Decoration Package</h2>
        <form onSubmit={handleAddDecoration} style={styles.form}>
          <input style={styles.input} name="name" placeholder="Decoration Name"
            value={decoration.name} onChange={handleDecorationChange} required />

          <input type="file" accept="image/*"
            onChange={handleImageChange} style={styles.input} required />

          {preview && <img src={preview} alt="preview" style={styles.previewImg} />}

          <input style={styles.input} name="price"
            placeholder="Price" value={decoration.price}
            onChange={handleDecorationChange} required />

          <select style={styles.input} name="category"
            value={decoration.category}
            onChange={handleDecorationChange} required>
            <option value="">Select Category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <input style={styles.input} name="decorationIdx"
            placeholder="Decoration ID"
            value={decoration.decorationIdx}
            onChange={handleDecorationChange} required />

          <button type="submit" style={styles.addBtn}>
            Add Decoration
          </button>
        </form>
      </div>

      {/* ADD ADMIN */}
      <div style={styles.card}>
        <h2 style={styles.subHeading}>Add New Admin</h2>
        <form onSubmit={handleAddAdmin} style={styles.form}>
          <input style={styles.input} name="username"
            placeholder="Username"
            value={newAdmin.username}
            onChange={handleAdminChange} required />

          <input style={styles.input} type="password"
            name="password"
            placeholder="Password"
            value={newAdmin.password}
            onChange={handleAdminChange} required />

          <button type="submit" style={styles.addBtn}>
            Add Admin
          </button>
        </form>
      </div>

    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #0b0b0b, #1a1a1a)",
    minHeight: "100vh",
    padding: "30px",
    color: "white"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },
  heading: { color: "gold" },
  logoutBtn: {
    border: "1px solid red",
    color: "red",
    padding: "8px 14px",
    background: "transparent",
    borderRadius: "8px",
    cursor: "pointer"
  },
  card: {
    background: "#111",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "25px"
  },
  subHeading: {
    marginBottom: "15px",
    color: "#ddd"
  },
  tableWrapper: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed"
  },
  th: {
    background: "linear-gradient(135deg, #FFD700, #FFA500)",
    color: "#000",
    padding: "12px"
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #333",
    wordWrap: "break-word"
  },
  expandBox: {
    background: "#1a1a1a",
    padding: "15px",
    color: "#ccc"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#000",
    color: "white"
  },
  previewImg: {
    width: "150px",
    borderRadius: "10px"
  },
  addBtn: {
    background: "gold",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },

 actionGroup: {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap", // ✅ mobile friendly
},

approveBtn: {
  background: "linear-gradient(135deg, #00c853, #69f0ae)",
  color: "#000",
  border: "none",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  cursor: "pointer",
  flex: "1",
  minWidth: "80px",
  transition: "0.2s",
},

declineBtn: {
  background: "linear-gradient(135deg, #ff9800, #ffc107)",
  color: "#000",
  border: "none",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  cursor: "pointer",
  flex: "1",
  minWidth: "80px",
  transition: "0.2s",
},

deleteBtn: {
  background: "linear-gradient(135deg, #ff1744, #ff616f)",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  cursor: "pointer",
  flex: "1",
  minWidth: "80px",
  transition: "0.2s",
},

};

export default AdminDashboard;
