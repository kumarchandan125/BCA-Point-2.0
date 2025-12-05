// src/admin/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../theme/ThemeContext";

import baseMaterials from "../data/materials.json";
import baseSubjects from "../data/subjects.json";
import baseSemesters from "../data/semesters.json";
import baseCategories from "../data/categories.json";

const MAT_KEY = "bca_admin_materials";
const CAT_KEY = "bca_admin_categories";
const SEM_KEY = "bca_admin_semesters";
const SUB_KEY = "bca_admin_subjects";

function AdminDashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  // 🔹 Local admin data
  const [adminCategories, setAdminCategories] = useState([]);
  const [adminSemesters, setAdminSemesters] = useState([]);
  const [adminSubjects, setAdminSubjects] = useState([]);
  const [customMaterials, setCustomMaterials] = useState([]);

  // 🔹 Forms: category
  const [catTitle, setCatTitle] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catPremium, setCatPremium] = useState(false);

  // 🔹 Forms: semester
  const [semName, setSemName] = useState("");
  const [semCategoryId, setSemCategoryId] = useState("notes");

  // 🔹 Forms: subject
  const [subName, setSubName] = useState("");
  const [subSemesterId, setSubSemesterId] = useState("sem1");

  // 🔹 Forms: material
  const [title, setTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [file, setFile] = useState(null);
  const [categoryId, setCategoryId] = useState("notes");
  const [semesterId, setSemesterId] = useState("sem1");
  const [subjectId, setSubjectId] = useState("c-programming");
  const [year, setYear] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const [error, setError] = useState("");

  // 🔹 Load from localStorage on mount
  useEffect(() => {
    try {
      const rawCat = localStorage.getItem(CAT_KEY) || "[]";
      const rawSem = localStorage.getItem(SEM_KEY) || "[]";
      const rawSub = localStorage.getItem(SUB_KEY) || "[]";
      const rawMat = localStorage.getItem(MAT_KEY) || "[]";

      const parsedCat = JSON.parse(rawCat);
      const parsedSem = JSON.parse(rawSem);
      const parsedSub = JSON.parse(rawSub);
      const parsedMat = JSON.parse(rawMat);

      setAdminCategories(Array.isArray(parsedCat) ? parsedCat : []);
      setAdminSemesters(Array.isArray(parsedSem) ? parsedSem : []);
      setAdminSubjects(Array.isArray(parsedSub) ? parsedSub : []);
      setCustomMaterials(Array.isArray(parsedMat) ? parsedMat : []);
    } catch {
      setAdminCategories([]);
      setAdminSemesters([]);
      setAdminSubjects([]);
      setCustomMaterials([]);
    }
  }, []);

  // 🔹 Save to localStorage whenever admin data changes
  useEffect(() => {
    localStorage.setItem(CAT_KEY, JSON.stringify(adminCategories));
  }, [adminCategories]);

  useEffect(() => {
    localStorage.setItem(SEM_KEY, JSON.stringify(adminSemesters));
  }, [adminSemesters]);

  useEffect(() => {
    localStorage.setItem(SUB_KEY, JSON.stringify(adminSubjects));
  }, [adminSubjects]);

  useEffect(() => {
    localStorage.setItem(MAT_KEY, JSON.stringify(customMaterials));
  }, [customMaterials]);

  // 🔹 Merge base + admin for dropdowns
  const allCategories = useMemo(
    () => [...baseCategories, ...adminCategories],
    [adminCategories]
  );

  const allSemesters = useMemo(
    () => [...baseSemesters, ...adminSemesters],
    [adminSemesters]
  );

  const allSubjects = useMemo(
    () => [...baseSubjects, ...adminSubjects],
    [adminSubjects]
  );

  // 🔹 Stats
  const allMaterialsCount = baseMaterials.length + customMaterials.length;
  const totalCategories = baseCategories.length + adminCategories.length;
  const totalSemesters = baseSemesters.length + adminSemesters.length;
  const totalSubjects = baseSubjects.length + adminSubjects.length;

  const handleLogout = () => {
    localStorage.removeItem("bca_admin_auth");
    navigate("/admin/login", { replace: true });
  };

  // ----------------- Category handlers -----------------
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!catTitle.trim()) return;

    const newCat = {
      id: "admin_cat_" + Date.now().toString(),
      title: catTitle.trim(),
      description: catDesc.trim() || "Admin added category",
      isPremium: catPremium,
      isCustom: true,
    };

    setAdminCategories((prev) => [...prev, newCat]);
    setCatTitle("");
    setCatDesc("");
    setCatPremium(false);
  };

  const handleDeleteCategory = (id) => {
    const ok = window.confirm("Delete this category? (Will not remove base data)");
    if (!ok) return;
    setAdminCategories((prev) => prev.filter((c) => c.id !== id));

    // Remove attached admin semesters/subjects/materials (simple cleanup)
    setAdminSemesters((prev) => prev.filter((s) => s.categoryId !== id));
    setAdminSubjects((prev) => prev.filter((s) => s.categoryId !== id));
    setCustomMaterials((prev) => prev.filter((m) => m.categoryId !== id));
  };

  // ----------------- Semester handlers -----------------
  const handleAddSemester = (e) => {
    e.preventDefault();
    if (!semName.trim()) return;

    const newSem = {
      id: "admin_sem_" + Date.now().toString(),
      name: semName.trim(),
      categoryId: semCategoryId || null, // link to category
      isCustom: true,
    };

    setAdminSemesters((prev) => [...prev, newSem]);
    setSemName("");
  };

  const handleDeleteSemester = (id) => {
    const ok = window.confirm("Delete this semester and related subjects/materials?");
    if (!ok) return;
    setAdminSemesters((prev) => prev.filter((s) => s.id !== id));
    setAdminSubjects((prev) => prev.filter((s) => s.semesterId !== id));
    setCustomMaterials((prev) => prev.filter((m) => m.semesterId !== id));
  };

  // ----------------- Subject handlers -----------------
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!subName.trim()) return;

    const newSub = {
      id: "admin_sub_" + Date.now().toString(),
      name: subName.trim(),
      semesterId: subSemesterId,
      isCustom: true,
    };

    setAdminSubjects((prev) => [...prev, newSub]);
    setSubName("");
  };

  const handleDeleteSubject = (id) => {
    const ok = window.confirm("Delete this subject and related materials?");
    if (!ok) return;
    setAdminSubjects((prev) => prev.filter((s) => s.id !== id));
    setCustomMaterials((prev) => prev.filter((m) => m.subjectId !== id));
  };

  // ----------------- Material handlers -----------------
  const resetMaterialForm = () => {
    setTitle("");
    setPdfUrl("");
    setFile(null);
    setYear("");
    setIsPremium(false);
    setError("");
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!pdfUrl && !file) {
      setError("Please select a PDF file or provide PDF URL");
      return;
    }

    // If file selected → read as dataURL for local use
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;

        const newMat = {
          id: "admin_mat_" + Date.now().toString(),
          title: title.trim(),
          pdfUrl: dataUrl, // data URL stored
          fileName: file.name,
          categoryId,
          semesterId,
          subjectId,
          year: year || "",
          isPremium,
          createdAt: Date.now(),
          isCustom: true,
        };

        setCustomMaterials((prev) => [...prev, newMat]);
        resetMaterialForm();
      };
      reader.readAsDataURL(file);
    } else {
      // only URL
      const newMat = {
        id: "admin_mat_" + Date.now().toString(),
        title: title.trim(),
        pdfUrl: pdfUrl.trim(),
        fileName: null,
        categoryId,
        semesterId,
        subjectId,
        year: year || "",
        isPremium,
        createdAt: Date.now(),
        isCustom: true,
      };
      setCustomMaterials((prev) => [...prev, newMat]);
      resetMaterialForm();
    }
  };

  const handleDeleteMaterial = (id) => {
    const ok = window.confirm("Delete this admin material?");
    if (!ok) return;
    setCustomMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const enrichedCustom = useMemo(() => {
    return customMaterials.map((m) => {
      const cat =
        allCategories.find((c) => c.id === m.categoryId) || null;
      const sem =
        allSemesters.find((s) => s.id === m.semesterId) || null;
      const sub =
        allSubjects.find((s) => s.id === m.subjectId) || null;

      return {
        ...m,
        categoryName: cat?.title || m.categoryId,
        semesterName: sem?.name || m.semesterId,
        subjectName: sub?.name || m.subjectId,
      };
    });
  }, [customMaterials, allCategories, allSemesters, allSubjects]);

  const containerClass = isDark
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-100 text-slate-900";

  const cardClass =
    "rounded-3xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-indigo-500/10";

  const inputBase =
    "w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  return (
    <div className={containerClass}>
      {/* Top admin bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="h-8 w-8 rounded-2xl bg-indigo-500 flex items-center justify-center text-lg font-bold">
              A
            </span>
            <div>
              <h1 className="text-sm font-semibold tracking-tight">
                BCA Study Hub · Admin
              </h1>
              <p className="text-[11px] text-slate-400">
                Manage categories, semesters, subjects & materials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="text-[11px] px-3 py-1.5 rounded-full border border-slate-700 hover:border-indigo-500 hover:text-indigo-400 transition"
            >
              Student view
            </button>
            <button
              onClick={handleLogout}
              className="text-[11px] px-3 py-1.5 rounded-full border border-red-500 text-red-400 hover:bg-red-500/10 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats row */}
        <section className="grid sm:grid-cols-4 gap-3 text-xs">
          <div className={cardClass + " p-4"}>
            <p className="text-slate-400 mb-1">Categories (base + admin)</p>
            <p className="text-2xl font-semibold text-indigo-400">
              {totalCategories}
            </p>
          </div>
          <div className={cardClass + " p-4"}>
            <p className="text-slate-400 mb-1">Semesters (base + admin)</p>
            <p className="text-2xl font-semibold text-emerald-400">
              {totalSemesters}
            </p>
          </div>
          <div className={cardClass + " p-4"}>
            <p className="text-slate-400 mb-1">Subjects (base + admin)</p>
            <p className="text-2xl font-semibold text-sky-400">
              {totalSubjects}
            </p>
          </div>
          <div className={cardClass + " p-4"}>
            <p className="text-slate-400 mb-1">Materials (base + admin)</p>
            <p className="text-2xl font-semibold text-fuchsia-400">
              {allMaterialsCount}
            </p>
          </div>
        </section>

        {/* Hierarchy management: Category / Semester / Subject */}
        <section className="grid lg:grid-cols-3 gap-4">
          {/* Category card */}
          <motion.div
            className={cardClass + " p-4 space-y-3 text-xs"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-sm font-semibold mb-1">Categories</h2>
            <p className="text-[11px] text-slate-400 mb-2">
              Create new top-level categories like Notes, PYQ, Assignments.
            </p>

            <form onSubmit={handleAddCategory} className="space-y-2">
              <div>
                <label className="block mb-1 text-slate-400">
                  Category name
                </label>
                <input
                  value={catTitle}
                  onChange={(e) => setCatTitle(e.target.value)}
                  className={inputBase}
                  placeholder="e.g. Assignments"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-400">
                  Description (optional)
                </label>
                <input
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className={inputBase}
                  placeholder="Short description"
                />
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <input
                  id="catPremium"
                  type="checkbox"
                  checked={catPremium}
                  onChange={(e) => setCatPremium(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-900 text-indigo-500"
                />
                <label htmlFor="catPremium" className="text-slate-300">
                  Mark this category as premium
                </label>
              </div>
              <button
                type="submit"
                className="mt-1 inline-flex px-4 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-[11px] font-medium transition"
              >
                Add category
              </button>
            </form>

            <div className="max-h-40 overflow-y-auto space-y-1 pt-1">
              {adminCategories.length === 0 ? (
                <p className="text-[11px] text-slate-500">
                  No admin categories yet.
                </p>
              ) : (
                adminCategories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-950/80 border border-slate-800 px-3 py-1.5"
                  >
                    <div>
                      <p className="text-xs font-semibold">{c.title}</p>
                      <p className="text-[10px] text-slate-500">
                        {c.description || "Admin category"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="text-[10px] px-2 py-1 rounded-full border border-red-500 text-red-400 hover:bg-red-500/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Semester card */}
          <motion.div
            className={cardClass + " p-4 space-y-3 text-xs"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-sm font-semibold mb-1">Semesters</h2>
            <p className="text-[11px] text-slate-400 mb-2">
              Link semesters under a category (for admin structure).
            </p>

            <form onSubmit={handleAddSemester} className="space-y-2">
              <div>
                <label className="block mb-1 text-slate-400">
                  Parent category
                </label>
                <select
                  value={semCategoryId}
                  onChange={(e) => setSemCategoryId(e.target.value)}
                  className={inputBase}
                >
                  {allCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-slate-400">
                  Semester name
                </label>
                <input
                  value={semName}
                  onChange={(e) => setSemName(e.target.value)}
                  className={inputBase}
                  placeholder="e.g. Semester 1 (Even)"
                />
              </div>
              <button
                type="submit"
                className="mt-1 inline-flex px-4 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-[11px] font-medium transition"
              >
                Add semester
              </button>
            </form>

            <div className="max-h-40 overflow-y-auto space-y-1 pt-1">
              {adminSemesters.length === 0 ? (
                <p className="text-[11px] text-slate-500">
                  No admin semesters yet.
                </p>
              ) : (
                adminSemesters.map((s) => {
                  const cat =
                    allCategories.find((c) => c.id === s.categoryId) || null;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-950/80 border border-slate-800 px-3 py-1.5"
                    >
                      <div>
                        <p className="text-xs font-semibold">{s.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {cat ? cat.title : s.categoryId}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSemester(s.id)}
                        className="text-[10px] px-2 py-1 rounded-full border border-red-500 text-red-400 hover:bg-red-500/10 transition"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Subject card */}
          <motion.div
            className={cardClass + " p-4 space-y-3 text-xs"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-sm font-semibold mb-1">Subjects</h2>
            <p className="text-[11px] text-slate-400 mb-2">
              Attach subjects under any semester.
            </p>

            <form onSubmit={handleAddSubject} className="space-y-2">
              <div>
                <label className="block mb-1 text-slate-400">
                  Semester
                </label>
                <select
                  value={subSemesterId}
                  onChange={(e) => setSubSemesterId(e.target.value)}
                  className={inputBase}
                >
                  {allSemesters.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-slate-400">
                  Subject name
                </label>
                <input
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className={inputBase}
                  placeholder="e.g. Data Structures"
                />
              </div>
              <button
                type="submit"
                className="mt-1 inline-flex px-4 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-[11px] font-medium transition"
              >
                Add subject
              </button>
            </form>

            <div className="max-h-40 overflow-y-auto space-y-1 pt-1">
              {adminSubjects.length === 0 ? (
                <p className="text-[11px] text-slate-500">
                  No admin subjects yet.
                </p>
              ) : (
                adminSubjects.map((s) => {
                  const sem =
                    allSemesters.find((x) => x.id === s.semesterId) || null;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-950/80 border border-slate-800 px-3 py-1.5"
                    >
                      <div>
                        <p className="text-xs font-semibold">{s.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {sem ? sem.name : s.semesterId}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSubject(s.id)}
                        className="text-[10px] px-2 py-1 rounded-full border border-red-500 text-red-400 hover:bg-red-500/10 transition"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </section>

        {/* Material form + list */}
        <section className="grid lg:grid-cols-[1.05fr_1.1fr] gap-6 items-start">
          {/* Add material form */}
          <motion.div
            className={cardClass + " p-5 space-y-4 text-xs"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-sm font-semibold">Add new material</h2>
            <p className="text-[11px] text-slate-400">
              You can either upload a PDF from this PC or paste a PDF URL.
            </p>

            <form onSubmit={handleAddMaterial} className="space-y-3">
              <div>
                <label className="block mb-1 text-slate-400">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputBase}
                  placeholder="e.g. DBMS Unit 1 Notes (Updated)"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-400">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={inputBase}
                  >
                    {allCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-400">
                    Semester
                  </label>
                  <select
                    value={semesterId}
                    onChange={(e) => setSemesterId(e.target.value)}
                    className={inputBase}
                  >
                    {allSemesters.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-400">
                    Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className={inputBase}
                  >
                    {allSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-400">
                    Year / Tag (optional)
                  </label>
                  <input
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={inputBase}
                    placeholder="e.g. 2023, Updated, Midterm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-400">
                    Upload PDF (from PC)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="block w-full text-[11px] text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-[11px] file:text-slate-100 hover:file:bg-slate-700"
                  />
                  {file && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-slate-400">
                    OR PDF URL
                  </label>
                  <input
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className={inputBase}
                    placeholder="https://.../file.pdf"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <input
                  id="matPremium"
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-900 text-indigo-500"
                />
                <label htmlFor="matPremium" className="text-slate-300">
                  Mark as premium material
                </label>
              </div>

              {error && (
                <p className="text-[11px] text-red-400 bg-red-950/30 border border-red-900/60 rounded-2xl px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-[11px] font-medium transition"
              >
                Add material
              </button>
            </form>
          </motion.div>

          {/* Admin materials list */}
          <motion.div
            className={cardClass + " p-5 space-y-3 text-xs"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Admin materials</h2>
              <span className="text-[11px] text-slate-400">
                {customMaterials.length} item(s)
              </span>
            </div>

            {enrichedCustom.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                No admin materials yet. Add something from the left form.
              </p>
            ) : (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {enrichedCustom.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl bg-slate-950/80 border border-slate-800 px-3 py-2 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold mb-1">{m.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {m.subjectName} · {m.semesterName} · {m.categoryName}
                        {m.year ? ` · ${m.year}` : ""}
                      </p>
                      {m.fileName && (
                        <p className="text-[10px] text-slate-500 mt-1">
                          File: {m.fileName}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {m.isPremium && (
                        <span className="px-2 py-1 rounded-full bg-amber-400 text-slate-900 text-[10px] font-semibold">
                          PREMIUM
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteMaterial(m.id)}
                        className="text-[10px] px-2 py-1 rounded-full border border-red-500 text-red-400 hover:bg-red-500/10 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
