import { useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";

const ScanPage = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-xl font-bold mb-4">Enterprise Barcode Scanner</h1>
      
      <BarcodeScanner onScan={(code) => setScannedCode(code)} />

      {scannedCode && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-md">
          <p>Scanned Code:</p>
          <strong>{scannedCode}</strong>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
