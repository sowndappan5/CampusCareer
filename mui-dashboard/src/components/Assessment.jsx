import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Paper,
  Fade,
  CircularProgress,
} from "@mui/material";
import { ListItemIcon } from "@mui/material";
import { Dashboard, Assessment as AssessmentIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/hero.png";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

export default function Assessment() {
  const { week, day } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log(`Fetching questions for week ${week} day ${day}`);
    axios
      .get(`http://localhost:5000/api/assessment/${week}/${day}`)
      .then((res) => {
        console.log("Response data:", res.data);
        const qs = res.data.questions;
        console.log("Parsed questions:", qs);
        setQuestions(Array.isArray(qs) ? qs : []);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions.");
      })
      .finally(() => setLoading(false));
  }, [week, day]);

  const handleChange = (qIndex, value) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    axios
      .post("http://localhost:5000/api/assessment", {
        week: Number(week),
        day: Number(day),
        answers,
        questions,
      })
      .then((res) => {
        alert(`You scored ${res.data.score}% on Day ${day}`);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Submission error:", err);
        alert("Submission failed.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#faf8ff", minHeight: "100vh" }}>
      <Box
        width={260}
        height="100vh"
        bgcolor="#faf8ff"
        sx={{
          paddingTop: 2,
        }}
        display="flex"
        flexDirection="column"
        position="fixed"
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pl: 3,
            pb: 2,
            fontWeight: "bold",
            fontSize: "1.4rem",
            color: "#915eff",
            fontFamily: "Public Sans, sans-serif",
          }}
        >
          <img
            src={logo}
            alt="CampusCareer Logo"
            style={{ width: 40, height: 40 }}
          />
          CampusCareer
        </Typography>

        <List component="nav">
          {/* Dashboard with badge */}
          <ListItemButton
            component={Link}
            to="/dashboard"
            sx={{ mx: 2, mt: 1, borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: "auto", pl: 1, pr: 2 }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton
            sx={{
              mx: 2,
              borderRadius: 2,
              backgroundColor: "#f0ecfe",
              color: "#915eff",
              "&:hover": {
                backgroundColor: "#ebe6fd",
              },
            }}
          >
            <ListItemIcon
              sx={{ color: "#915eff", minWidth: "auto", pl: 1, pr: 2 }}
            >
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Assessment" />
          </ListItemButton>

          {/* Connection with 'PRO' chip */}
          <ListItemButton
            component="a"
            href="http://127.0.0.1:5000/communication"
            sx={{ mx: 2, mt: 1, borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: "auto", pl: 1, pr: 2 }}>
              <HeadsetMicIcon />
            </ListItemIcon>
            <ListItemText primary="Communication" />
          </ListItemButton>
        </List>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: 30 }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: "space-between", mb: 3 }}>
            <Fade in timeout={1000}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Learn. Grow. Achieve. Your Career, Your Way.
              </Typography>
            </Fade>
            <Avatar src="/static/user.png" />
          </Toolbar>
        </AppBar>

        <Paper
          elevation={3}
          sx={{
            borderRadius: 1,
            p: 4,
            mt: 2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Assessment – <span style={{ color: "#915eff" }}>Week {week}</span>,{" "}
            <span style={{ color: "#915eff" }}>Day {day}</span>
          </Typography>

          {loading ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <CircularProgress />
              <Typography mt={2}>Loading questions...</Typography>
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : questions.length === 0 ? (
            <Typography>No questions available for this assessment.</Typography>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ "& > * + *": { mt: 2, borderColor: "#bea0fe" } }}
            >
              {questions.map((q, i) => {
                // Normalize options: array, object, or string
                let optionEntries = [];
                if (Array.isArray(q.options)) {
                  optionEntries = q.options.map((opt, idx) => [
                    ["A", "B", "C", "D"][idx],
                    opt,
                  ]);
                } else if (q.options && typeof q.options === "object") {
                  optionEntries = Object.entries(q.options).sort((a, b) =>
                    a[0].localeCompare(b[0])
                  );
                } else if (typeof q.options === "string") {
                  optionEntries = q.options
                    .split(",")
                    .map((opt, idx) => [["A", "B", "C", "D"][idx], opt.trim()]);
                }

                return (
                  <Paper key={i} variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {i + 1}. {q.question}
                    </Typography>
                    <RadioGroup
                      name={`q${i}`}
                      value={answers[i] || ""}
                      onChange={(e) => handleChange(i, e.target.value)}
                      required
                    >
                      {optionEntries.map(([letter, text]) => (
                        <FormControlLabel
                          key={letter}
                          value={letter}
                          control={
                            <Radio
                              sx={{
                                "&.Mui-checked": {
                                  color: "#915eff", // Change selected radio button color to red
                                },
                              }}
                            />
                          }
                          label={text}
                        />
                      ))}
                    </RadioGroup>
                  </Paper>
                );
              })}

              <Box textAlign="center" mt={4}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  sx={{ width: 200, backgroundColor: "#915eff" }}
                >
                  Finish
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
