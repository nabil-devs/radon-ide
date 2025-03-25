import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const wsRef = useRef<WebSocket | null>(null);
  const [isProfilerActive, setIsProfilerActive] = useState(false);
  useEffect(() => {
    const ws = new WebSocket(`ws://${window.__websocketEndpoint}`);
    wsRef.current = ws;

    ws.onmessage = (message) => {
      console.log("JSON.stringify(message)", JSON.stringify(message));
    };

    return () => {
      ws.close();
    };
  }, []);

  const toggleProfiler = () => {
    wsRef.current?.send(
      JSON.stringify({
        method: isProfilerActive ? "stopProfiling" : "startProfiling",
      })
    );
  };

  return (
    <main>
      <h1>React Devtools</h1>
      <button
        onClick={() => {
          setIsProfilerActive((prev) => !prev);
          toggleProfiler();
        }}>
        {isProfilerActive ? "Stop Profiling" : "Start Profiling"}
      </button>
    </main>
  );
}

export default App;
