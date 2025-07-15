const API_BASE_URL = "/api";

document.addEventListener("DOMContentLoaded", () => {
  const fontUpload = document.getElementById("fontUpload");
  const fontTable = document.querySelector("#fontTable tbody");
  const groupTable = document.querySelector("#groupTable tbody");
  const groupTitle = document.getElementById("groupTitle");
  const fontGroupRows = document.getElementById("fontGroupRows");
  const addRowBtn = document.getElementById("addRow");
  const createGroupBtn = document.getElementById("createGroup");
  const groupError = document.getElementById("groupError");
  const dropZone = document.createElement("div");
  dropZone.className = "border-dashed border-2 p-4 mb-4 text-center";
  dropZone.innerHTML = "Drag and drop .ttf files here or click to upload";
  fontUpload.parentNode.insertBefore(dropZone, fontUpload);
  dropZone.appendChild(fontUpload);

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("bg-gray-200");
  });
  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("bg-gray-200");
  });
  dropZone.addEventListener("drop", async (e) => {
    e.preventDefault();
    dropZone.classList.remove("bg-gray-200");
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".ttf")) {
      await uploadFont(file);
    } else {
      alert("Please drop a .ttf file.");
    }
  });

  fontUpload.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadFont(file);
    }
  });

  async function uploadFont(file) {
    const formData = new FormData();
    formData.append("font", file);
    try {
      const res = await fetch(`${API_BASE_URL}/fonts`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchFonts();
        updateFontSelects();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error uploading font.");
    }
  }

  addRowBtn.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "flex mb-2";
    row.innerHTML = `
            <select class="fontSelect border p-2 mr-2 flex-1">
                <option value="">Select a Font</option>
            </select>
        `;
    fontGroupRows.appendChild(row);
    updateFontSelects();
  });

  createGroupBtn.addEventListener("click", async () => {
    const fontIds = Array.from(document.querySelectorAll(".fontSelect"))
      .map((select) => select.value)
      .filter((id) => id);
    if (fontIds.length < 1) {
      groupError.textContent = "You must select at least two fonts.";
      return;
    }
    groupError.textContent = "";
    try {
      const res = await fetch(`${API_BASE_URL}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: groupTitle.value, fontIds }),
      });
      const data = await res.json();
      if (data.success) {
        fetchGroups();
        groupTitle.value = "";
        fontGroupRows.innerHTML = `
                    <div class="flex mb-2">
                        <select class="fontSelect border p-2 mr-2 flex-1">
                            <option value="">Select a Font</option>
                        </select>
                    </div>
                `;
        updateFontSelects();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error creating group.");
    }
  });

  async function fetchFonts() {
    try {
      const res = await fetch(`${API_BASE_URL}/fonts`);
      const data = await res.json();
      if (data.success) {
        fontTable.innerHTML = "";
        data.data.forEach((font) => {
          const fontFace = new FontFace(
            font.name,
            `url(/fonts/${font.file_path.split("/").pop()})`
          );
          fontFace.load().then(() => document.fonts.add(fontFace));
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td class="p-2">${font.name}</td>
                        <td class="p-2 font-preview" style="font-family: '${font.name}'">Example Style</td>
                        <td class="p-2">
                            <button class="deleteFont bg-red-500 text-white p-1 rounded" data-id="${font.id}">Delete</button>
                        </td>
                    `;
          fontTable.appendChild(row);
        });
        document.querySelectorAll(".deleteFont").forEach((btn) => {
          btn.addEventListener("click", async () => {
            try {
              const res = await fetch(
                `${API_BASE_URL}/fonts/${btn.dataset.id}`,
                {
                  method: "DELETE",
                }
              );
              const data = await res.json();
              if (data.success) {
                fetchFonts();
                updateFontSelects();
              } else {
                alert(data.error);
              }
            } catch (err) {
              alert("Error deleting font.");
            }
          });
        });
        updateFontSelects();
      }
    } catch (err) {
      alert("Error fetching fonts.");
    }
  }

  async function fetchGroups() {
    try {
      const res = await fetch(`${API_BASE_URL}/groups`);
      const data = await res.json();
      if (data.success) {
        groupTable.innerHTML = "";
        data.data.forEach((group) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td class="p-2">${group.title}</td>
                        <td class="p-2">${group.font_ids.join(", ")}</td>
                        <td class="p-2">
                            <button class="editGroup bg-yellow-500 text-white p-1 rounded mr-2" data-id="${
                              group.id
                            }" data-title="${
            group.title
          }" data-fontids="${group.font_ids.join(",")}">Edit</button>
                            <button class="deleteGroup bg-red-500 text-white p-1 rounded" data-id="${
                              group.id
                            }">Delete</button>
                        </td>
                    `;
          groupTable.appendChild(row);
        });
        document.querySelectorAll(".editGroup").forEach((btn) => {
          btn.addEventListener("click", () => {
            groupTitle.value = btn.dataset.title;
            fontGroupRows.innerHTML = "";
            btn.dataset.fontids.split(",").forEach((id) => {
              const row = document.createElement("div");
              row.className = "flex mb-2";
              row.innerHTML = `
                                <select class="fontSelect border p-2 mr-2 flex-1">
                                    <option value="">Select a Font</option>
                                </select>
                            `;
              fontGroupRows.appendChild(row);
            });
            updateFontSelects().then(() => {
              document
                .querySelectorAll(".fontSelect")
                .forEach((select, index) => {
                  select.value = btn.dataset.fontids.split(",")[index] || "";
                });
            });
            createGroupBtn.textContent = "Update";
            createGroupBtn.dataset.id = btn.dataset.id;
            createGroupBtn.onclick = async () => {
              const fontIds = Array.from(
                document.querySelectorAll(".fontSelect")
              )
                .map((select) => select.value)
                .filter((id) => id);
              if (fontIds.length < 1) {
                groupError.textContent = "You must select at least two fonts.";
                return;
              }
              try {
                const res = await fetch(
                  `${API_BASE_URL}/groups/${createGroupBtn.dataset.id}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: groupTitle.value, fontIds }),
                  }
                );
                const data = await res.json();
                if (data.success) {
                  fetchGroups();
                  groupTitle.value = "";
                  fontGroupRows.innerHTML = `
                                        <div class="flex mb-2">
                                            <select class="fontSelect border p-2 mr-2 flex-1">
                                                <option value="">Select a Font</option>
                                            </select>
                                        </div>
                                    `;
                  updateFontSelects();
                  createGroupBtn.textContent = "Create";
                  delete createGroupBtn.dataset.id;
                  createGroupBtn.onclick = createGroupBtn.originalClick;
                } else {
                  alert(data.error);
                }
              } catch (err) {
                alert("Error updating group.");
              }
            };
          });
        });
        document.querySelectorAll(".deleteGroup").forEach((btn) => {
          btn.addEventListener("click", async () => {
            try {
              const res = await fetch(
                `${API_BASE_URL}/groups/${btn.dataset.id}`,
                {
                  method: "DELETE",
                }
              );
              const data = await res.json();
              if (data.success) {
                fetchGroups();
              } else {
                alert(data.error);
              }
            } catch (err) {
              alert("Error deleting group.");
            }
          });
        });
      }
    } catch (err) {
      alert("Error fetching groups.");
    }
  }

  async function updateFontSelects() {
    try {
      const res = await fetch(`${API_BASE_URL}/fonts`);
      const data = await res.json();
      if (data.success) {
        const selects = document.querySelectorAll(".fontSelect");
        selects.forEach((select) => {
          const currentValue = select.value;
          select.innerHTML = '<option value="">Select a Font</option>';
          data.data.forEach((font) => {
            const option = document.createElement("option");
            option.value = font.id;
            option.textContent = font.name;
            select.appendChild(option);
          });
          select.value = currentValue;
        });
      }
    } catch (err) {
      alert("Error updating font selects.");
    }
  }

  createGroupBtn.originalClick = createGroupBtn.onclick;

  fetchFonts();
  fetchGroups();
});
