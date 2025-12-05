// src/components/CategoryCard.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function CategoryCard({ category }) {
  const navigate = useNavigate();
  const isPremiumUser = localStorage.getItem("bca_isPremium") === "true";

  const locked = category.isPremium && !isPremiumUser;

  const handleClick = () => {
    if (locked) {
      alert("Ye premium category hai. Premium account se login karke access karein.");
      return;
    }

    navigate(`/category/${category.id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="group cursor-pointer rounded-3xl bg-slate-900/70 border border-slate-800 px-4 py-3 flex items-center justify-between"
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div>
        <h3 className="text-base font-semibold group-hover:text-indigo-400">
          {category.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {category.description || "Category"}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        {category.isPremium && (
          <span
            className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
              locked
                ? "bg-slate-800 border border-amber-400 text-amber-300"
                : "bg-amber-400 text-slate-900"
            }`}
          >
            {locked ? "LOCKED" : "PREMIUM"}
          </span>
        )}
        {locked && (
          <span className="text-[10px] text-slate-500">
            Premium only
          </span>
        )}
        <span className="text-xs text-slate-500 group-hover:text-indigo-400">
          Open →
        </span>
      </div>
    </motion.div>
  );
}

export default CategoryCard;
