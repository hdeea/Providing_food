import React, { useEffect, useRef, useState } from 'react';
import { scanQrCode } from '@/api/FoodBond/scanQrCode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScanQrCode, Camera, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan?: (data: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const { toast } = useToast();

  const startScanner = async () => {
    try {
      setError(null);
      setIsScanning(true);

      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera not supported by this browser');
        setHasCamera(false);
        setIsScanning(false);
        return;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length === 0) {
        setHasCamera(false);
        setError('No camera available');
        setIsScanning(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {
            setError('تعذر تشغيل الكاميرا');
            setIsScanning(false);
          });
        };
      }
    } catch (err: any) {
      setError('تعذر الوصول إلى الكاميرا، تحقق من الأذونات');
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateQRScan = async () => {
    try {
      const data = await scanQrCode("SAMPLE_QR_CODE_2");
      toast({ title: 'نجح المسح', description: `✅ ${JSON.stringify(data)}` });
      if (onScan) onScan(data);
    } catch (err) {
      toast({ title: 'فشل المسح', description: 'لم يتم العثور على السند.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <ScanQrCode className="w-6 h-6" />
        <h3 className="text-lg font-semibold">QR Code Scanner</h3>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-4">
          {isScanning ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-48 bg-black rounded-lg"
                autoPlay
                playsInline
                muted
              />
              <div className="flex gap-2">
                <Button onClick={stopScanner} variant="outline" className="flex-1">
                  إيقاف الكاميرا
                </Button>
                <Button onClick={simulateQRScan} className="flex-1">
                  محاكاة المسح
                </Button>
              </div>
              <p className="text-xs text-gray-500">وجّه الكاميرا نحو QR Code</p>
            </>
          ) : (
            <>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <Button onClick={startScanner} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                تشغيل الكاميرا
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {!hasCamera && !isScanning && (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto" />
            <h4 className="font-medium mb-2">الكاميرا غير متوفرة</h4>
            <p className="text-sm text-gray-600 mb-4">
              يمكنك استخدام زر المحاكاة لاختبار المسح
            </p>
            <Button onClick={simulateQRScan} className="w-full">
              <ScanQrCode className="w-4 h-4 mr-2" />
              محاكاة QR Scan
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="text-red-600 text-sm flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
