import { useNavigate } from "react-router";

export function SiteHeader() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-semibold tracking-tight"
        >
          Scene Archive
        </button>
      </div>
    </header>
  );
}