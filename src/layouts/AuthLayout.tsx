import Header from "../client/components/Header/Header";
import Footer from "../client/components/Footer/Footer";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div style={{padding: "10px 20px"}}>
      <Header />
      <main>
        <Outlet />{" "}
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;