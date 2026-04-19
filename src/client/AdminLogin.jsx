import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://192.168.56.1:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();

      if (data.success) {
        alert("Login Successful ✅");
        navigate("/admin");
      } else {
        alert("Invalid Credentials ❌");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleClose = () => {
    navigate("/"); // go back to main dashboard
  };

  return (
    <div style={styles.container}>
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

          <button type="submit" style={styles.loginBtn}>
            Login
          </button>
        </form>

        <button onClick={handleClose} style={styles.closeBtn}>
          Close
        </button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0b0b0b, #1a1a1a)",
    fontFamily: "sans-serif"
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
    marginBottom: "20px",
    letterSpacing: "1px"
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
    outline: "none",
    fontSize: "14px"
  },

  loginBtn: {
    marginTop: "10px",
    background: "linear-gradient(45deg, gold, orange)",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 4px 15px rgba(255,215,0,0.4)"
  },

  closeBtn: {
    marginTop: "15px",
    background: "transparent",
    border: "1px solid #555",
    color: "#ccc",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s"
  }
};

export default AdminLogin;
