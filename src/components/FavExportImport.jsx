import React, { useRef, useState } from "react";
import { useFavorites } from "@/store/favorites";
import { downloadJson, readJsonFromFile } from "@/utils/jsonFile";
import "./FavExportImport.css";

const SCHEMA_VERSION = 1;

export default function FavExportImport() {
  const inputRef = useRef(null);
  const { ids, notes } = useFavorites((s) => ({ ids: s.ids, notes: s.notes }));
  const hydrate = useFavorites((s) => s.hydrate);
  const [message, setMessage] = useState("");

  function handleExport() {
    const payload = {
      version: SCHEMA_VERSION,
      favorites: Array.from(ids),
      notes,
      exportedAt: new Date().toISOString(),
      app: "movie-explorer",
    };
    downloadJson(payload);
    setMessage("Exported successfully.");
  }

  async function handleImportFile(e) {
    const file = e.target.files && e.target.files[0];
    try {
      const data = await readJsonFromFile(file);
      validatePayload(data);
      hydrate(data.favorites, data.notes || {});
      setMessage("Imported successfully.");
    } catch (err) {
      setMessage(err.message || "Import failed.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function validatePayload(data) {
    if (!data || typeof data !== "object") throw new Error("Invalid file format.");
    if (data.version !== SCHEMA_VERSION) throw new Error("Unsupported version.");
    if (!Array.isArray(data.favorites)) throw new Error("Field 'favorites' must be an array.");
    if (data.notes && typeof data.notes !== "object") throw new Error("Field 'notes' must be an object.");
    if (data.favorites.some((x) => typeof x !== "number")) {
      throw new Error("Favorites must be an array of numbers (movie ids).");
    }
    if (data.notes && Object.keys(data.notes).some((k) => isNaN(Number(k)))) {
      throw new Error("Notes keys must be numeric movie ids.");
    }
  }

  return (
    <section className="fav-transfer">
      <h2 className="fav-transfer__title">Favorites & Notes — Export / Import</h2>

      <div className="fav-transfer__actions">
        <button className="btn btn-primary" type="button" onClick={handleExport}>
          Export JSON
        </button>

        <label className="btn btn-secondary">
          Import JSON
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            className="visually-hidden"
          />
        </label>
      </div>

      {message ? <p className="fav-transfer__msg" role="status">{message}</p> : null}

      <div className="fav-transfer__hint">
        <p>Формат файла:</p>
        <pre className="fav-transfer__code" aria-label="expected-json-schema">
{`{
  "version": 1,
  "favorites": [123, 456],
  "notes": { "123": "заметка", "456": "" },
  "exportedAt": "ISO",
  "app": "movie-explorer"
}`}
        </pre>
      </div>
    </section>
  );
}
