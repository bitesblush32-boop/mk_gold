'use client';
// F03 — Floating WhatsApp button (no icon — text "W" mark per brand rules)

interface MkWhatsAppProps {
  number?: string;
  message?: string;
}

export function MkWhatsApp({
  number = process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT ?? "918000000000",
  message = "Hi, I want to sell my gold. Can you help?",
}: MkWhatsAppProps) {
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 300,
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "#1BA448",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Tanker, serif",
        fontSize: "1.2rem",
        textDecoration: "none",
        boxShadow: "0 4px 20px rgba(27,164,72,0.4)",
        transition: "transform 520ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 260ms",
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.12)";
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
    >
      W
    </a>
  );
}
