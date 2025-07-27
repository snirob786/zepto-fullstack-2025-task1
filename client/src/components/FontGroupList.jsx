import { useEffect, useState } from "react";
import { getFontGroups, deleteFontGroup } from "../api";

export default function FontGroupList({ refresh }) {
  const [groups, setGroups] = useState([]);

  const loadGroups = () => {
    getFontGroups().then(setGroups);
  };

  useEffect(() => {
    loadGroups();
  }, [refresh]);

  const handleDelete = async (id) => {
    await deleteFontGroup(id);
    loadGroups();
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">Font Groups</h2>
      <ul className="space-y-4">
        {groups.map((group) => (
          <li key={group._id} className="border p-4 rounded">
            <h3 className="font-bold">{group.name}</h3>
            <ul className="ml-4 list-disc">
              {group.fontIds.map((font) => (
                <li key={font._id} style={{ fontFamily: font.name }}>
                  {font.name} (preview)
                </li>
              ))}
            </ul>
            <button
              className="bg-red-600 text-white px-3 py-1 mt-2 rounded"
              onClick={() => handleDelete(group._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
