/** Component used as an endpoint to insert an authentication JWT into local storage
 * from an email link.
 */

import { Box, Heading } from "grommet";
import { Redirect, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Verify = () => {
  const query = useQuery();
  const tempToken = query.get("token") || "";
  const [redirect, setRedirect] = useState(false);

  // exchange the temp token for a long-lasting token
  useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tempToken}`,
      },
    };

    // if user is already logged in, then skip and redirect to chat
    if (window.localStorage.getItem('token')) {
      setRedirect(true);
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getToken`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          // server error when getting long-lived token
          toast.error(result.error);
          setRedirect(true);
        } else {
          // successfully received new token
          window.localStorage.setItem("token", result.token);
          toast.success("Thanks for verifying your email.");
          setRedirect(true);
        }
      })
      .catch((error) => {
        toast.error("Something broke. Please try again later.");
        setRedirect(true);
      });
    }
  }, [tempToken]);

  return (
    <Box
      flex
      align='center'
      justify='center'
      overflow={{ horizontal: "hidden" }}
      margin="medium"
      responsive
    >
      <Heading>Logging you in...</Heading>
      {redirect && <Redirect to="/" />}
    </Box>
  );
};

export default Verify;
