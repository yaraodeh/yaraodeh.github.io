import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Project from "@/pages/Project";
import CV from "@/pages/CV";
import Volunteering from "@/pages/Volunteering";
import Admin from "@/pages/Admin";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:dir" element={<Project />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/volunteering" element={<Volunteering />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}
