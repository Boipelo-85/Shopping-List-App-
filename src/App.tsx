// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'

import './App.css'
import { Header } from './components/Header/Header';
import { Home } from './components/Home/Home';
import { Login } from './components/LoginPage/Login';

function App() {

  return (
    <>
        <div className="app-container">
              <Header />
              <div className='main-content'>
                {/* <Login /> */}
                <Home />
              </div>
        </div>
    </>
  )
}

export default App
