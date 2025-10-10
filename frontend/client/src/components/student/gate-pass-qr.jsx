import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/utils";

/**
 * Component to generate and display QR code for approved gate passes
 */
const GatePassQR = ({ gatePass }) => {
  const [qrValue, setQrValue] = useState('');
  
  useEffect(() => {
    if (gatePass) {
      // Create a secure token with minimal information
      // Using a specific format that identifies the pass type and ID
      // Format: STUDPASS:ID:TIMESTAMP - the timestamp serves as a simple security mechanism
      // In a real-world app, this would use digital signatures or JWT tokens
      const timestamp = new Date().getTime();
      const secureToken = `STUDPASS:${gatePass.id}:${timestamp}`;
      
      setQrValue(secureToken);
    }
  }, [gatePass]);
  
  if (!gatePass || gatePass.status !== 'approved') {
    return null;
  }
  
  const downloadQRCode = () => {
    const svg = document.getElementById('gatepass-qr');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      // Download link
      const downloadLink = document.createElement('a');
      downloadLink.download = `gatepass-${gatePass.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };
  
  return (
    <Card className="mt-4 overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center">
        <h3 className="text-lg font-medium text-center mb-3">Gate Pass QR Code</h3>
        <p className="text-sm text-slate-500 text-center mb-4">
          Show this QR code to security at the gate for verification
        </p>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <QRCodeSVG 
            id="gatepass-qr"
            value={qrValue} 
            size={200}
            level="H"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
        
        <div className="w-full max-w-xs bg-slate-50 p-3 rounded-md text-xs text-center mb-4">
          <div className="font-semibold">{gatePass.student.name}</div>
          <div>{gatePass.student.department}</div>
          <div className="mt-1">
            {formatDate(gatePass.date)} • {formatTime(gatePass.fromTime)} - {formatTime(gatePass.toTime)}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={downloadQRCode}
          className="gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default GatePassQR;