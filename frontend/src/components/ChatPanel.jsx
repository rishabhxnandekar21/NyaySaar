import { Bot, User, Trash2, Loader2, Send } from "lucide-react";

export default function ChatPanel({
  hasUploaded,
  messages,
  inputValue,
  setInputValue,
  handleSendMessage,
  isTyping,
  chatEndRef,
  clearChat,
}) {
  return (
    <aside className="sticky top-24">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="border-b border-slate-200 p-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <p className="text-sm text-slate-500">
              Ask anything about the uploaded judgment.
            </p>
          </div>

          <button
            onClick={clearChat}
            className="text-slate-400 hover:text-red-500 transition"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!hasUploaded && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot size={48} className="text-blue-600 mb-5" />

              <h3 className="font-semibold text-lg">Nyay Saar AI</h3>

              <p className="text-slate-500 mt-2 max-w-xs">
                Upload a court judgment to begin asking questions.
              </p>
            </div>
          )}

          {hasUploaded && messages.length === 0 && (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot size={18} className="text-blue-600" />
                </div>

                <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200 max-w-xs">
                  Hello 👋
                  <br />
                  Ask me anything about this judgment.
                </div>
              </div>

              <div className="grid gap-2 mt-6">
                {[
                  "Summarize this case",
                  "What is the final verdict?",
                  "Who won the case?",
                  "Explain this in simple language",
                ].map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSendMessage(question)}
                    className="text-left border rounded-xl px-4 py-3 hover:bg-blue-50 transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[90%] ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-slate-800 text-white"
                      : "bg-blue-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User size={18} />
                  ) : (
                    <Bot size={18} className="text-blue-600" />
                  )}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 leading-7 whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-slate-800 text-white"
                      : "bg-white border border-slate-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot size={18} className="text-blue-600" />
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
                <Loader2 className="animate-spin text-blue-600" size={20} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="mt-auto border-t border-slate-200 p-4">
          <div className="flex gap-3">
            <input
              disabled={!hasUploaded}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={
                hasUploaded
                  ? "Ask anything about the judgment..."
                  : "Upload document first..."
              }
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            />

            <button
              disabled={!hasUploaded || isTyping}
              onClick={() => handleSendMessage()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl px-5 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
