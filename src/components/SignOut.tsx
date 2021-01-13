import { Redirect } from "react-router-dom";

const SignOut = () => {
  // remove token
  window.localStorage.removeItem('token')
  // redirect to the home screen
  return (
    <Redirect to="/" />
  )

}

export default SignOut;