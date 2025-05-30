import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GalleryPage } from "./pages/GalleryPage";
import { PhotoDetailPage } from "./pages/PhotoDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/photos/:id" element={<PhotoDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
