import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useNavigate } from "react-router-dom";

const NestedMenu = ({ data, onShowVideos }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [subAnchorEl, setSubAnchorEl] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [checkboxStates, setCheckboxStates] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTask) {
      setCheckboxStates(Array(selectedTask.notes.length).fill(false));
    }
  }, [selectedTask]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleWeekHover = (e, week) => {
    setSelectedWeek(week);
    setSubAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSubAnchorEl(null);
  };
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    handleMenuClose();
  };

  const progressPercent = selectedTask
    ? (checkboxStates.filter(Boolean).length / checkboxStates.length) * 100
    : 0;

  return (
    <Box height={"460px"}>
      {/* Header and menu button */}
      <Typography
        variant="subtitle1"
        color="black"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        Task Today
        <IconButton onClick={handleMenuOpen} sx={{ marginLeft: "auto" }}>
          <MoreVertIcon />
        </IconButton>
      </Typography>

      {/* Week Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 220,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            borderRadius: 1,
          },
        }}
      >
        {Object.keys(data.weeks).map((week) => (
          <MenuItem
            key={week}
            onClick={(e) => handleWeekHover(e, week)}
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              backgroundColor: "primary",
              color: "grey.600",
              "&:hover": {
                backgroundColor: "grey.200",
                color: "grey.800",
              },
            }}
          >
            <span>Week {week}</span>
            <ChevronRightIcon fontSize="small" />
          </MenuItem>
        ))}
      </Menu>

      {/* Day SubMenu */}
      <Menu
        anchorEl={subAnchorEl}
        open={Boolean(subAnchorEl)}
        onClose={() => setSubAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            minWidth: 180,
            ml: 1.5,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            borderRadius: 1,
          },
        }}
      >
        {selectedWeek &&
          data.weeks[selectedWeek].map((task) => (
            <MenuItem
              key={task.day}
              onClick={() => handleTaskClick(task)}
              sx={{
                px: 2,
                py: 1.5,
                fontSize: "0.95rem",
                cursor: "pointer",
                backgroundColor: "primary",
                color: "grey.600",
                "&:hover": {
                  backgroundColor: "grey.200",
                  color: "grey.800",
                },
              }}
            >
              Day {task.day}
            </MenuItem>
          ))}
      </Menu>

      {selectedTask && (
        <>
          {/* Task topic */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              component="span"
              color="#915eff"
            >
              {selectedTask.topic}
            </Typography>
            <Box
              component="span"
              sx={{
                border: "1px solid #915eff",
                color: "#915eff",
                borderRadius: "6px",
                padding: "2px 20px",
                fontSize: "0.95rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1.5,
                minWidth: "max-content",
                fontWeight: "bold",
              }}
            >
              {selectedTask.hours} hours
            </Box>
          </Box>

          {/* Week and day info */}
          <Typography variant="body2" gutterBottom>
            Week {selectedWeek}, Day {selectedTask.day}
          </Typography>

          {/* Progress bar label */}
          <Typography
            variant="body1"
            fontWeight="medium"
            mt={3}
            mb={1}
            display="flex"
            justifyContent="space-between"
          >
            Progress
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              {Math.round(progressPercent)}%
            </Typography>
          </Typography>

          {/* Progress Bar Section */}
          <Box display="flex" alignItems="center" mb={2}>
            <Box
              sx={{
                flexGrow: 1,
                height: 10,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  backgroundColor: "#915eff",
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              height: "273px",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Checkbox Group - Map through notes array */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {selectedTask.notes &&
                selectedTask.notes.map((note, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={checkboxStates[index] || false}
                        onChange={(e) => {
                          const newStates = [...checkboxStates];
                          newStates[index] = e.target.checked;
                          setCheckboxStates(newStates);
                        }}
                        sx={{
                          "&.Mui-checked": {
                            color: "#915eff", // green when checked
                          },
                        }}
                      />
                    }
                    label={note}
                  />
                ))}
            </Box>

            {/* Button Group */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "auto",
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() =>
                  navigate(`/assessment/${selectedWeek}/${selectedTask.day}`)
                }
                sx={{ width: "190px", backgroundColor: "#915eff" }}
              >
                Take Assessment
              </Button>
              <Button
                variant="contained"
                onClick={() => onShowVideos(selectedWeek, selectedTask)}
                startIcon={<PlayCircleIcon />}
                sx={{ width: "190px", backgroundColor: "#915eff" }}
              >
                Show Videos
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default NestedMenu;
