"use client";

import { useEffect, useState } from "react";

interface Setting {
  id: number;
  section: string;
  key: string;
  value: unknown;
}

const defaultSettings = [
  { section: "general", key: "site_title", label: "Site Title", type: "text", defaultValue: "Gensar" },
  { section: "general", key: "site_tagline", label: "Tagline", type: "text", defaultValue: "Inventing Better Future" },
  { section: "contact", key: "email", label: "Contact Email", type: "text", defaultValue: "" },
  { section: "contact", key: "phone", label: "Phone", type: "text", defaultValue: "" },
  { section: "contact", key: "address", label: "Address", type: "text", defaultValue: "" },
  { section: "social", key: "linkedin", label: "LinkedIn URL", type: "text", defaultValue: "", icon: "fab fa-linkedin", iconColor: "#0a66c2" },
  { section: "social", key: "instagram", label: "Instagram URL", type: "text", defaultValue: "", icon: "fab fa-instagram", iconColor: "#e4405f" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => {
        setFetchError("Failed to load settings. Make sure the database is connected.");
        setLoading(false);
      });
  }, []);

  function getValue(section: string, key: string): string {
    const s = settings.find((s) => s.section === section && s.key === key);
    if (s?.value) return String(s.value);
    const def = defaultSettings.find((d) => d.section === section && d.key === key);
    return def?.defaultValue || "";
  }

  async function handleSave(section: string, key: string, value: string) {
    setSaving(`${section}.${key}`);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, key, value }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSettings((prev) => {
          const idx = prev.findIndex((s) => s.section === section && s.key === key);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = updated;
            return next;
          }
          return [...prev, updated];
        });
        setMessage("Saved");
      }
    } catch {
      setMessage("Failed to save");
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return <div className="p-8 text-slate-400">Loading...</div>;
  }

  const sections = Array.from(new Set(defaultSettings.map((d) => d.section)));

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage site-wide configuration.</p>
      </div>

      {fetchError && (
        <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-lg text-sm">{fetchError}</div>
      )}
      {message && (
        <div className="mb-6 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">{message}</div>
      )}

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section} className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 capitalize mb-4">{section}</h2>
            <div className="space-y-4">
              {defaultSettings
                .filter((d) => d.section === section)
                .map((field) => (
                  <SettingsField
                    key={field.key}
                    field={field}
                    value={getValue(field.section, field.key)}
                    saving={saving === `${field.section}.${field.key}`}
                    onSave={handleSave}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsField({
  field,
  value,
  saving,
  onSave,
}: {
  field: (typeof defaultSettings)[0];
  value: string;
  saving: boolean;
  onSave: (section: string, key: string, value: string) => void;
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {field.icon ? <i className={`${field.icon} me-1`} style={{color: field.iconColor}}></i> : null}
        {field.label}
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type={field.type}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          onClick={() => onSave(field.section, field.key, localValue)}
          disabled={saving}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition text-sm disabled:opacity-50"
        >
          {saving ? "..." : "Save"}
        </button>
      </div>
    </div>
  );
}
