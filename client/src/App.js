import React, { useContext, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { authContext } from './context/Auth'
import axios from 'axios'
import Header from './components/Header/Header'
import UserProfile from './components/Profile/UserProfile'
import EmailVerification from './components/Verification/EmailVerification'

function App() {
  let { auth, setAuth } = useContext(authContext)

  useEffect(() => {
    const refreshUser = async () => {
      try {
        var config = {
          method: 'get',
          url: '/user/me',
        }

        let response = await axios(config)
        console.log(response)
        if (response.data.success) {
          await setAuth({
            user: response.data.data,
            authenticated: true,
          })
          // setLoad(false)
        }
      } catch (err) {
        console.log('e', err)
        // setLoad(false)
      }
    }
    refreshUser()
  }, [])

  return (
    <Router>
      <Switch>
        <div>
          <Header />
          {/* <Route exact path='/' component={LandingPage} /> */}
          <Route exact path='/profile' component={UserProfile} />
          <Route exact path='/verification/:id' component={EmailVerification} />
        </div>
      </Switch>
    </Router>
  )
}

export default App
