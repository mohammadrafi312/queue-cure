import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Receptionist from "./pages/Receptionist";
import WaitingRoom from "./pages/WaitingRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Receptionist />}
        />

        <Route
          path="/waiting-room"
          element={<WaitingRoom />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;