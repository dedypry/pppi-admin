import { Route, Routes } from "react-router-dom";

import AdminLayout from "./components/layouts/admin";
import AuthLayout from "./components/layouts/auth";
import LoginPage from "./pages/auth/Login";
import Dashboard from "./pages/dashboard";
import MemberPage from "./pages/members";
import MemberCreate from "./pages/members/create";
import AgendaPage from "./pages/agenda";
import OrganizationPage from "./pages/organization";
import BlogPage from "./pages/blogs";
import BlogCreate from "./pages/blogs/create";
import BlogCategories from "./pages/blogs/categories";
import MemberDetail from "./pages/members/detail";

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />} path="/">
        <Route element={<Dashboard />} path="/" />

        <Route element={<MemberPage />} path="/member" />
        <Route element={<MemberCreate />} path="/member/create" />
        <Route element={<MemberDetail />} path="/member/:id" />
        <Route element={<MemberCreate />} path="/member/:id/edit" />

        <Route element={<AgendaPage />} path="/agenda" />
        <Route element={<OrganizationPage />} path="/organization" />
        <Route element={<BlogPage />} path="/blogs" />
        <Route element={<BlogCreate />} path="/blogs/create" />
        <Route element={<BlogCategories />} path="/blogs/category" />

        <Route path="/settings">
          <Route element={<BlogCategories />} path="department" />
          <Route element={<BlogCategories />} path="user-management" />
          <Route element={<BlogCategories />} path="roles" />
          <Route element={<BlogCategories />} path="apps" />
          <Route element={<BlogCategories />} path="banners" />
          <Route element={<BlogCategories />} path="regions" />
        </Route>
      </Route>

      <Route element={<AuthLayout />} path="/">
        <Route element={<LoginPage />} path="/login" />
      </Route>
    </Routes>
  );
}

export default App;
