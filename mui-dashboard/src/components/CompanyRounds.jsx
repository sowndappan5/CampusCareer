import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Link,
  Divider,
  
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FooterIllustrationsV1 from "./FooterIllustration";

export default function CompanyRounds() {
  const { companyName } = useParams();
  const [rounds, setRounds] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!companyName) {
      setError("No company specified");
      setRounds(null);
      return;
    }

    fetch(
      `http://localhost:5000/save_company?name=${encodeURIComponent(
        companyName
      )}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch rounds information");
        }
        return res.json();
      })
      .then((data) => {
        if (!data.rounds) throw new Error("Rounds data not found");
        setRounds(data.rounds);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setRounds(null);
      });
  }, [companyName]);

  return (
    <Box
      sx={{
        backgroundColor: "#fafafa",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 500,
          p: 3,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 1 }}>
          <ArrowBackIcon fontSize="medium" />
        </IconButton>

        <Typography variant="h5" sx={{ color: "#915eff", mb: 1}}>
          Round Information
        </Typography>

        <Typography sx={{ mb: 2 }}>
          View the complete round-wise process for your selected company and
          stay focused on what matters.
        </Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {!rounds && !error && (
          <Typography variant="body2">Loading rounds data...</Typography>
        )}

        {rounds && Object.keys(rounds).length === 0 && (
          <Typography>No rounds information available.</Typography>
        )}

{rounds && (
  <Box
    sx={{
      backgroundColor: "#f2f4ff",
      p: 1,
      borderRadius: 2,
      mb: 2,
      
    }}
  >
    {Object.entries(rounds)
      .filter(([round, items]) => items && items.length > 0 && items[0] !== "N/A") // Exclude rounds with "N/A"
      .map(([round, items]) => (
        <Box key={round} sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: "bold", mb: 1 ,color:"#915eff" }}>
            {round}:
          </Typography>
          <List dense disablePadding>
  {items.map((item, idx) => (
    <ListItem 
      key={idx}
      disableGutters // remove default left/right padding
      sx={{
        pl: 2,         // keep some left padding
        py: 0.1,       // minimal vertical padding
        minHeight: 'unset', // prevent default height
      }}
    >
      <ListItemText 
        primary={item}
        primaryTypographyProps={{
          sx: {
            fontSize: '0.9rem',
            lineHeight: 1.1,
            my: 0, // remove vertical margins
          }
        }}
      />
    </ListItem>
  ))}
</List>

        </Box>
      ))}
  </Box>
)}


        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#915eff",
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: "bold",
            
            }}
            onClick={() => navigate("/info")}
          >
            Start
          </Button>

          <Typography variant="body2">
            Round is changed?{" "}
            <Link
              component="button"
              onClick={() => navigate("/changed")}
              sx={{ color: "#915eff", fontWeight: "bold" }}
            >
              Enter round manually
            </Link>
          </Typography>
        </Box>
      </Paper>
      <FooterIllustrationsV1 />
    </Box>
  );
}