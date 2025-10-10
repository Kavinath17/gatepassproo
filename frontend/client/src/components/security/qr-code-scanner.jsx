import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";
import { CheckCircle2, QrCode, Camera, XCircle } from "lucide-react";

/**
 * QR Code Scanner Component for security personnel to scan student gate passes
 */
const QRCodeScanner = ({ onScanSuccess, onScanError }) => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    return () => {
      // Clean up the scanner when component unmounts
      if (scannerRef.current) {
        scannerRef.current.stop()
          .catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, []);
  
  const startScanner = () => {
    setError(null);
    setScannedData(null);
    setScanning(true);
    
    // Initialize the scanner with the proper configuration
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
    };
    
    try {
      // Create a new scanner instance
      scannerRef.current = new Html5Qrcode("qr-reader");
      
      // Start the scanner
      scannerRef.current.start(
        { facingMode: "environment" }, // Use the back camera
        config,
        onQRCodeSuccess,
        onQRCodeError
      ).catch(err => {
        console.error("Error starting camera: ", err);
        setError("Could not access camera. Please check permissions.");
        setScanning(false);
      });
    } catch (err) {
      console.error("Error initializing scanner: ", err);
      setError("Failed to initialize QR scanner. Please try again.");
      setScanning(false);
    }
  };
  
  // Handle successful QR code scan
  const onQRCodeSuccess = (decodedText) => {
    console.log("QR Code Scanned:", decodedText);
    
    // Stop the scanner after successful scan
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        setScanning(false);
        
        // Process the scanned QR code
        try {
          processQRData(decodedText);
        } catch (err) {
          setError("Invalid QR code format. Please try again.");
        }
      }).catch(err => {
        console.error("Error stopping scanner: ", err);
        setScanning(false);
        setError("Error stopping the scanner. Please refresh and try again.");
      });
    }
  };
  
  // Handle errors during QR code scanning
  const onQRCodeError = (err) => {
    // Don't show errors during normal scanning operation
    console.log("QR Scan Error:", err);
  };
  
  // Process the data obtained from QR code
  const processQRData = (qrData) => {
    try {
      // For student passes, the format is "STUDPASS:<id>:<timestamp>"
      // For visitor passes, the format is "VISPASS:<id>:<timestamp>"
      const parts = qrData.split(':');
      
      if (parts.length !== 3) {
        throw new Error("Invalid QR code format");
      }
      
      const passType = parts[0];
      const passId = parseInt(parts[1]);
      const timestamp = parts[2];
      
      // Verify if the QR code is valid based on timestamp (optional)
      const currentTime = Date.now();
      const scanTime = parseInt(timestamp);
      
      // Check if the QR code is expired (more than 24 hours old)
      if (currentTime - scanTime > 24 * 60 * 60 * 1000) {
        setError("This pass has expired. Please generate a new QR code.");
        return;
      }
      
      if (passType === "STUDPASS") {
        // Fetch student pass details from API
        // For now, we'll simulate with mock data
        const mockStudentData = {
          id: passId,
          studentName: "Jane Smith",
          studentDept: "Mechanical Engineering",
          date: "2025-03-30",
          fromTime: "09:00",
          toTime: "17:00",
          status: "approved",
          approvals: { advisor: true, hod: true, principal: true }
        };
        
        setScannedData(mockStudentData);
        
        if (onScanSuccess) {
          onScanSuccess(passId, 'student');
        }
      } else if (passType === "VISPASS") {
        // Fetch visitor pass details from API
        // For now, we'll simulate with mock data
        const mockVisitorData = {
          id: passId,
          visitorName: "Robert Brown",
          purpose: "Guest lecture",
          date: "2025-03-31",
          concernPerson: "Dr. Williams",
          concernPersonPhone: "9876543210",
          status: "approved"
        };
        
        setScannedData(mockVisitorData);
        
        if (onScanSuccess) {
          onScanSuccess(passId, 'visitor');
        }
      } else {
        throw new Error("Unknown pass type");
      }
    } catch (err) {
      console.error("Error processing QR code:", err);
      setError("Invalid QR code. Please try again with a valid pass QR code.");
      
      if (onScanError) {
        onScanError(err.message);
      }
    }
  };
  
  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop()
        .then(() => {
          setScanning(false);
        })
        .catch(err => {
          console.error("Error stopping scanner:", err);
          setScanning(false);
        });
    }
  };
  
  const resetScanner = () => {
    setScannedData(null);
    setError(null);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Scanner
        </CardTitle>
        <CardDescription>
          Scan secure gate pass QR code for student or visitor verification
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!scanning && !scannedData && (
          <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
            <QrCode className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500 text-center mb-4">
              Press the Start Camera button to scan a gate pass QR code
            </p>
          </div>
        )}
        
        {scanning && (
          <div className="flex flex-col items-center space-y-4">
            <div id="qr-reader" style={{ width: '100%', maxWidth: '300px' }}></div>
            <p className="text-sm text-slate-500">
              Position the QR code within the scanner frame
            </p>
          </div>
        )}
        
        {scannedData && (
          <div className="border border-slate-200 rounded-lg p-4 space-y-3">
            {/* Student Pass Display */}
            {scannedData.studentName && (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{scannedData.studentName}</h3>
                  <Badge variant="outline">{scannedData.studentDept}</Badge>
                </div>
                
                <div className="text-sm">
                  <div>
                    <span className="font-medium">Date:</span> {formatDate(scannedData.date)}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {formatTime(scannedData.fromTime)} - {formatTime(scannedData.toTime)}
                  </div>
                </div>
                
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <h4 className="text-xs font-medium text-slate-600 mb-1">Approval Status</h4>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div>
                      <span className={scannedData.approvals.advisor ? 'text-green-600' : 'text-slate-400'}>
                        Advisor {scannedData.approvals.advisor ? '✓' : '○'}
                      </span>
                    </div>
                    <div>
                      <span className={scannedData.approvals.hod ? 'text-green-600' : 'text-slate-400'}>
                        HOD {scannedData.approvals.hod ? '✓' : '○'}
                      </span>
                    </div>
                    <div>
                      <span className={scannedData.approvals.principal ? 'text-green-600' : 'text-slate-400'}>
                        Principal {scannedData.approvals.principal ? '✓' : '○'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center mt-3 pt-3 border-t border-slate-100">
                  {scannedData.status === 'approved' && 
                    scannedData.approvals.advisor && 
                    scannedData.approvals.hod && 
                    scannedData.approvals.principal ? (
                    <div className="bg-green-50 text-green-700 p-2 rounded-md flex items-center gap-2 w-full justify-center">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Valid Student Pass</span>
                    </div>
                  ) : (
                    <div className="bg-red-50 text-red-700 p-2 rounded-md flex items-center gap-2 w-full justify-center">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Invalid Student Pass</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Visitor Pass Display */}
            {scannedData.visitorName && (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{scannedData.visitorName}</h3>
                  <Badge variant="outline">Visitor</Badge>
                </div>
                
                <div className="text-sm">
                  <div>
                    <span className="font-medium">Date:</span> {formatDate(scannedData.date)}
                  </div>
                  <div>
                    <span className="font-medium">Purpose:</span> {scannedData.purpose}
                  </div>
                  <div>
                    <span className="font-medium">Concern:</span> {scannedData.concernPerson}
                  </div>
                </div>
                
                <div className="flex items-center justify-center mt-3 pt-3 border-t border-slate-100">
                  {scannedData.status === 'approved' ? (
                    <div className="bg-green-50 text-green-700 p-2 rounded-md flex items-center gap-2 w-full justify-center">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Valid Visitor Pass</span>
                    </div>
                  ) : (
                    <div className="bg-red-50 text-red-700 p-2 rounded-md flex items-center gap-2 w-full justify-center">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Invalid Visitor Pass</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {scanning ? (
          <Button variant="outline" onClick={stopScanner}>Cancel</Button>
        ) : scannedData ? (
          <Button variant="outline" onClick={resetScanner} className="mx-auto">
            Scan Another
          </Button>
        ) : (
          <Button onClick={startScanner} className="gap-2 mx-auto">
            <Camera className="h-4 w-4" />
            Start Camera
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QRCodeScanner;