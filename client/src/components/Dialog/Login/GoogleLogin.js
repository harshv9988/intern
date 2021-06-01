import React from 'react'
import GoogleLogin from 'react-google-login'

function LoginWithGoogle() {
  const handleSignIn = async (data) => {
    // let res = await axios.post('url', {
    //   token: data.tokenId,
    // })
    // setCookie('tempo', res.data.jwtToken, { path: '/' })
    // console.log('RESPONSE', res)
    // if (res.data.success) {
    //   await setAuthData({
    //     name: res.data.data.name,
    //     authenticated: true,
    //   })
    // history.push('/feed')
    // }
    console.log(data)
  }

  return (
    <div>
      <GoogleLogin
        clientId=''
        buttonText='Sign in with Google'
        onSuccess={handleSignIn}
        onFailure={handleSignIn}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  )
}

export default LoginWithGoogle
