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
    <nav className="w-full md:w-64 bg-slate-900 text-white flex flex-col md:fixed md:top-0 md:bottom-0 md:left-0 z-40 overflow-y-auto border-r border-slate-800 shadow-xl">
      <div className="px-5 py-6 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-lg text-white shadow-md shadow-indigo-600/30">
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">{brandTitle}</h2>
          <span className="text-[11px] text-indigo-300 font-medium block">ABESEC Ghaziabad</span>
        </div>
      </div>

      <div className="p-5 text-center border-b border-slate-800/80">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-2.5 shadow-lg shadow-indigo-500/20 border-2 border-slate-800">
          <span>{initial}</span>
        </div>
        <h3 className="text-sm font-semibold text-white mb-0.5 truncate">{user?.name || "User"}</h3>
        <p className="text-xs text-slate-400 mb-2 truncate">{user?.email || ""}</p>
        <span className="inline-block bg-slate-800 text-amber-400 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-700">
          {user?.userType ? user.userType.toUpperCase() : "USER"}
        </span>
      </div>

      <ul className="py-4 px-2 space-y-1 flex-1 list-none">
        {links.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <li key={link.id}>
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
                onClick={() => onSelectTab(link.id)}
              >
                {link.icon && <i className={`${link.icon} text-base w-5 text-center`}></i>}
                <span>{link.label}</span>
              </button>
            </li>
          );
        })}
        <li className="pt-3 mt-3 border-t border-slate-800">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
            onClick={onLogout}
          >
            <i className="fa-solid fa-right-from-bracket text-base w-5 text-center"></i>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
