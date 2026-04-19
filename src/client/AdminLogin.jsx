import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // ================= TOAST =================
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();

      if (data.success) {
        showToast("Login Successful ✅");
        setTimeout(() => navigate("/admin"), 1000);
      } else {
        showToast("Invalid Credentials ❌", "error");
      }

    } catch (err) {
      console.error(err);
      showToast("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/");
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

      {/* LOADER */}
      {loading && (
        <div style={styles.loaderOverlay}>
          <div style={styles.loader}></div>
        </div>
      )}

      <div style={styles.box}>
        <h2 style={styles.title}>Admin Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            style={styles.loginBtn}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0b0b0b, #1a1a1a)",
    fontFamily: "sans-serif",
    padding: "10px"
  },

  box: {
    background: "linear-gradient(135deg, #111, #1c1c1c)",
    padding: "30px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "350px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.7)",
    border: "1px solid #222"
  },

  title: {
    color: "gold",
    marginBottom: "20px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#0b0b0b",
    color: "white",
    outline: "none"
  },

  loginBtn: {
    marginTop: "10px",
    background: "linear-gradient(45deg, gold, orange)",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  closeBtn: {
    marginTop: "15px",
    background: "transparent",
    border: "1px solid #555",
    color: "#ccc",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  // 🔥 TOAST
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "10px",
    color: "#fff",
    zIndex: 1000,
    fontWeight: "bold"
  },

  // 🔥 LOADER
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

export default AdminLogin;
