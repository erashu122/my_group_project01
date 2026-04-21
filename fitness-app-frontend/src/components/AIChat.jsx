import React, { useState } from "react";
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Typography,
  CircularProgress
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import { chatWithAI } from "../services/api";

const AIChat = () => {

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { type: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    try {
      const res = await chatWithAI(input);

      let text = "No response";

      const raw = res?.data;

      // ✅ HANDLE BOTH CASES
      if (typeof raw === "string") {
        text = raw;
      } else if (raw?.response) {
        text = raw.response; // 🔥 NEW BACKEND FORMAT
      } else {
        text =
          raw?.candidates?.[0]?.content?.parts?.[0]?.text ||
          JSON.stringify(raw);
      }

      setMessages(prev => [...prev, { type: "ai", text }]);

    } catch (err) {
      console.error("❌ AI ERROR:", err);

      setMessages(prev => [
        ...prev,
        {
          type: "ai",
          text: "⚠️ AI server issue / CORS problem"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ position: "fixed", bottom: 20, right: 20 }}
      >
        <ChatIcon />
      </Fab>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          🤖 AI Coach
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>

          <Box sx={{ height: 300, overflowY: "auto", mb: 2 }}>
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  textAlign: msg.type === "user" ? "right" : "left",
                  mb: 1
                }}
              >
                <Typography
                  sx={{
                    display: "inline-block",
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: msg.type === "user" ? "#1976d2" : "#1e293b",
                    color: "#fff",
                    maxWidth: "80%"
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}

            {loading && <CircularProgress size={20} />}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </Box>

        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIChat;