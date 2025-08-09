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
import MemberDetail from "./pages/members/detail";
import BlogCategoryPage from "./pages/blog-category";
import DepartmentPage from "./pages/department";
import BannerPage from "./pages/banners";

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />} path="/">
        <Route element={<Dashboard />} path="/" />

        <Route path="/member">
          <Route element={<MemberPage />} path="" />
          <Route element={<MemberCreate />} path="create" />
          <Route element={<MemberDetail />} path=":id" />
          <Route element={<MemberCreate />} path=":id/edit" />
        </Route>

        <Route element={<AgendaPage />} path="/agenda" />
        <Route element={<OrganizationPage />} path="/organization" />

        <Route path="/blogs">
          <Route element={<BlogPage />} path="" />
          <Route element={<BlogCreate />} path="create" />
          <Route element={<BlogCreate />} path=":id/edit" />
          <Route element={<BlogCategoryPage />} path="category" />
        </Route>

        <Route path="/settings">
          <Route element={<DepartmentPage />} path="department" />
          <Route element={<DepartmentPage />} path="user-management" />
          <Route element={<DepartmentPage />} path="roles" />
          <Route element={<DepartmentPage />} path="apps" />
          <Route element={<BannerPage />} path="banners" />
          <Route element={<DepartmentPage />} path="regions" />
        </Route>
      </Route>

      <Route element={<AuthLayout />} path="/">
        <Route element={<LoginPage />} path="/login" />
      </Route>
    </Routes>
  );
}

export default App;
