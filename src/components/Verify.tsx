/** Component used as an endpoint to insert an authentication JWT into local storage
 * from an email link.
 */

import { Redirect, useHistory, useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import { useEffect } from "react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Verify = () => {
  const query = useQuery();
  const tempToken = query.get("token") || "";
  const history = useHistory();

  // exchange the temp token for a long-lasting token
  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${tempToken}`
      },
    };
  
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getToken`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          // server error when getting long-lived token
          toast.error(result.error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        } else {
          // successfully received new token
          window.localStorage.setItem("token", result.token);
          toast.success("Thanks for verifying your email.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
          history.push('/chat');
        }
      })
      .catch((error) => {
        toast.error("Something broke. Please try again later.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      });
  });
  
  return (null);
};

export default Verify;
