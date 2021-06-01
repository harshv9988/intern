import React, { useContext } from "react";
import GoogleLogin from "react-google-login";
import { authContext } from "../../../context/Auth";
import axios from "axios";
import { useHistory } from "react-router-dom";

function LoginWithGoogle({ onClose }) {
  let { auth, setAuth } = useContext(authContext);
  let history = useHistory();
  const handleSignIn = async (info) => {
    console.log(info);
    let { data } = await axios.post("/user/googlesignup", {
      token: info.tokenId,
    });
    console.log("RESPONSE", data);
    if (data.success) {
      console.log(data.data);
      await setAuth({
        user: data.data,
        authenticated: true,
      });
      onClose();
      history.push("/profile");
    }
  };

  return (
    <div>
      <GoogleLogin
        clientId="609110533672-iepitekbbjm6rc13l6nkhetjerm4v4g7.apps.googleusercontent.com"
        buttonText="Sign in with Google"
        onSuccess={handleSignIn}
        onFailure={handleSignIn}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
}

export default LoginWithGoogle;
