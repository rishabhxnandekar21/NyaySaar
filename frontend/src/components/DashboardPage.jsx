import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Upload,
  Send,
  Briefcase,
  GraduationCap,
  Scale,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  // ✅ STATE
  const [activeTab, setActiveTab] = useState("dashboard");
  const [persona, setPersona] = useState("student");
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [summary, setSummary] = useState("");
  const [verdict, setVerdict] = useState("");
  const [docId, setDocId] = useState(null);

  const chatEndRef = useRef(null);

  // 🔁 Load messages
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
  }, [messages]);

  // 📤 Upload handler
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload API failed");

      const data = await res.json();

      const newDocId = data.req?.doc_id || data.doc_id;
      if (!newDocId) throw new Error("doc_id missing");

      setDocId(newDocId);
      setHasUploaded(true);

      // 🔹 Summary
      const summaryRes = await fetch("http://localhost:8000/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doc_id: newDocId }),
      });

      if (!summaryRes.ok) throw new Error("Summary API failed");

      const summaryData = await summaryRes.json();

      setSummary(summaryData.summary || "No summary generated");
      setVerdict(summaryData.verdict || "No verdict generated");

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // 💬 Chat handler
  const handleSendMessage = useCallback(
    async (text) => {
      const msg = text || inputValue.trim();
      if (!msg) return;

      if (!docId) {
        alert("Upload document first");
        return;
      }

      setMessages((prev) => [...prev, { role: "user", content: msg }]);
      setInputValue("");
      setIsTyping(true);

      try {
        const res = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: msg,
            persona,
            doc_id: docId,
          }),
        });

        if (!res.ok) throw new Error("Chat API failed");

        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          { role: "ai", content: data.answer || "No response" },
        ]);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Error occurred" },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, persona, docId]
  );

  return (
    <div className="flex min-h-screen pt-16 bg-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 border-r flex-col py-6 px-3 bg-zinc-50">
        <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white shadow">
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>

        <div className="mt-auto pt-6 border-t">
          <button
            onClick={() => setPersona("student")}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              persona === "student" ? "bg-black text-white" : "text-zinc-500"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        <motion.div className="grid grid-cols-12 h-[calc(100vh-64px)]">
          
          {/* Upload */}
          <div className="col-span-3 p-6 border-r">
            <h3 className="font-semibold mb-4">Upload Document</h3>

            {!hasUploaded && !isUploading && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed h-full rounded-xl cursor-pointer">
                <Upload className="mb-2" />
                Click to upload PDF
                <input type="file" accept=".pdf" onChange={handleUpload} hidden />
              </label>
            )}

            {isUploading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="animate-spin" />
                Processing...
              </div>
            )}

            {hasUploaded && <p className="text-green-600">✅ Uploaded</p>}
          </div>

          {/* Chat */}
          <div className="col-span-5 flex flex-col border-r">
            <div className="p-4 border-b font-semibold">AI Assistant</div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-4 py-2 rounded-xl ${
                    msg.role === "user" ? "bg-black text-white" : "bg-zinc-100"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && <p>Typing...</p>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={() => handleSendMessage()}
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
              summary ? (
                <>
                  <p className="text-green-600 font-medium mb-2">{verdict}</p>
                  <p className="text-sm whitespace-pre-wrap">{summary}</p>
                </>
              ) : (
                <p className="text-zinc-400">Generating...</p>
              )
            ) : (
              <p className="text-zinc-400">Upload a document to see analysis</p>
            )}
          </div>

        </motion.div>
      </main>
    </div>
  );
}