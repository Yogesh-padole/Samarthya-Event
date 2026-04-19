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

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/approve/${id}`,
        { method: "PUT" }
      );
      const data = await res.json();
      alert(data.message);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/decline/${id}`,
        { method: "PUT" }
      );
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      alert(data.message);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleAdminChange = (e) => {
    setNewAdmin({
      ...newAdmin,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();

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
        alert("Admin Added ✅");
        setNewAdmin({ username: "", password: "" });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

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

    if (imageFiles.length === 0) return alert("Select images");

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
        alert("Decoration Added 🎉");

        setDecoration({
          name: "",
          price: "",
          category: "",
          decorationIdx: ""
        });

        setImageFiles([]);
        setPreview([]);
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

      {/* HEADER */}
      <div style={styles.topBar}>
        <h1 style={styles.heading}>Admin Dashboard</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* BOOKINGS */}
      <div style={styles.card}>
        <h2 style={styles.subHeading}>Bookings</h2>

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
                        <button style={styles.approveBtn}
                          onClick={(e) => { e.stopPropagation(); handleApprove(b._id); }}>
                          ✔
                        </button>

                        <button style={styles.declineBtn}
                          onClick={(e) => { e.stopPropagation(); handleDecline(b._id); }}>
                          ✖
                        </button>

                        <button style={styles.deleteBtn}
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

      {/* ADD DECORATION */}
      <div style={styles.card}>
        <h2 style={styles.subHeading}>Add Decoration</h2>

        <form onSubmit={handleAddDecoration} style={styles.form}>
          <input style={styles.input} name="name" placeholder="Name"
            value={decoration.name} onChange={handleDecorationChange} required />

          <input type="file" multiple accept="image/*"
            onChange={handleImageChange} style={styles.input} />

          <div style={styles.previewContainer}>
            {preview.map((img, i) => (
              <img key={i} src={img} alt="" style={styles.previewImg} />
            ))}
          </div>

          <input style={styles.input} name="price" placeholder="Price"
            value={decoration.price} onChange={handleDecorationChange} required />

          <select style={styles.input} name="category"
            value={decoration.category} onChange={handleDecorationChange} required>
            <option value="">Select Category</option>
            {categories.map((c, i) => (
              <option key={i}>{c.name}</option>
            ))}
          </select>

          <input style={styles.input} name="decorationIdx"
            placeholder="Decoration ID"
            value={decoration.decorationIdx}
            onChange={handleDecorationChange} required />

          <button style={styles.addBtn}>Add</button>
        </form>
      </div>

      {/* ADD ADMIN */}
      <div style={styles.card}>
        <h2 style={styles.subHeading}>Add Admin</h2>

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

          <button style={styles.addBtn}>Add Admin</button>
        </form>
      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    background: "#0f0f0f",
    minHeight: "100vh",
    color: "#fff"
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px"
  },

  heading: {
    color: "#FFD700",
    fontSize: "clamp(20px, 4vw, 28px)"
  },

  logoutBtn: {
    border: "1px solid red",
    color: "red",
    background: "transparent",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  card: {
    background: "#181818",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
  },

  subHeading: {
    marginBottom: "12px",
    fontSize: "18px",
    color: "#ccc"
  },

  tableWrapper: { overflowX: "auto" },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    background: "#FFD700",
    color: "#000",
    padding: "10px",
    fontSize: "14px"
  },

  td: {
    padding: "10px",
    borderBottom: "1px solid #333",
    fontSize: "13px"
  },

  row: {
    cursor: "pointer"
  },

  expandBox: {
    padding: "10px",
    background: "#222",
    fontSize: "13px"
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
    color: "#fff"
  },

  previewContainer: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },

  previewImg: {
    width: "70px",
    height: "70px",
    borderRadius: "8px",
    objectFit: "cover"
  },

  addBtn: {
    background: "#FFD700",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  actionGroup: {
    display: "flex",
    gap: "5px"
  },

  approveBtn: {
    background: "#00e676",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  declineBtn: {
    background: "#ffb300",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  deleteBtn: {
    background: "#ff1744",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#fff"
  }
};

export default AdminDashboard;
