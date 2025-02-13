import { useRef, useEffect } from "react";
import $ from "jquery";
import "blockrain/dist/blockrain.css";
import "./Blockrain.css";

export function Blockrain() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.jQuery = window.$ = $;

    const loadBlockRain = async () => {
      // Import the files in order
      await import("blockrain/dist/blockrain.jquery.min.js");

      // Now initialize the game
      $(gameRef.current).blockrain({
        speed: 20,
        theme: "candy",
        difficulty: "normal",
        autoBlockWidth: false,
        blockWidth: 12,
        showFieldOnStart: false,
      });
      $(gameRef.current).blockrain("start");
    };
    loadBlockRain();
  }, []);

  return <div className="blockrain-game-container" ref={gameRef} />;
}
