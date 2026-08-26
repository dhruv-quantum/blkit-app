import { BrowserRouter, Routes, Route } from "react-router-dom";
import Library from "./pages/Library";
import KitHome from "./pages/KitHome";
import BookletView from "./pages/BookletView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/kit/:kitId" element={<KitHome />} />
        <Route path="/kit/:kitId/booklet/:bookletId" element={<BookletView />} />
      </Routes>
    </BrowserRouter>
  );
}
