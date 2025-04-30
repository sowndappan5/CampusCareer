import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import FooterIllustrationsV1 from "./FooterIllustration";
export default function Info() {
  const navigate = useNavigate();

  // Default values as in your HTML
  const [form, setForm] = useState({
    aptitude: 50,
    dsa: 30,
    weeks: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    try {
      const res = await fetch("http://localhost:5000/api/milestone", {

        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate plan");
      }
      // Redirect to dashboard route
      navigate("/dashboard");
  
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fafafa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 3,
          width: 400,
          maxWidth: "95vw",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>

        <Typography variant="h4" color="#915eff" fontWeight={700} gutterBottom>
          Information
        </Typography>

        <Typography className="subtext" sx={{ color: "#777", mb: 3 }}>
          Tell us when the company is coming — so we can plan your preparation accordingly.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Hidden fields for aptitude and dsa */}
          <input type="hidden" name="aptitude" value={form.aptitude} />
          <input type="hidden" name="dsa" value={form.dsa} />
          <Typography sx={{ mb: 1, fontWeight: 500 }}>
            When will the company come to your college?
          </Typography>
          <TextField
  label="Enter in weeks"
  name="weeks"
  type="number"
  value={form.weeks}
  onChange={handleChange}
  fullWidth
  required
  sx={{
    mb: 2,
    '& label': {
      bordercolor: '#gray', // default label color
    },
    '& label.Mui-focused': {
      color: '#915eff', // focused label color
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'gray', // default border
      },
      '&:hover fieldset': {
        borderColor: '#915eff', // hover border color
      },
      '&.Mui-focused fieldset': {
        borderColor: '#915eff', // focus border color
      },
    }
  }}
  inputProps={{ min: 1 }}
/>


          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ bgcolor: "#915eff", fontWeight: "bold", mt: 2 }}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Plan"}
          </Button>
        </Box>
      </Paper>
      <FooterIllustrationsV1 />
    </Box>
  );
}