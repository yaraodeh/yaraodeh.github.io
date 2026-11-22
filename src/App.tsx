import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Project from "@/pages/Project";
import CV from "@/pages/CV";
import Volunteering from "@/pages/Volunteering";
import Admin from "@/pages/Admin";
import Booking from "@/components/Booking/Booking";


export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:dir" element={<Project />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/volunteering" element={<Volunteering />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}
