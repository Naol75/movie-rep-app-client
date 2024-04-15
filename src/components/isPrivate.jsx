import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

function IsPrivate(props) {
  const { isUserActive } = useContext(AuthContext);
  if (isUserActive === true) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

IsPrivate.propTypes = {
  children: PropTypes.node,
};
export default IsPrivate;
