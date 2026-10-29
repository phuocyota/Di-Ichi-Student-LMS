import React from "react";
import { PortalScreen } from "../portal/PortalScreen.jsx";
import ChangePasswordForm from "../components/ChangePasswordForm.jsx";
export default function ProfilePage() {
  return (
    <div className="portal">
      <PortalScreen mode="profile" />
      <ChangePasswordForm />
    </div>
  );
}
