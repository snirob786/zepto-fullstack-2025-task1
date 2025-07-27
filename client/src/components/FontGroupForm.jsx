import { useState } from "react";
import { createFontGroup } from "../api";

export default function FontGroupForm({ fonts, onCreated }) {
  const [fontIds, setFontIds] = useState([""]);
  const [name, setName] = useState("");

  const handleChange = (index, value) => {
    const updated = [...fontIds];
    updated[index] = value;
    setFontIds(updated);
  };

  const addRow = () => setFontIds([...fontIds, ""]);

  const handleSubmit = async () => {
    const selected = fontIds.filter(Boolean);
    if (selected.length < 2) return alert("Minimum 2 fonts required");
    await createFontGroup({ name: name || "Unnamed Group", fontIds: selected });
    setFontIds([""]);
    setName("");
    onCreated();
  };

  return (
    <div className="mt-6 p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Create Font Group</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Group Name"
        className="p-2 border rounded w-full mb-2"
      />
      {fontIds.map((id, i) => (
        <select
          key={i}
          className="block mb-2 p-2 border rounded w-full"
          value={id}
          onChange={(e) => handleChange(i, e.target.value)}
        >
          <option value="">Select Font</option>
          {fonts.map((font) => (
            <option value={font._id} key={font._id}>
              {font.name}
            </option>
          ))}
        </select>
      ))}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={addRow}
      >
        Add Row
      </button>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded ml-2"
        onClick={handleSubmit}
      >
        Create Group
      </button>
    </div>
  );
}
