import { Routes, Route } from "react-router-dom";
import Login from "../Interface/pages/Auth/Login";
import Register from "../Interface/pages/Auth/Register";
import Dashboard from "../Interface/pages/Dashboard";
import ViewProducts from "../Interface/pages/Products/ViewProducts";
import AddProduct from "../Interface/pages/Products/AddProduct";
import EditProducts from "../Interface/pages/Products/EditProducts";
import DeleteProducts from "../Interface/pages/Products/DeleteProducts";
import UpdateProduct from "../Interface/pages/Products/UpdateProduct";
import ViewCategories from "../Interface/pages/Categories/ViewCategories";
import AddCategory from "../Interface/pages/Categories/AddCategory";
import EditCategories from "../Interface/pages/ProductCategories/EditCategories";
import DeleteCategories from "../Interface/pages/ProductCategories/DeleteCategories";
import UpdateCategory from "../Interface/pages/Categories/UpdateCategory";
import ViewGroups from "../Interface/pages/Groups/ViewGroups";
import AddGroup from "../Interface/pages/Groups/AddGroup";
import UpdateGroup from "../Interface/pages/Groups/UpdateGroup";

import PrivateRoute from "./PrivateRoute";
import Layout from "../Interface/Components/Layout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Add this default route */}
      <Route path="/" element={<Login />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><Layout><ViewProducts /></Layout></PrivateRoute>} />
      <Route path="/products/add" element={<PrivateRoute><Layout><AddProduct /></Layout></PrivateRoute>} />
      <Route path="/products/edit" element={<PrivateRoute><Layout><EditProducts /></Layout></PrivateRoute>} />
      <Route path="/products/delete" element={<PrivateRoute><Layout><DeleteProducts /></Layout></PrivateRoute>} />
      <Route path="/products/edit/:id" element={<PrivateRoute><Layout><UpdateProduct /></Layout></PrivateRoute>} />
      <Route path="/categories" element={<PrivateRoute><Layout><ViewCategories /></Layout></PrivateRoute>} />
      <Route path="/categories/add" element={<PrivateRoute><Layout><AddCategory /></Layout></PrivateRoute>} />
      <Route path="/categories/edit" element={<PrivateRoute><Layout><EditCategories /></Layout></PrivateRoute>} />
      <Route path="/categories/delete" element={<PrivateRoute><Layout><DeleteCategories /></Layout></PrivateRoute>} />
      <Route path="/categories/edit/:id" element={<PrivateRoute><Layout><UpdateCategory /></Layout></PrivateRoute>} />
      <Route path="/groups" element={<PrivateRoute><Layout><ViewGroups /></Layout></PrivateRoute>} />
      <Route path="/groups/add" element={<PrivateRoute><Layout><AddGroup /></Layout></PrivateRoute>} />
      <Route path="/groups/edit/:id" element={<PrivateRoute><Layout><UpdateGroup /></Layout></PrivateRoute>} />
    </Routes>
  );
}