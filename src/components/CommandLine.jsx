import { useEffect, useState } from "react";

function CommandLine({ command }) {
  const [displayedCommand, setDisplayedCommand] = useState("");

  useEffect(() => {
    // Reset the display when command changes
    setDisplayedCommand("");

    const characters = command.split("");
    let currentIndex = 0;

    const animate = () => {
      if (currentIndex >= characters.length) return;

      setDisplayedCommand(command.slice(0, currentIndex + 1));
      currentIndex++;
    };

    const timer = setInterval(animate, 50);

    return () => clearInterval(timer);
  }, [command]);

  return (
    <div className="command-line">
      <span className="prompt">$ </span>
      <span className="typing-text">{displayedCommand}</span>
    </div>
  );
}

export default CommandLine;
