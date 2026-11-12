import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAccessToken } from "../../auth/authStorage.js";
import { usePortal } from "../../portal/portalStore.js";
export default function Header() {
  const { data, busy } = usePortal();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 border-b border-orange-100 bg-[#FFF8F2]/95 px-5 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-xl font-black text-orange-700">
            {data.profile.name?.slice(0, 1)}
          </span>
          <div>
            <p className="text-sm text-orange-600">Xin chào,</p>
            <p className="text-xl font-black">{data.profile.name}</p>
          </div>
        </NavLink>
        <div className="flex flex-wrap items-center gap-4">
          <NavLink to="/lesson-library">Thư viện bài giảng</NavLink>
          <NavLink to="/">
            Thông báo ({data.notifications.filter((n) => !n.readAt).length})
          </NavLink>
          <NavLink to="/profile">Đổi mật khẩu</NavLink>
          <button
            disabled={busy}
            onClick={() => {
              clearAccessToken();
              navigate("/login", { replace: true });
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}
