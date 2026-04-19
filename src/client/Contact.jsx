function Contact({ onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        <button style={styles.closeBtn} onClick={onClose}>✖</button>

        <h2 style={styles.heading}>Contact Us</h2>

        <div style={styles.info}>
          <p><strong>Name:</strong> Nayan Mohakar</p>
          <p><strong>Mobile:</strong> +91 80106 99974</p>
          <p><strong>Email:</strong> nayanmohakar04@gmail.com</p>
          <p><strong>Instagram:</strong> @Samarthya_events</p>

          <a 
            href="https://www.instagram.com/samarthya_events?igsh=MXZ4OG0xdWJqOTN5aQ=="
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            Open Instagram Profile
          </a>
        </div>

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },

  modal: {
    background: "#111",
    padding: "25px",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "400px",
    color: "white",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 10px 40px rgba(0,0,0,0.8)"
  },

  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer"
  },

  heading: {
    color: "gold",
    marginBottom: "20px"
  },

  info: {
    lineHeight: "1.8"
  },

  link: {
    display: "inline-block",
    marginTop: "15px",
    color: "gold",
    textDecoration: "none",
    border: "1px solid gold",
    padding: "8px 12px",
    borderRadius: "10px"
  }
};

export default Contact;
