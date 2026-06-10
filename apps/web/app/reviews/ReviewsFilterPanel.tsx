import { SlidersHorizontal } from "lucide-react";

const inputClass =
  "w-full border rounded-lg px-3 py-2 text-sm bg-white text-[var(--text)] border-[var(--border)]";
const labelClass = "block text-sm font-medium mb-1 text-[var(--text)]";

export function ReviewsFilterPanel() {
  return (
    <div
      className="sticky top-6 rounded-xl border bg-white p-5"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <SlidersHorizontal
          size={16}
          style={{ color: "var(--text-muted)" }}
        />
        <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
          Filtros
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Marca */}
        <div>
          <label className={labelClass}>Marca</label>
          <select disabled className={inputClass}>
            <option>Todas</option>
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className={labelClass}>Categoria</label>
          <select disabled className={inputClass}>
            <option>Todas</option>
          </select>
        </div>

        {/* Ano */}
        <div>
          <label className={labelClass}>Ano</label>
          <div className="flex gap-2">
            <input
              disabled
              type="text"
              placeholder="De"
              className={inputClass}
            />
            <input
              disabled
              type="text"
              placeholder="Até"
              className={inputClass}
            />
          </div>
        </div>

        {/* Nota mínima */}
        <div>
          <label className={labelClass}>Nota mínima</label>
          <select disabled className={inputClass}>
            <option>Qualquer</option>
          </select>
        </div>

        {/* Ordenar por */}
        <div>
          <label className={labelClass}>Ordenar por</label>
          <select disabled className={inputClass}>
            <option>Mais recentes</option>
          </select>
        </div>

        {/* Limpar filtros */}
        <button
          disabled
          className="w-full rounded-lg py-2 text-sm font-medium cursor-not-allowed"
          style={{
            background: "var(--surface-2)",
            color: "var(--text-muted)",
          }}
        >
          Limpar filtros
        </button>
      </div>
    </div>
  );
}
