import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { startLogin } from "./loginServices";

// Fitness-Emojis die durch die Gegend fliegen
const FITNESS_EMOJIS = [
  "🏋️",
  "💪",
  "🏋️‍♂️",
  "🏋️‍♀️",
  "🥇",
  "🔥",
  "⚡",
  "🎯",
  "💥",
  "🦾",
  "🏆",
  "⭐",
];

// Generiere zufällige fallende Partikel
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: FITNESS_EMOJIS[Math.floor(Math.random() * FITNESS_EMOJIS.length)],
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 1.5 + Math.random() * 2,
    rotate: Math.random() * 360,
    rotateSpeed: (Math.random() - 0.5) * 720,
  }));
};

// CSS Keyframes für alle Animationen
const keyframesStyle = `
  @keyframes fall {
    0% {
      transform: translateY(-100px) rotate(var(--start-rotate));
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(calc(var(--start-rotate) + var(--rotate-speed)));
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
  }

  @keyframes curl {
    0%, 100% { transform: rotate(-15deg) scale(1); }
    50% { transform: rotate(15deg) scale(1.2); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px) rotate(-5deg); }
    75% { transform: translateX(5px) rotate(5deg); }
  }

  @keyframes glow {
    0%, 100% { 
      text-shadow: 0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.3);
    }
    50% { 
      text-shadow: 0 0 20px rgba(255, 165, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.5), 0 0 60px rgba(255, 165, 0, 0.3);
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(5deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(-5px) rotate(-5deg); }
  }

  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Generiere Partikel nur einmal
  const particles = useMemo(() => generateParticles(20), []);

  const handleOidcLogin = useCallback(() => {
    setIsLoading(true);
    void startLogin().finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <style>{keyframesStyle}</style>

      {/* Overlay während des Ladens */}
      <Backdrop
        open={isLoading}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          zIndex: 1300,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div style={{ display: "flex", gap: "1rem", fontSize: "3rem" }}>
          <span style={{ animation: "bounce 1s ease infinite 0s" }}>🏋️</span>
          <span style={{ animation: "bounce 1s ease infinite 0.1s" }}>💪</span>
          <span style={{ animation: "bounce 1s ease infinite 0.2s" }}>🔥</span>
        </div>
        <CircularProgress color="inherit" size={60} />
        <span
          style={{
            color: "white",
            marginTop: "0.5rem",
            fontSize: "1.2rem",
            animation: "pulse 1s ease-in-out infinite",
          }}
        >
          Verbinde mit Authentik...
        </span>
      </Backdrop>

      {/* Fallende Fitness-Emojis im Hintergrund */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: 0,
              fontSize: `${p.size}rem`,
              animation: `fall ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
              ["--start-rotate" as string]: `${p.rotate}deg`,
              ["--rotate-speed" as string]: `${p.rotateSpeed}deg`,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Hauptinhalt */}
      <div
        className="h-screen w-screen flex items-center justify-center"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "2.5rem",
            borderRadius: "20px",
            background:
              "linear-gradient(145deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.98))",
            border: "2px solid rgba(255, 165, 0, 0.3)",
            boxShadow:
              "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 165, 0, 0.1)",
            animation: "fadeInUp 0.6s ease-out",
            textAlign: "center",
            minWidth: "320px",
          }}
        >
          {/* Animiertes Maskottchen */}
          <div
            style={{
              fontSize: "4rem",
              animation: "curl 0.8s ease-in-out infinite",
              marginBottom: "-10px",
            }}
          >
            💪
          </div>

          {/* Titel mit Glow-Effekt */}
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              margin: 0,
              background: "linear-gradient(135deg, #ff8c00, #ff6b00, #ff4500)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "glow 2s ease-in-out infinite",
            }}
          >
            PumpLog
          </h1>

          {/* Subtitle mit schwebenden Icons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span style={{ animation: "float 3s ease-in-out infinite" }}>
              🏋️
            </span>
            <p
              style={{
                margin: 0,
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.95rem",
              }}
            >
              Melde dich mit deinem Konto an
            </p>
            <span style={{ animation: "float 3s ease-in-out infinite 0.5s" }}>
              🏋️
            </span>
          </div>

          {/* Login Button mit Hover-Effekten */}
          <Button
            variant="contained"
            onClick={handleOidcLogin}
            disabled={isLoading}
            sx={{
              mt: 1,
              py: 1.5,
              px: 4,
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%)",
              boxShadow: "0 4px 20px rgba(255, 107, 0, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #ff9d2f 0%, #ff8c00 100%)",
                transform: "translateY(-3px) scale(1.02)",
                boxShadow: "0 8px 30px rgba(255, 107, 0, 0.6)",
              },
              "&:active": {
                transform: "translateY(0) scale(0.98)",
              },
              "&:disabled": {
                background: "rgba(255, 140, 0, 0.5)",
              },
            }}
          >
            {isLoading ? (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ animation: "spinSlow 1s linear infinite" }}>
                  ⚡
                </span>
                Wird verbunden...
              </span>
            ) : (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                🚀 Mit Authentik anmelden
              </span>
            )}
          </Button>

          {/* Fun Footer */}
          <p
            style={{
              margin: 0,
              marginTop: "10px",
              fontSize: "0.8rem",
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            <span style={{ animation: "shake 0.5s ease-in-out infinite" }}>
              🔥
            </span>{" "}
            Time to get swole{" "}
            <span
              style={{ animation: "shake 0.5s ease-in-out infinite 0.25s" }}
            >
              🔥
            </span>
          </p>
        </div>
      </div>
    </>
  );
};
