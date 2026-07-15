import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Properties } from "./components/Properties";
import { Units } from "./components/Units";
import { Vacancies } from "./components/Vacancies";
import { Maintenance } from "./components/Maintenance";
import { Tenants } from "./components/Tenants";
import { Leads } from "./components/Leads";
import { Finance } from "./components/Finance";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "properties", Component: Properties },
      { path: "units", Component: Units },
      { path: "tenants", Component: Tenants },
      { path: "vacancies", Component: Vacancies },
      { path: "maintenance", Component: Maintenance },
      { path: "leads", Component: Leads },
      { path: "finance", Component: Finance },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);
