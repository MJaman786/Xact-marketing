import { Route } from "react-router-dom";
import RoleGuard from "./RoleGuard";
import Dashboard from "../pages/Dashboard";

const SuperAdminRoutes = (
    <>
        <Route element={
            <RoleGuard
                allowedRoles={[
                    "SUPER_ADMIN"
                ]}
            />}>

            <Route
                path="/supper-admin/dashboard"
                element={<Dashboard />}
            />
        </Route>

    </>
);

export default SuperAdminRoutes;