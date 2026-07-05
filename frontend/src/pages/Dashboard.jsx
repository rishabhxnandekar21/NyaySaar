import { useState, useRef, useEffect, useCallback } from "react";

import Sidebar from "../components/Sidebar";
import UploadCard from "../components/UploadCard";
import AnalysisPanel from "../components/AnalysisPanel";
import ChatPanel from "../components/ChatPanel";

import { uploadDocument } from "../api/upload";
import { generateSummary } from "../api/summary";
import { askQuestion } from "../api/chat";

export default function Dashboard() {
  // =========================
  // STATE
  // =========================

  const [persona, setPersona] = useState("student");

  const [hasUploaded, setHasUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [summary, setSummary] = useState("");
  const [verdict, setVerdict] = useState("");

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [docId, setDocId] = useState(null);
  const [fileName, setFileName] = useState("");

  const chatEndRef = useRef(null);

  // =========================
  // CHAT
  // =========================

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("messages");
  };

  useEffect(() => {
    const saved = localStorage.getItem("messages");

    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================
  // UPLOAD
  // =========================

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);

    try {
      const data = await uploadDocument(file);

      const newDocId = data.req?.doc_id || data.doc_id;

      if (!newDocId) {
        throw new Error("doc_id missing");
      }

      setDocId(newDocId);
      setHasUploaded(true);

      const summaryData = await generateSummary(newDocId);

      setSummary(summaryData.summary || "No summary generated");
      setVerdict(summaryData.verdict || "No verdict generated");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // =========================
  // CHAT MESSAGE
  // =========================

  const handleSendMessage = useCallback(
    async (text) => {
      const msg = text || inputValue.trim();

      if (!msg) return;

      if (!docId) {
        alert("Upload document first");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: msg,
        },
      ]);

      setInputValue("");
      setIsTyping(true);

      try {
        const data = await askQuestion(msg, persona, docId);

        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: data.answer || "No response",
          },
        ]);
      } catch (err) {
        console.error(err);

        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "Error occurred",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, persona, docId],
  );

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar persona={persona} setPersona={setPersona} />

      <main className="ml-80 flex-1 h-screen overflow-y-auto">
        {/* Header */}

        <header className="sticky top-0 z-10 h-20 bg-white border-b border-slate-200 flex items-center px-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <p className="text-slate-500">
              Upload judgments and interact with AI.
            </p>
          </div>
        </header>

        {/* Workspace */}

        <div className="flex gap-6 p-6 items-start">
          {/* Left Column */}
          <section className="flex-1 flex flex-col gap-6">
            <UploadCard
              hasUploaded={hasUploaded}
              isUploading={isUploading}
              fileName={fileName}
              handleUpload={handleUpload}
            />

            <AnalysisPanel
              hasUploaded={hasUploaded}
              summary={summary}
              verdict={verdict}
              persona={persona}
            />
          </section>

          {/* Right Column */}
          <div className="w-[420px] shrink-0">
            <ChatPanel
              hasUploaded={hasUploaded}
              messages={messages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
              isTyping={isTyping}
              chatEndRef={chatEndRef}
              clearChat={clearChat}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
