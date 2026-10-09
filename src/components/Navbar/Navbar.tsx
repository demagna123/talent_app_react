import { NavLink, useNavigate } from "react-router"
import "./Navbar.css"
import logo from "../../assets/logo_sklvi.webp" // adapte au nom réel de ton fichier
import { useAuth } from "../../providers/AuthContext"
import Button from "../Button/Button"

const PUBLIC_LINKS = [{ to: "/programs", label: "Programmes" }]

const RECRUITER_LINKS = [
    { to: "/programs/new", label: "Nouveau programme" },
    { to: "/dashboard", label: "Classement" },
]

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const links = user ? [...PUBLIC_LINKS, ...RECRUITER_LINKS] : PUBLIC_LINKS

    const handleLogout = () => {
        logout()
        navigate("/programs")
    }

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <img src={logo} alt="SKULLVI" className="navbar-logo" />

                <nav className="navbar-links" aria-label="Navigation principale">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end
                            className={({ isActive }) => (isActive ? "navbar-link navbar-link-active" : "navbar-link")}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="navbar-user">
                    {user ? (
                        <>
                            <span className="navbar-name">{user.firstName}</span>
                            <Button variant="secondary" onClick={handleLogout}>
                                Déconnexion
                            </Button>
                        </>
                    ) : (
                        <NavLink to="/login" className="navbar-link">
                            Connexion
                        </NavLink>
                    )}
                </div>
            </div>
        </header>
    )
}