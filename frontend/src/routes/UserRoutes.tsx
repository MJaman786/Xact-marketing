import { Route } from "react-router-dom";
import RoleGuard from "./RoleGuard";
import Dashboard from "../pages/Dashboard";

const UserRoutes = (
    <>
        <Route element={
            <RoleGuard
                allowedRoles={[
                    "USER"
                ]}
            />}>

            <Route
                path="/user/dashboard"
                element={<Dashboard />}
            />
        </Route>

    </>
);

export default UserRoutes;