import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [toast,setToast]=useState({show:false,msg:"",type:"" });

  const showToast=(msg,type = "success") => {
    setToast({show:true,msg,type });
    setTimeout(()=>setToast({show:false,msg:"",type:""}),2500);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`https://eco-store-opns.onrender.com/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const updated = await res.json();
      login({ ...user, ...updated });
      setEditing(false);
      showToast("Profile updated successfully! ✅");
    } catch {
      showToast("Failed to update profile ❌","error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="profile-page">

      {/* Toast */}
      {toast.show && (
        <div className={`profile-toast ${toast.type}`}>{toast.msg}</div>
      )}

      <div className="profile-container">

        {/* ── LEFT SIDEBAR ── */}
        <div className="profile-sidebar">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-avatar-ring" />
          </div>
          <h3 className="profile-name">{user.name}</h3>
          <p className="profile-email">{user.email}</p>
          <span className="profile-role-badge">
            {user.role === "admin" ? "⚙️ Admin" : " Member"}
          </span>

          <nav className="profile-nav">
            <button
              className={`profile-nav-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fa-regular fa-user" /> My Profile
            </button>
            <Link to="/orders" className="profile-nav-btn">
              <i className="fa-solid fa-box" /> My Orders
            </Link>
            <Link to="/wishlist" className="profile-nav-btn">
              <i className="fa-solid fa-heart" /> Wishlist
            </Link>
            <Link to="/cart" className="profile-nav-btn">
              <i className="fa-solid fa-cart-shopping" /> My Cart
            </Link>
            {user.role === "admin" && (
              <Link to="/admin" className="profile-nav-btn admin-btn">
                <i className="fa-solid fa-gear" /> Admin Panel
              </Link>
            )}
            <button className="profile-nav-btn logout-btn" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket" /> Logout
            </button>
          </nav>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div className="profile-content">

          {activeTab === "profile" && (
            <div className="profile-card">
              <div className="profile-card-header">
                <h2>Personal Information</h2>
                {!editing ? (
                  <button className="edit-btn" onClick={() => setEditing(true)}>
                    <i className="fa-solid fa-pen" /> Edit
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="cancel-btn" onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email, phone: user.phone || "", address: user.address || "" }); }}>
                      Cancel
                    </button>
                    <button className="save-btn" onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-fields">
                <div className="profile-field">
                  <label>Full Name</label>
                  {editing ? (
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                  ) : (
                    <p>{user.name || "—"}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Email Address</label>
                  {editing ? (
                    <input name="email" value={form.email} onChange={handleChange} placeholder="Your email" type="email" />
                  ) : (
                    <p>{user.email || "—"}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Phone Number</label>
                  {editing ? (
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Your phone number" />
                  ) : (
                    <p>{user.phone || "—"}</p>
                  )}
                </div>

                <div className="profile-field full-width">
                  <label>Default Address</label>
                  {editing ? (
                    <textarea name="address" value={form.address} onChange={handleChange} placeholder="Your delivery address" rows={3} />
                  ) : (
                    <p>{user.address || "—"}</p>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="stat-icon"><i className="fa-solid fa-box" /></span>
                  <Link to="/orders" className="stat-label">My Orders</Link>
                </div>
                <div className="profile-stat">
                  <span className="stat-icon"><i className="fa-solid fa-heart" /></span>
                  <Link to="/wishlist" className="stat-label">Wishlist</Link>
                </div>
                <div className="profile-stat">
                  <span className="stat-icon"><i className="fa-solid fa-cart-shopping" /></span>
                  <Link to="/cart" className="stat-label">Cart</Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;