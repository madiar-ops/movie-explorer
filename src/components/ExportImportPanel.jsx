import React, { useRef, useState } from "react";
import { downloadJson, readJsonFromFile } from "../utils/jsonFile";
import s from "./ExportImportPanel.module.css";

const SCHEMA_VERSION = 1;

export default function ExportImportPanel({ getFavorites, getAllNotes, applyBackup }) {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState("");

  function handleExport() {
    try {
      const favorites = getFavorites();        
      const notes = getAllNotes?.() || {};    
      const payload = {
        version: SCHEMA_VERSION,
        favorites,
        notes,
        exportedAt: new Date().toISOString(),
        app: "movie-explorer",
      };
      downloadJson(payload);
      setMsg("Exported successfully.");
    } catch (e) {
      setMsg(e.message || "Export failed.");
    }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    try {
      const data = await readJsonFromFile(file);
      validate(data);
      await applyBackup(data);                
      setMsg("Imported successfully.");
    } catch (err) {
      setMsg(err.message || "Import failed.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function validate(data) {
    if (!data || typeof data !== "object") throw new Error("Invalid file");
    if (data.version !== SCHEMA_VERSION) throw new Error("Unsupported version");
    if (!Array.isArray(data.favorites)) throw new Error("'favorites' must be an array");
    if (data.notes && typeof data.notes !== "object") throw new Error("'notes' must be an object");
    for (const it of data.favorites) {
      if (!it || typeof it !== "object" || typeof it.id !== "number") {
        throw new Error("Favorite item must be an object with numeric 'id'");
      }
    }
  }

  return (
    <div className={s.panel}>
      <button className={s.btn} type="button" onClick={handleExport}>Export JSON</button>

      <label className={s.btn}>
        Import JSON
        <input
          ref={fileRef}
          className={s.file}
          type="file"
          accept="application/json"
          onChange={handleImport}
        />
      </label>

      {msg && <p className={s.msg} role="status">{msg}</p>}
    </div>
  );
}
