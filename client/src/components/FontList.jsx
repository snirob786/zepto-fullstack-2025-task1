import { useEffect, useState } from "react";
import { getFonts } from "../api";

export default function FontList({ fonts, setFonts }) {
  useEffect(() => {
    getFonts().then(setFonts);
  }, []);

  useEffect(() => {
    fonts.forEach((font) => {
      const style = document.createElement("style");
      style.textContent = `
        @font-face {
          font-family: "${font.name}";
          src: url("http://localhost:5000${font.fileUrl}");
        }
      `;
      document.head.appendChild(style);
    });
  }, [fonts]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Uploaded Fonts</h2>
      <ul className="grid grid-cols-2 gap-3">
        {fonts.map((font) => (
          <li key={font._id} className="border p-3 rounded">
            <p>{font.name}</p>
            <p style={{ fontFamily: font.name }}>This is preview text</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
