import Navbar from "./components/Navbar";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/AuthProvider";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/" />;
};

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div>
      <AuthProvider>
        {!isOwnerPath && <Navbar />}
        <div className="min-h-[70vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<AllRooms />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </div>
  );
};

export default App;
