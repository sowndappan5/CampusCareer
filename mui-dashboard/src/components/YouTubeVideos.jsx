import React, { useState } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";

// Helper function to format ISO 8601 duration
const formatDuration = (isoDuration) => {
  // Simple formatting for PT#M#S format
  const minutes = isoDuration.match(/(\d+)M/);
  const seconds = isoDuration.match(/(\d+)S/);

  let result = '';
  if (minutes) result += `${minutes[1]}m `;
  if (seconds) result += `${seconds[1]}s`;

  return result.trim() || 'N/A';
};

const YouTubeVideos = ({ videoResults }) => {
  // Get all topic names as an array
  const topics = Object.keys(videoResults);

  // State to track the currently selected tab/topic
  const [selectedTopic, setSelectedTopic] = useState(topics.length > 0 ? topics[0] : '');

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTopic(newValue);
  };

  if (topics.length === 0) return null;

  return (
    <Box sx={{ width: '100%', boxShadow: "0 4px 10px rgba(0,0,0,0.1)", }}>
      {/* Topic tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedTopic}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="video topics tabs"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#915eff',
            },
          }}
        >
          {topics.map((topic) => (
            <Tab
              key={topic}
              label={topic}
              value={topic}
              sx={{
                fontWeight: 'medium',
                textTransform: 'none',
                fontSize: '0.95rem',
                color: selectedTopic === topic ? '#915eff' : 'inherit',
                '&.Mui-selected': {
                  color: '#915eff', 
                },
                '&:hover': {
                  color: '#915eff', 
                }
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Videos for the selected topic */}
      {selectedTopic && (
        <Box>

          <Box
            sx={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 2 }}
          >
            {videoResults[selectedTopic]?.slice(0, 2).map((video) => (
              <Box
                key={video.id}
                sx={{
                  width: 300,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  borderRadius: 1,
                  boxShadow: "0px 7px 12px rgba(0, 0, 0, 0.1)",

                }}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{
                    borderRadius: "4px",
                    marginBottom: "8px",
                    width: "100%",
                    height: "auto",
                  }}
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  sx={{ height: "100%" }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {video.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {video.channel}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {parseInt(video.viewCount).toLocaleString()} views
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • {formatDuration(video.duration)}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    href={video.url}
                    target="_blank"
                    variant="contained"
                    sx={{ backgroundColor: "#915eff", mt: 2 }}
                  >
                    Watch
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default YouTubeVideos;