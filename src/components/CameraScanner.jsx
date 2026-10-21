import { useEffect, useRef, useState } from "react";
import { Button, Icon } from "./ui.jsx";

export default function CameraScanner({ onRead, onStop }) {
  const videoRef = useRef(null);
  const readRef = useRef(onRead);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  readRef.current = onRead;
  useEffect(() => {
    let cancelled = false;
    let stream;
    let timer;
    let handled = false;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error("unavailable");
        const reader = await import("jsqr");
        if (cancelled) return;
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 640 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const video = videoRef.current;
        video.srcObject = stream;
        await video.play();
        setReady(true);
        const decode = () => {
          if (cancelled || handled) return;
          if (video.readyState >= 2 && video.videoWidth && context) {
            const scale = Math.min(1, 640 / video.videoWidth);
            canvas.width = Math.round(video.videoWidth * scale);
            canvas.height = Math.round(video.videoHeight * scale);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const pixels = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height,
            );
            const code = reader.default(
              pixels.data,
              pixels.width,
              pixels.height,
              { inversionAttempts: "dontInvert" },
            );
            if (code?.data) {
              handled = true;
              stream.getTracks().forEach((track) => track.stop());
              readRef.current(code.data);
              return;
            }
          }
          timer = setTimeout(decode, 220);
        };
        decode();
      } catch (cause) {
        stream?.getTracks().forEach((track) => track.stop());
        if (!cancelled)
          setError(
            cause.name === "NotAllowedError"
              ? "A câmera não foi autorizada. Você pode usar a simulação ou informar o código."
              : "Não foi possível abrir a câmera neste dispositivo. Use a simulação ou o código manual.",
          );
      }
    };
    start();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  return (
    <div className="camera-live">
      {error ? (
        <div className="camera-error" role="status">
          <Icon name="camera" size={30} />
          <p>{error}</p>
          <Button variant="white" onClick={onStop}>
            Voltar à simulação
          </Button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            aria-label="Câmera para leitura do QR demonstrativo"
          />
          <div className="scan-corners" />
          <p className="camera-live-label">
            {ready ? "Aponte para o QR demonstrativo" : "Abrindo câmera…"}
          </p>
          <button
            type="button"
            className="camera-stop"
            onClick={onStop}
            aria-label="Desligar câmera"
          >
            <Icon name="close" size={18} />
          </button>
        </>
      )}
    </div>
  );
}
