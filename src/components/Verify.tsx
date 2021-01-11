/** Component used as an endpoint to insert an authentication JWT into local storage
 * from an email link.
 */

import { Box, Heading } from "grommet";
import { useHistory, useLocation } from "react-router-dom";

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
        Authorization: `Bearer ${tempToken}`,
      },
    };

    // if user is already logged in, then skip and redirect to chat
    if (window.localStorage.getItem('token')) {
      history.push('/');
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getToken`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          // server error when getting long-lived token
          toast.error(result.error);
          history.push("/");
        } else {
          // successfully received new token
          window.localStorage.setItem("token", result.token);
          toast.success("Thanks for verifying your email.");
          history.push("/");
        }
      })
      .catch((error) => {
        toast.error("Something broke. Please try again later.");
        history.push("/");
      });
  });

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
    </Box>
  );
};

export default Verify;
