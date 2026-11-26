import React from "react";

export default function Sidebar({
  user,
  links,
  activeTab,
  onSelectTab,
  onLogout,
  brandTitle = "EduFeedback",
}) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="dashboard-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
        <h2>{brandTitle}</h2>
      </div>

      <div className="user-info-panel">
        <div className="user-avatar-circle">
          <span>{initial}</span>
        </div>
        <h3 className="user-name-title">{user?.name || "User"}</h3>
        <p className="user-email-text">{user?.email || ""}</p>
        <span className="user-role-badge">
          {user?.userType ? user.userType.toUpperCase() : "USER"}
        </span>
      </div>

      <ul className="sidebar-nav-links">
        {links.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <li key={link.id} className={isActive ? "active" : ""}>
              <button
                type="button"
                className="nav-link-btn"
                onClick={() => onSelectTab(link.id)}
              >
                {link.icon && <i className={link.icon}></i>}
                <span>{link.label}</span>
              </button>
            </li>
          );
        })}
        <li className="logout-item">
          <button
            type="button"
            className="nav-link-btn logout-btn"
            onClick={onLogout}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
