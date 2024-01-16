import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LogIn from "./components/LogIn";
import Home from "./components/Home";
import Details from "./components/Details";
import Cart from "./components/Cart";
import SignUp from "./components/SignUp";
import Favorite from "./components/Favorite";
import Billing from "./components/Billing";
import { axiosClient } from "./service/AxiosClient";
import MyLearning from "./components/MyLearning";
import PaginatedItems from "./components/PaginatedItems";
import PurchaseHistory from "./components/PurchaseHistory";

function App() {
  axiosClient();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/log-in" element={<LogIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/details/:id" element={<Details />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/favorites" element={<Favorite />}></Route>
        <Route path="/success" element={<Billing />}></Route>
        <Route path="/my-learning" element={<MyLearning />}></Route>
        <Route path="/search" element={<PaginatedItems />}></Route>
        <Route path="/purchase-history" element={<PurchaseHistory />}></Route>
      </Routes>
    </>
  );
}

export default App;
