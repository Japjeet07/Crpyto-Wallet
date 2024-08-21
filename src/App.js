
import './setupBuffer';
import './App.css';
import SideMenu from './components/SideMenu';
import './components/pages_CSS/SideMenu.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import Portfolio from './components/pages/Portfolio';
import Last_Transaction from './components/pages/Last_Transaction';
import Setting from './components/pages/Setting';
import { CoinDataProvider } from './components/CoinDataContext'; // Import the provider

function App() {
  return (
    <CoinDataProvider>
      <div className="App">
        <Router>
          <SideMenu />
          <Switch>
            <Route exact path={'/'}>
              <Portfolio />
            </Route>
            <Route exact path={'/last-transaction'}>
              <Last_Transaction />
            </Route>
            <Route exact path={'/setting'}>
              <Setting />
            </Route>
           
            {/* <Route path="*" element={<Notfound />} /> */}
          </Switch>
        </Router>
      </div>
    </CoinDataProvider>
  );
}

export default App;

