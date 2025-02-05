import {Provider} from 'react-redux';
import appStore from './utils/appStore';
import ShipmentDashboard from './components/ShipmentDashboard';

function App() {
  return (
    <Provider store = {appStore}>
      <ShipmentDashboard />
    </Provider>
  );
}

export default App;
