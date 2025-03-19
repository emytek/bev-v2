import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import useInstallPrompt from "./hooks/useInstallPrompt";
import ApiTest from "./components/ApiTest";
import Notifications from "./components/Notifications";
// import { fetchDataWithCache } from "./services/axiosService";
import { useLocalNotification } from "./hooks/useLocalNotification";
import { usePushNotifications } from "./hooks/usePushNotifications";
import { useEffect, useState } from "react";
import BarcodeScanner from "./components/BarcodeScanner";

export default function App() {
  const { promptVisible, showInstallPrompt } = useInstallPrompt();
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  useLocalNotification();
  usePushNotifications();

  return (
    <>
      <Router>
        <ScrollToTop />
        <Notifications />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      {promptVisible && (
        <button onClick={showInstallPrompt} className="p-4">
          Install PWA
        </button>
      )}
      <ApiTest />

      <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Barcode Scanner</h1>
      
      {!scannedCode ? (
        <BarcodeScanner onScan={setScannedCode} onError={(err) => console.error(err)} />
      ) : (
        <div className="p-4 bg-green-200 rounded-md">
          <p>Scanned Code: {scannedCode}</p>
          <button
            onClick={() => setScannedCode(null)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
    </>
  );
}
