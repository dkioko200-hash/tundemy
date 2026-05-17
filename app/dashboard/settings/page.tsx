"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [nameSaved, setNameSaved] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login?next=/dashboard/settings"); return; }
      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      setFullName(profile?.full_name ?? "");
      setLoading(false);
    }
    load();
  }, [router]);

  const saveName = async () => {
    setSavingName(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({ id: user.id, full_name: fullName }, { onConflict: "id" });
    }
    setSavingName(false);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2500);
  };

  const savePassword = async () => {
    setPasswordError("");
    if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords don't match."); return; }
    setSavingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) { setPasswordError(error.message); return; }
    setPasswordSaved(true);
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderColor: "#2d8a4e", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#0f1f3d" }}>Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account details and preferences.</p>
      </div>

      {/* Account info */}
      <div className="rounded-2xl border bg-white p-6 space-y-4" style={{ borderColor: "#e5e7eb" }}>
        <h2 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Account Information</h2>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Wanjiku"
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors"
            style={{ borderColor: "#e5e7eb" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Email</label>
          <input value={email} disabled
            className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
            style={{ borderColor: "#e5e7eb" }} />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support if needed.</p>
        </div>
        <button onClick={saveName} disabled={savingName || !fullName.trim()}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: nameSaved ? "#166534" : "#2d8a4e" }}>
          {nameSaved ? "Saved!" : savingName ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Password */}
      <div className="rounded-2xl border bg-white p-6 space-y-4" style={{ borderColor: "#e5e7eb" }}>
        <h2 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Change Password</h2>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors"
            style={{ borderColor: "#e5e7eb" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors"
            style={{ borderColor: "#e5e7eb" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors"
            style={{ borderColor: "#e5e7eb" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f1f3d")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
        </div>
        {passwordError && <p className="text-xs font-medium" style={{ color: "#bb0000" }}>{passwordError}</p>}
        {passwordSaved && <p className="text-xs font-medium" style={{ color: "#166534" }}>Password updated successfully.</p>}
        <button onClick={savePassword} disabled={savingPassword || !newPassword || !confirmPassword}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#0f1f3d" }}>
          {savingPassword ? "Updating…" : "Update Password"}
        </button>
      </div>

      {/* Sign out */}
      <div className="rounded-2xl border bg-white p-6 flex items-center justify-between" style={{ borderColor: "#e5e7eb" }}>
        <div>
          <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Sign Out</p>
          <p className="text-xs text-gray-400 mt-0.5">Sign out of your Tundemy account.</p>
        </div>
        <button onClick={signOut}
          className="px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all hover:bg-gray-50"
          style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
          Sign Out
        </button>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(187,0,0,0.2)", backgroundColor: "rgba(187,0,0,0.02)" }}>
        <h2 className="text-sm font-bold mb-1" style={{ color: "#991b1b" }}>Danger Zone</h2>
        <p className="text-xs text-gray-500 mb-4">Deleting your account is permanent and cannot be undone. All your progress and certificates will be lost.</p>
        {!deleteConfirm ? (
          <button onClick={() => setDeleteConfirm(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all hover:bg-red-50"
            style={{ borderColor: "#bb0000", color: "#bb0000" }}>
            Delete Account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold" style={{ color: "#991b1b" }}>Are you sure? This cannot be undone.</p>
            <button className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: "#bb0000" }}>
              Yes, Delete
            </button>
            <button onClick={() => setDeleteConfirm(false)} className="px-4 py-2 rounded-xl text-xs font-bold border" style={{ borderColor: "#e5e7eb", color: "#6b7280" }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
