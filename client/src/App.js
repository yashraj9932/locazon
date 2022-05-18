import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import OrderListScreen from "./screens/OrderListScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterScreen from "./screens/RegisterScreen";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<HomeScreen />} />
            <Route path="login" element={<LoginScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="register" element={<RegisterScreen />} />
            <Route path="/admin/orderlist" element={<OrderListScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
