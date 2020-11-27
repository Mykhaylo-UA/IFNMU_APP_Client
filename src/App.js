import React from 'react';
import './App.css';
import MiniDrawer from "./Component/MiniDrawer/MiniDrawer"
import Home from "./Component/Home/Home"
import Schedule from "./Component/Schedule/Schedule"

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Document from "./Component/Document/Document";
import Chair from "./Component/Chair/Chair";
import Lesson from "./Component/Lesson/Lesson";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
            <MiniDrawer>
              <Home />
            </MiniDrawer>
        </Route>
        <Route path="/schedule" exact>
            <MiniDrawer>
              <Schedule />
            </MiniDrawer>
        </Route>
        <Route path="/chairs" exact>
            <MiniDrawer>
              <Chair />
            </MiniDrawer>
        </Route>
        <Route path="/documents/:id" exact>
            <MiniDrawer>
              <Document />
            </MiniDrawer>
        </Route>
          <Route path="/lessons" exact>
              <MiniDrawer>
                  <Lesson />
              </MiniDrawer>
          </Route>
      </Switch>
    </Router>
  );
}

export default App;