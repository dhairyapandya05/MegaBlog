import "./index.css";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import authService from "../src/appwrite/auth";
import {login, logout} from "./store/authSlice";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import {Outlet} from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          // let obj = {
          //   userId: userData.uid,
          //   name: userData.displayName,
          //   email: userData.email,
          //   // image: userData?.image,
          // };
          console.log("🔥Sending :::User Data: ", userData);
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return !loading ? (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : null;
}

export default App;
