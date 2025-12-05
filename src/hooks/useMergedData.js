// src/hooks/useMergedData.js
import categories from "../data/categories.json";
import semesters from "../data/semesters.json";
import subjects from "../data/subjects.json";
import materials from "../data/materials.json";

export function useMergedData() {
  // admin data from localStorage (agar na mile to empty array)
  let adminCategories = [];
  let adminSemesters = [];
  let adminSubjects = [];
  let adminMaterials = [];

  try {
    adminCategories =
      JSON.parse(localStorage.getItem("bca_admin_categories") || "[]") || [];
  } catch {
    adminCategories = [];
  }

  try {
    adminSemesters =
      JSON.parse(localStorage.getItem("bca_admin_semesters") || "[]") || [];
  } catch {
    adminSemesters = [];
  }

  try {
    adminSubjects =
      JSON.parse(localStorage.getItem("bca_admin_subjects") || "[]") || [];
  } catch {
    adminSubjects = [];
  }

  try {
    adminMaterials =
      JSON.parse(localStorage.getItem("bca_admin_materials") || "[]") || [];
  } catch {
    adminMaterials = [];
  }

  return {
    allCategories: [...categories, ...adminCategories],
    allSemesters: [...semesters, ...adminSemesters],
    allSubjects: [...subjects, ...adminSubjects],
    allMaterials: [...materials, ...adminMaterials],
  };
}
