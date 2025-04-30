import { Grid, Paper, Box, Typography } from "@mui/material";
import Demo from "./demo";
import ApexAreaChart from "./ApexAreaChart";
import { useEffect, useState } from "react";
import YouTubeVideos from "./YouTubeVideos"; // Import the new component
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Sidebar from "./Sidebar"; // Import the Sidebar component

import { Stack, Button } from "@mui/material";

const cardStyle = {
  p: 2,
  borderRadius: 2,
  height: "100%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  backgroundColor: "#ffff",
};

export default function Dashboard() {
  const [weeks, setWeeks] = useState({});
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [videoResults, setVideoResults] = useState({});
  const [flatTasks, setFlatTasks] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState({ serialDay: 0, round: "" });

  // Derived metrics
  const totalDays = flatTasks.length;
  console.log("Total Days:", totalDays);
  const lastBarDay = labels.length ? labels[labels.length - 1] : 0;
  console.log("Last Bar Day:", lastBarDay);
  const bestScore = values.length ? Math.max(...values) : 0;
  const progressPercent =
    totalDays > 0 ? Math.round((lastBarDay * 100) / totalDays) : 0;
  console.log("Progress Percent:", progressPercent);
  const countdownDays = totalDays - selectedInfo.serialDay;

  useEffect(() => {
    fetch("http://localhost:5000/api/combine")
      .then((res) => res.json())
      .then((data) => {
        setWeeks(data.weeks);
        setLabels(data.labels);
        setValues(data.values);

        // Flatten tasks in order
        const tasks = [];
        Object.keys(data.weeks)
          .sort((a, b) => Number(a) - Number(b))
          .forEach((weekNum) => {
            data.weeks[weekNum].forEach((task) => {
              tasks.push({
                week: Number(weekNum),
                day: task.day,
                round: task.round || "",
              });
            });
          });
        setFlatTasks(tasks);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Handler passed down to NestedMenu via Demo
  const handleShowVideos = (week, task) => {
    fetch(`http://localhost:5000/videos/${week}/${task.day}`);
    const idx = flatTasks.findIndex(
      (t) => t.week === Number(week) && t.day === task.day
    );
    const serialDay = idx >= 0 ? idx + 1 : 0;
    setSelectedInfo({ serialDay, round: task.round });

    // Fetch videos
    fetch(`http://localhost:5000/videos/${week}/${task.day}`)
      .then((res) => res.json())
      .then((videoData) => setVideoResults(videoData))
      .catch((err) => console.error("Error fetching videos:", err));
  };
  return (
    <Box display="flex" height="100vh" bgcolor="#faf8ff">
      <Sidebar />
      <Box component="main" flexGrow={1} p={2} sx={{ marginLeft: 33 }}>
        <Grid container spacing={2}>
          {/* Top Row - Large Left Card + Small Right Card */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                ...cardStyle,
                height: 142,
                width: 160,
                display: "flex",
                alignItems: "left",
                flexDirection: "column",
                gap: 1,
                borderRadius: 1,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                position: "relative", // Ensures absolute positioning inside
              }}
            >
              {/* Three Dots Menu */}
              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                <MoreVertIcon sx={{ color: "#999", cursor: "pointer" }} />
              </Box>

              <Box
                component="img"
                src="/icons/company.png"
                alt="fire icon"
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Adds a subtle shadow
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  color: "#555",
                  fontWeight: "normal",
                  fontSize: "16px",
                  fontFamily:
                    "'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                }}
              >
                Drive Countdown
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "normal",
                  color: "#555",
                  fontSize: "24px",
                  fontFamily:
                    "'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                }}
              >
                {countdownDays} Days
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                ...cardStyle,
                height: 142,
                width: 150,
                display: "flex",
                alignItems: "left",
                flexDirection: "column",
                gap: 1,
                borderRadius: 1,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                position: "relative", // Ensures absolute positioning inside
              }}
            >
              {/* Three Dots Menu */}
              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                <MoreVertIcon sx={{ color: "#999", cursor: "pointer" }} />
              </Box>

              <Box
                component="img"
                src="/icons/schedule.png"
                alt="fire icon"
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#555",
                  fontWeight: "normal",
                  fontSize: "16px",
                  fontFamily:
                    "'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                }}
              >
                Task Completed
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "normal",
                  color: "#555",
                  fontSize: "24px",
                  fontFamily:
                    "'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                }}
              >
                {lastBarDay} Days
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                ...cardStyle,
                height: 142,
                width: 150,
                display: "flex",
                alignItems: "left",
                flexDirection: "column",
                gap: 1,
                borderRadius: 1,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                position: "relative", // Ensures absolute positioning inside
              }}
            >
              {/* Three Dots Menu */}
              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                <MoreVertIcon sx={{ color: "#999", cursor: "pointer" }} />
              </Box>

              <Box
                component="img"
                src="/icons/target.png"
                alt="fire icon"
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#555",
                  fontWeight: "normal",
                  fontSize: "16px",
                  fontFamily:
                    "'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                }}
              >
                Today's Focus
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "normal",
                  color: "#555",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "24px",
                }}
              >
                {selectedInfo.round}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                ...cardStyle,
                height: 142,
                width: 150,
                display: "flex",
                alignItems: "left",
                flexDirection: "column",
                gap: 1,
                borderRadius: 1,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                position: "relative", // Enables absolute positioning inside
              }}
            >
              {/* Three Dots Menu */}
              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                <MoreVertIcon sx={{ color: "#999", cursor: "pointer" }} />
              </Box>

              <Box
                component="img"
                src="/icons/score.png"
                alt="fire icon"
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#555",
                  fontWeight: "normal",
                  fontSize: "16px",
                  fontFamily:
                    "'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                }}
              >
                Best Score
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "normal",
                  color: "#555",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "24px",
                }}
              >
                {bestScore}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                width: 350,
                height: 127,
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 1,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#915eff",
                    fontFamily:
                      "'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                  }}
                >
                  Congratulations! 🎉
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#777",
                    fontFamily:
                      "'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                  }}
                >
                  You have Completed
                </Typography>
                <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: "#915eff",
                      mt: 1,
                      fontFamily:
                        "'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                    }}
                  >
                    {progressPercent}%
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#777",
                      ml: 1,
                      fontFamily:
                        "'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                    }}
                  >
                    of target 🚀
                  </Typography>
                </Box>
              </Box>
              <Box
                component="img"
                src="/icons/trophy.png"
                alt="trophy"
                sx={{ height: 100 }}
              />
            </Paper>
          </Grid>

          {/* Middle Row - Two Equal Cards */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                ...cardStyle,
                height: 490,
                width: 754,
                borderRadius: 1,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Demo
                data={{ weeks, labels, values }}
                onShowVideos={handleShowVideos}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                ...cardStyle,
                height: 490,
                width: 366,
                borderRadius: 1,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="subtitle1"
                color="black"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  p: 2,
                  fontFamily:
                    "'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                }}
              >
                Assessment Performance
              </Typography>

              <ApexAreaChart />
            </Paper>
          </Grid>

          {/* Bottom Full Width Card */}
          {Object.keys(videoResults).length > 0 && (
            <Grid item xs={12} width={1200}>
              <YouTubeVideos videoResults={videoResults} />
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
