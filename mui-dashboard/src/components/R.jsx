import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import FooterIllustrationsV1 from "./FooterIllustration";

const tagsList = [
  "Aptitude",
  "Programming",
  "Group Discussion",
  "Long Programming",
  "EEE core concept",
  "MECH core concept",
  "DSA",
  "General HR Questions",
  "JAPANESE related",
  "Computer network",
  "Operating system",
  "Oops",
  "ER Diagram",
];

export default function R() {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState({
    round1: "",
    round2: "",
    round3: "",
    round4: "",
    round5: "",
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleFocus = (field) => setFocusedField(field);

  const handleTagClick = (tag) => {
    if (!focusedField) return;
    const currentTags = rounds[focusedField]
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const updated = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    setRounds((prev) => ({ ...prev, [focusedField]: updated.join(", ") }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRounds((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    const tag = e.dataTransfer.getData("text/plain");
    const currentTags = rounds[field]
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const updated = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    setRounds((prev) => ({ ...prev, [field]: updated.join(", ") }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new URLSearchParams();
    Object.entries(rounds).forEach(([key, value]) => formData.append(key, value || "N/A"));
    try {
      const res = await fetch("http://localhost:5000/changed", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      if (!res.ok) throw new Error("Failed to save rounds");
      navigate("/info");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#f8f8f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", gap: 4, maxWidth: 1200, width: "100%" }}>
        {/* Left Panel: Form */}
        <Paper sx={{ flex: 1, bgcolor: "#fff", borderRadius: 2, p: 4, boxShadow: 1 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
            <ArrowBackIcon sx={{ fontSize: 24 }} />
          </IconButton>
          <Typography variant="h5" sx={{ color: '#915eff', fontWeight: 600, mb: 1 }}>
            Round Information
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Customize or update the company's round details based on your college's latest placement process.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          {['round1','round2','round3','round4','round5'].map((fld, idx) => (
  <TextField
    key={fld}
    label={`Round ${idx + 1}`}
    name={fld}
    value={rounds[fld]}
    onFocus={() => handleFocus(fld)}
    onChange={handleInputChange}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => handleDrop(e, fld)}
    fullWidth
    margin="normal"
    placeholder="Type or drag a tag here"
    multiline
    minRows={1}
    sx={{
      '& label': {
        color: '#gray',
      },
      '& label.Mui-focused': {
        color: '#915eff',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'gray', // default border color
        },
        '&:hover fieldset': {
          borderColor: '#915eff', // hover border color
        },
        '&.Mui-focused fieldset': {
          borderColor: '#915eff', // focus border color
        },
      }
    }}
  />
))}

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2, bgcolor: '#915eff', fontWeight: 'bold' }}
            >
              Submit
            </Button>
          </Box>
        </Paper>

        {/* Right Panel: Tags */}
        <Paper sx={{ flex: 1, bgcolor: "#fff", borderRadius: 2, p: 4, boxShadow: 1, overflow: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tags
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            {tagsList.map((tag) => {
              const selected = focusedField && rounds[focusedField].split(",").map(t => t.trim()).includes(tag);
              return (
                <Chip
                  key={tag}
                  label={tag}
                  clickable
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", tag)}
                  onClick={() => handleTagClick(tag)}
                  sx={{
                    backgroundColor: selected ? '#5a5afc' : '#e6e6e6',
                    color: selected ? '#fff' : '#333',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontSize: 14,
                    '&:hover': { backgroundColor: selected ? '#4a4ad8' : '#d8d8d8' },
                  }}
                />
              );
            })}
          </Box>
        </Paper>
      </Box>
      <FooterIllustrationsV1 />
    </Box>
  );
}