import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Register from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layouts/layout";
import ForgotPassword from "../pages/ForgotPassword";

const router=createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "",
                element: <AuthLayouts>
                    <CheckEmailPage/>
                </AuthLayouts>
            },
            {
                path: "register",
                element: <AuthLayouts>
                    <Register/>
                </AuthLayouts>
            },
            {
                path: "email",
                element: <AuthLayouts>
                    <CheckEmailPage/>
                </AuthLayouts>
            },
            {
                path: "password",
                element: <AuthLayouts>
                    <CheckPasswordPage/>
                </AuthLayouts>
            },
            {
                path: "forgot",
                element: <AuthLayouts>
                    <ForgotPassword/>
                </AuthLayouts>
            },
            {
                path: "home",
                element: <Home/>,
                children: [
                    {
                        path: ":userId",
                        element: <MessagePage/>
                    }
                ]
            }
        ]
    }
]);

export default router;