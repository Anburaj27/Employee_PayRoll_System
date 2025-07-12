import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onDetected }) => {
  const scannerRef = useRef(null);
  const lastScannedRef = useRef(null);

  useEffect(() => {
    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        target: scannerRef.current,
        constraints: {
          width: 400,
          height: 300,
          facingMode: 'environment',
        },
        area: {
          top: '0%',    // Optional: Limit scanning area
          right: '0%',
          left: '0%',
          bottom: '0%',
        },
        singleChannel: false, // true: grayscale, false: color
        willReadFrequently: true, // 🔧 Performance tip
      },
      decoder: {
        readers: ['code_128_reader', 'ean_reader', 'ean_8_reader'],
      },
      locate: true,
    }, (err) => {
      if (err) {
        console.error('❌ Quagga init error:', err);
        return;
      }
      Quagga.start();
    });

    const handleDetected = (result) => {
      const code = result?.codeResult?.code;
      if (!code) return;

      // Prevent multiple triggers for the same scan
      if (lastScannedRef.current === code) return;
      lastScannedRef.current = code;

      if (onDetected) onDetected(code);

      // Optional: reset last scanned after delay
      setTimeout(() => {
        lastScannedRef.current = null;
      }, 2000);
    };

    Quagga.onDetected(handleDetected);

    return () => {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    };
  }, [onDetected]);

  return (
    <div
      ref={scannerRef}
      style={{
        width: '100%',
        height: '300px',
        border: '2px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};

export default BarcodeScanner;
