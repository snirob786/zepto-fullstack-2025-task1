import { useState } from "react";
import FontUploader from "./components/FontUploader";
import FontList from "./components/FontList";
import FontGroupForm from "./components/FontGroupForm";
import FontGroupList from "./components/FontGroupList";

function App() {
  const [fonts, setFonts] = useState([]);
  const [refreshGroups, setRefreshGroups] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Font Group System</h1>
      <FontUploader onUpload={() => window.location.reload()} />
      <FontList fonts={fonts} setFonts={setFonts} />
      <FontGroupForm
        fonts={fonts}
        onCreated={() => setRefreshGroups(!refreshGroups)}
      />
      <FontGroupList refresh={refreshGroups} />
    </div>
  );
}

export default App;
