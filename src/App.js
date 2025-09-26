import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetail from "./pages/PropertyDetail";
import Contracts from "./pages/Contracts";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import PaymentHistory from "./pages/PaymentHistory";

function App() {
    return (
        <Router>
            <Header />
            <main className="min-h-screen">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/property/:id" element={<PropertyDetail />} />

                    <Route
                        path="/contracts"
                        element={
                            <PrivateRoute>
                                <Contracts />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute role="admin">
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/payments"
                        element={
                            <PrivateRoute>
                                <PaymentHistory />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
