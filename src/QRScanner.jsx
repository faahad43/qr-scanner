import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export default function QRScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrCodeData, setQrCodeData] = useState(null);

  useEffect(() => {
    const getCameraFeed = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const backCamera = devices.find(
          (device) => device.kind === "videoinput" && device.label.toLowerCase().includes("back")
        );

        if (backCamera) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: backCamera.deviceId },
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } else {
          console.error("Back camera not found.");
        }
      } catch (err) {
        console.error("Error accessing camera feed:", err);
      }
    };

    const scanQRCode = () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const video = videoRef.current;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

          if (qrCode) {
            setQrCodeData(qrCode.data);
          }
        }
      }
    };

    const interval = setInterval(scanQRCode, 500); // Scan every 500ms

    getCameraFeed();

    return () => {
      clearInterval(interval);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Camera Feed</h2>
      <video ref={videoRef} style={{ width: "100%", height: "auto", backgroundColor: "#000" }}></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      {qrCodeData && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
          <h3>QR Code Data:</h3>
          <p>{qrCodeData}</p>
        </div>
      )}
    </div>
  );
}