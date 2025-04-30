"use client";

import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../Loading";

const ProtectedRoute = ({ allowedRoles, isLoading }) => {
  const { user, token, loading, isAuthenticated, logout } =
    useContext(AuthContext);
  console.log(isLoading);
  console.log(isAuthenticated);
  if (!isLoading) {
    //console.log("user, token");
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      console.log("fone");
      // Redirect to appropriate dashboard based on role
      if (user.role === "applicant") {
        return <Navigate to="/candidate" />;
      } else if (user.role === "admin") {
        return <Navigate to="/admin" />;
      } else if (user.role === "manager") {
        return <Navigate to="/manager" />;
      } else if (user.role === "jury") {
        return <Navigate to="/jury" />;
      } else {
        return <Navigate to="/" />;
      }
    }
    return <Outlet />;
  } else {
    <Loading />;
  }
};

// const ProtectedRoute = ({ element: Component, roles, isLoading, /isAuthenticated, user,/ ...rest }) => {

//     const {user, setUser, isAuthenticated, setIsAuthenticated  } = useContext(UserContext);

//     const [token, setToken] = useState(null)
//     const [storedUser, setStoredUser] = useState(user)
//     /*useEffect(() => {
//       const token = localStorage.getItem('token');
//       const storedUser = JSON.parse(localStorage.getItem('user'));
//       setToken(token)
//       setStoredUser(storedUser)
//       alert(token)
//     }, [])*/

//   //if ((token && storedUser) && !roles?.includes(storedUser?.role)) {
//   if(!isLoading){

//   if(isAuthenticated && !roles?.includes(storedUser?.role)){
//     return <Navigate to="/access-denied" replace />;
//   }

//   //if(!(token && storedUser)){
//   if(!isAuthenticated)
//   {
//     return <Navigate to="/login" replace />;

//   }

//   return <Component {...rest} />;
// }
// else
// {
//   return <Loading/>
// }
// };

export default ProtectedRoute;
