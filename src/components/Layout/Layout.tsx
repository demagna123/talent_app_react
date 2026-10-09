import { Outlet } from "react-router"
import AuthProvider from "../../providers/AuthProvider"
import Navbar from "../Navbar/Navbar"

export default function Layout() {
    return (
        <AuthProvider>
            <Navbar />
            <Outlet />
        </AuthProvider>
    )
}