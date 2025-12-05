// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import materials from "../data/materials.json";
import { useTheme } from "../theme/ThemeContext";
import { useToast } from "../toast/ToastProvider";

function ProfilePage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast(); // 👈

  const [profile, setProfile] = useState({
    name: "",
    college: "",
    semester: "",
  });
  const [bookmarkedMaterials, setBookmarkedMaterials] = useState([]);
  const [totalViewed, setTotalViewed] = useState(0);
  const [saveMessage, setSaveMessage] = useState("");
  const [isEditing, setIsEditing] = useState(true); // 👈 form vs card view

  // load from localStorage on mount
  useEffect(() => {
    const rawProfile = localStorage.getItem("bca_profile");
    if (rawProfile) {
      try {
        const parsed = JSON.parse(rawProfile);
        const next = {
          name: parsed.name || "",
          college: parsed.college || "",
          semester: parsed.semester || "",
        };
        setProfile(next);

        // agar profile data hai to direct card view se start
        if (next.name || next.college || next.semester) {
          setIsEditing(false);
        }
      } catch {
        // ignore
      }
    }

    const rawViewed = localStorage.getItem("bca_viewed") || "[]";
    try {
      const viewedIds = JSON.parse(rawViewed);
      setTotalViewed(Array.isArray(viewedIds) ? viewedIds.length : 0);
    } catch {
      setTotalViewed(0);
    }

    const rawBookmarks = localStorage.getItem("bca_bookmarks") || "[]";
    try {
      const bookmarkIds = JSON.parse(rawBookmarks);
      if (Array.isArray(bookmarkIds)) {
        const items = materials.filter((m) => bookmarkIds.includes(m.id));
        setBookmarkedMaterials(items);
      } else {
        setBookmarkedMaterials([]);
      }
    } catch {
      setBookmarkedMaterials([]);
    }
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaveMessage("");
  };

  const handleSaveProfile = () => {
    localStorage.setItem("bca_profile", JSON.stringify(profile));
    setSaveMessage("Profile saved successfully ✅");
    setIsEditing(false); // 👈 save ke baad card view pe switch
    showToast("Profile saved successfully", "success");
    setTimeout(() => setSaveMessage(""), 2500);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setSaveMessage("");
  };

  const handleDeleteProfile = () => {
    const sure = window.confirm(
      "Are you sure you want to delete your profile data from this device?"
    );
    if (!sure) return;

    localStorage.removeItem("bca_profile");
    setProfile({ name: "", college: "", semester: "" });
    setIsEditing(true);
    setSaveMessage("Profile deleted. You can enter details again.");
    showToast("Profile deleted from this device", "success");
    setTimeout(() => setSaveMessage(""), 2500);
  };

  const openPDF = (id) => {
    navigate(`/pdf/${id}`);
  };

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen bg-slate-950 text-slate-100"
          : "min-h-screen bg-slate-100 text-slate-900"
      }
    >
      <Navbar />

      <motion.main
        className="max-w-6xl mx-auto px-4 py-8 space-y-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Top heading */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-400 hover:text-indigo-400 mb-2"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold mb-1">Your profile</h1>
          <p className="text-xs text-slate-400">
            Manage your basic info and see your study stats.
          </p>

          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500 text-emerald-300 w-fit"
            >
              {saveMessage}
            </motion.div>
          )}
        </div>

        {/* Profile + stats */}
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6">
          {/* LEFT SIDE: either form OR profile card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <h2 className="text-sm font-semibold mb-2">Basic info</h2>

            {isEditing ? (
              // 📝 EDIT MODE (form)
              <>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block mb-1 text-slate-400">Name</label>
                    <input
                      value={profile.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">College</label>
                    <input
                      value={profile.college}
                      onChange={(e) => handleChange("college", e.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Your college name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">
                      Semester
                    </label>
                    <input
                      value={profile.semester}
                      onChange={(e) => handleChange("semester", e.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Semester 1"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="mt-3 text-xs px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 transition"
                >
                  Save profile
                </button>
              </>
            ) : (
              // 🪪 VIEW MODE (professional card)
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/80 flex items-center justify-center text-sm font-semibold">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {profile.name || "No name set"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {profile.college || "College not set"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {profile.semester || "Semester not set"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 transition"
                  >
                    Edit profile
                  </button>
                  <button
                    onClick={handleDeleteProfile}
                    className="px-4 py-2 rounded-full border border-red-500 text-red-400 hover:bg-red-500/10 transition"
                  >
                    Delete profile
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  This profile is stored only on this device (localStorage).
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: stats */}
          <div className="space-y-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <h2 className="text-sm font-semibold mb-2">Study stats</h2>
              <p className="text-xs text-slate-400 mb-4">
                These stats are calculated on this device.
              </p>
              <div className="flex gap-3 text-xs">
                <div className="flex-1 rounded-2xl bg-slate-950/80 border border-slate-800 p-3">
                  <p className="text-slate-400 mb-1">Total notes viewed</p>
                  <p className="text-2xl font-semibold text-indigo-400">
                    {totalViewed}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmarks list */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold mb-2">Bookmarked PDFs</h2>
          <p className="text-xs text-slate-400 mb-3">
            Quick access to your saved study materials.
          </p>

          {bookmarkedMaterials.length === 0 ? (
            <p className="text-xs text-slate-500">
              You haven't bookmarked any PDFs yet.
            </p>
          ) : (
            <div className="space-y-2">
              {bookmarkedMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-medium">{mat.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {mat.subjectId} · {mat.categoryId}
                    </p>
                  </div>
                  <button
                    onClick={() => openPDF(mat.id)}
                    className="px-3 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-[11px] transition"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </motion.main>
    </div>
  );
}

export default ProfilePage;
