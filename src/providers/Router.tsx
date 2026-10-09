import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Home from "../pages/home/Home";
import ApplicationForm from "../pages/applications/ApplicationForm/ApplicationForm";
import ProgramList from "../pages/programs/ProgramList/ProgramList";
import ProgramForm from "../pages/programs/ProgramForm/ProgramForm";
import ApplicationList from "../pages/applications/ApplicationList/ApplicationList";
import ApplicationDetail from "../pages/applications/ApplicationDetail/ApplicationDetail";
import Layout from "../components/Layout/Layout";
import Login from "../pages/Login/Login";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";


const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Navigate to="/programs" replace /> },
            { path: "/login", element: <Login /> },
            { path: "/programs", element: <ProgramList /> },
            { path: "/programs/:programId/apply", element: <ApplicationForm /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "/programs/new", element: <ProgramForm /> },
                    { path: "/dashboard", element: <ApplicationList /> },
                    { path: "/applications/:id", element: <ApplicationDetail /> },
                ],
            },
        ],
    },
])

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;