import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Upload,
  FileText,
  Send,
  User,
  Briefcase,
  GraduationCap,
  Scale,
  CheckCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";

const PERSONAS = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "business", label: "Business Owner", icon: Briefcase },
  { id: "legal", label: "Legal Professional", icon: Scale },
];

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "reader", label: "Reader", icon: BookOpen },
  { id: "chat", label: "Chat", icon: MessageSquare },
];

const SUGGESTED_PROMPTS = [
  "What is the main verdict?",
  "Explain key legal terms",
  "What are important dates?",
  "What should I do next?",
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [persona, setPersona] = useState("student");
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // 🔁 Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("messages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // 💾 Save messages
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // 📜 Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [messages.length]);

  // 📤 Upload handler (REAL)
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setHasUploaded(true);
    } catch (err) {
      alert("Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // 💬 Chat handler (REAL AI)
  const handleSendMessage = useCallback(
    async (text) => {
      const msg = text || inputValue.trim();
      if (!msg) return;

      setMessages((prev) => [...prev, { role: "user", content: msg }]);
      setInputValue("");
      setIsTyping(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: msg, persona }),
        });

        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: data.answer || "No response received.",
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "Something went wrong. Please try again.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, persona],
  );

  return (
    <div className="flex min-h-screen pt-16 bg-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 border-r flex-col py-6 px-3 bg-zinc-50">
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
              activeTab === item.id ? "bg-white shadow" : "text-zinc-500"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}

        {/* Persona */}
        <div className="mt-auto pt-6 border-t">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                persona === p.id ? "bg-black text-white" : "text-zinc-500"
              }`}
            >
              <p.icon className="w-4 h-4" />
              {p.label}
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <motion.div className="grid grid-cols-12 h-[calc(100vh-64px)]">
              {/* Upload */}
              <div className="col-span-3 p-6 border-r">
                <h3 className="font-semibold mb-4">Upload Document</h3>

                {!hasUploaded && !isUploading && (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed h-full rounded-xl cursor-pointer">
                    <Upload className="mb-2" />
                    Click to upload PDF
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleUpload}
                      hidden
                    />
                  </label>
                )}

                {isUploading && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="animate-spin" />
                    Processing...
                  </div>
                )}

                {hasUploaded && (
                  <div>
                    <p>✅ Uploaded</p>
                    <button onClick={() => setHasUploaded(false)}>
                      Upload another
                    </button>
                  </div>
                )}
              </div>

              {/* Chat */}
              <div className="col-span-5 flex flex-col border-r">
                <div className="p-4 border-b font-semibold">AI Assistant</div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-xl ${
                          msg.role === "user"
                            ? "bg-black text-white"
                            : "bg-zinc-100"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {isTyping && <p>Typing...</p>}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t flex gap-2">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 border rounded px-3 py-2"
                    disabled={isTyping}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isTyping}
                    className="bg-black text-white px-4 rounded"
                  >
                    <Send />
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="col-span-4 p-6">
                <h3 className="font-semibold mb-4">Analysis</h3>

                {hasUploaded ? (
                  <div>
                    <p className="text-green-600 font-medium">
                      Verdict will appear from backend
                    </p>
                    <p className="mt-2 text-sm text-zinc-600">
                      Summary will be generated dynamically.
                    </p>
                  </div>
                ) : (
                  <p className="text-zinc-400">
                    Upload a document to see analysis
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* CHAT PAGE */}
          {activeTab === "chat" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold">Legal AI Chat</h2>
            </div>
          )}

          {/* READER */}
          {activeTab === "reader" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold">Document Reader</h2>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
