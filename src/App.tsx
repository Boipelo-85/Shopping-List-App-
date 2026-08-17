// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'

import './App.css'
import { Header } from './components/Header/Header';
import { Login } from './components/LoginPage/Login';

function App() {

  return (
    <>
        <div className="app-container">
              <Header />
              <div>
                <Login />
              </div>
        </div>
    </>
  )
}

export default App
