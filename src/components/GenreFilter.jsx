import { useMemo, useRef, useEffect, useState } from "react";

export default function GenreFilter({
  genres = [],
  selected = "",
  onChange,
  defaultOpen = false,          
}) {
  const list = useMemo(
    () => [{ id: "", name: "All" }, ...genres.filter(Boolean)],
    [genres]
  );

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const scrollerRef = useRef(null);
  const toggleBtnRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (selected !== "" && !isOpen) setIsOpen(true);
  }, [selected]); 

  return (
    <div>
    <div className="genre-toggle-container">
  <button
    className="genre-toggle"
    type="button"
    aria-expanded={isOpen}
    aria-controls="genre-panel"
    onClick={() => setIsOpen((v) => !v)}
  >
    {isOpen ? "Hide genres" : "Browse genres"}
  </button>
</div>


      <div
        id="genre-panel"
        className={`genre-panel ${isOpen ? "is-open" : ""}`}
        role="region"
        aria-label="Genres"
      >
        <div className="genre-filter" role="tablist" aria-label="Genres list">
          <div className="genre-filter__scroller" ref={scrollerRef}>
            {list.map((g) => {
              const active = String(selected) === String(g.id);
              return (
                <button
                  key={g.id === "" ? "all" : g.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-pressed={active}
                  className={`genre-chip${active ? " genre-chip--active" : ""}`}
                  onClick={() => onChange(g.id === "" ? "" : String(g.id))}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
