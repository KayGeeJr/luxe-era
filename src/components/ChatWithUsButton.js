import brand from "../../brand.config";

export default function ChatWithUsButton() {
  const href = brand.chatUrl || "/contact";

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="btn-chat-us"
    >
      Chat with us
    </a>
  );
}
