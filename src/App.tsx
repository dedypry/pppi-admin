import { Route, Routes } from "react-router-dom";

import AdminLayout from "./components/layouts/admin";
import AuthLayout from "./components/layouts/auth";
import LoginPage from "./pages/auth/Login";
import Dashboard from "./pages/dashboard";
import MemberPage from "./pages/members";
import MemberCreate from "./pages/members/create";
import AgendaPage from "./pages/agenda";
import BlogPage from "./pages/blogs";
import BlogCreate from "./pages/blogs/create";
import MemberDetail from "./pages/members/detail";
import BlogCategoryPage from "./pages/blog-category";
import BannerPage from "./pages/settings/banners";
import ErrorNotFoundPage from "./pages/errors/not-found";
import ProfilePage from "./pages/profiles";
import RegionPage from "./pages/settings/regions";
import ProvincePage from "./pages/settings/regions/province";
import CityPage from "./pages/settings/regions/city";
import DistrictPage from "./pages/settings/regions/district";
import DepartmentPage from "./pages/settings/department";
import OrganizationPage from "./pages/organization";
import KepengurusanPage from "./pages/kepengurusan";
import RolePage from "./pages/settings/roles";
import AppsPage from "./pages/settings/apps";
import PackagePage from "./pages/patners/packages";
import PackageInterestPage from "./pages/patners/package-interests";
import FormCreatePage from "./pages/form/create";
import FormPage from "./pages/form";
import FormViewDetail from "./pages/form/detail";
import PartnerPage from "./pages/patners";
import UserManagementPage from "./pages/settings/user-management";
import ProductManagementPage from "./pages/ecommerce/products";
import ProductMastersPage from "./pages/ecommerce/masters";
import TransactionPage from "./pages/ecommerce/transactions";
import TransactionDetailPage from "./pages/ecommerce/transactions/detail";

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />} path="/">
        <Route element={<Dashboard />} path="/" />

        <Route path="/form">
          <Route element={<FormPage />} path="" />
          <Route element={<FormCreatePage />} path="create" />
          <Route element={<FormCreatePage />} path=":id" />
          <Route element={<FormViewDetail />} path=":id/view" />
        </Route>

        <Route path="/member">
          <Route element={<MemberPage />} path="" />
          <Route element={<MemberCreate />} path="create" />
          <Route element={<MemberDetail />} path=":id" />
          <Route element={<MemberCreate />} path=":id/edit" />
        </Route>

        <Route element={<AgendaPage />} path="/agenda" />
        <Route element={<OrganizationPage />} path="/organization" />
        <Route element={<KepengurusanPage />} path="/kepengurusan" />

        <Route path="/blogs">
          <Route element={<BlogPage />} path="" />
          <Route element={<BlogCreate />} path="create" />
          <Route element={<BlogCreate />} path=":slug/edit" />
          <Route element={<BlogCategoryPage />} path="category" />
        </Route>

        <Route path="/partners">
          <Route element={<PartnerPage />} path="" />
          <Route element={<PackagePage />} path="packages" />
          <Route element={<PackageInterestPage />} path="package-interests" />
        </Route>

        <Route path="/profile">
          <Route element={<ProfilePage />} path="" />
        </Route>

        <Route path="/settings">
          <Route element={<RegionPage />} path="regions">
            <Route element={<ProvincePage />} path="provinces" />
            <Route element={<CityPage />} path="cities" />
            <Route element={<DistrictPage />} path="districts" />
          </Route>
          <Route element={<UserManagementPage />} path="user-management" />
          <Route element={<DepartmentPage />} path="department" />
          <Route element={<RolePage />} path="roles" />
          <Route element={<AppsPage />} path="apps" />
          <Route element={<BannerPage />} path="banners" />
        </Route>

        <Route path="/ecommerce">
          <Route element={<ProductMastersPage />} path="masters" />
          <Route element={<ProductManagementPage />} path="products" />
          <Route element={<TransactionPage />} path="transactions" />
          <Route element={<TransactionDetailPage />} path="transactions/:id" />
        </Route>
      </Route>

      <Route element={<AuthLayout />} path="/">
        <Route element={<LoginPage />} path="/login" />
      </Route>

      <Route
        element={
          <AdminLayout>
            <ErrorNotFoundPage />
          </AdminLayout>
        }
        path="*"
      />
    </Routes>
  );
}

export default App;
