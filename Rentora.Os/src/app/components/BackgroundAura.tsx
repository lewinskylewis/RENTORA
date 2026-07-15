import { useTheme } from "@/app/theme";
import { ImageWithFallback } from "./ImageWithFallback";

export function BackgroundAura() {
  const theme = useTheme();

  // Light theme: soft coloured washes on a bright base, no dark image overlay.
  if (theme.mode === "light") {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundColor: theme.bgBase }}>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full animate-pulse" style={{ backgroundColor: theme.orb1 }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full animate-pulse" style={{ backgroundColor: theme.orb2, animationDelay: "1s" }} />
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] blur-[150px] rounded-full animate-pulse" style={{ backgroundColor: theme.orb3, animationDelay: "0.5s" }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1764258906159-3f5952286f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmx1aWQlMjBhYnN0cmFjdCUyMG5lb258ZW58MXx8fHwxNzgwNTY1MDEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
        alt=""
        className="w-full h-full object-cover opacity-[0.12] mix-blend-screen"
      />
      <div className="absolute inset-0 backdrop-blur-[120px]" style={{ backgroundColor: `${theme.bgBase}99` }} />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ backgroundColor: theme.orb1 }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ backgroundColor: theme.orb2, animationDelay: "1s" }} />
      <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ backgroundColor: theme.orb3, animationDelay: "0.5s" }} />
    </div>
  );
}
