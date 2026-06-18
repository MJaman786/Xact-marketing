import { Route } from "react-router-dom";
import RoleGuard from "./RoleGuard";
import Dashboard from "../pages/Dashboard";

const AdminRoutes = (
    <>
        <>
            <Route element={
                <RoleGuard
                    allowedRoles={[
                        "ADMIN"
                    ]}
                />}>

                <Route
                    path="/admin/dashboard"
                    element={<Dashboard />}
                />
            </Route>

        </>
    </>
);

export default AdminRoutes;