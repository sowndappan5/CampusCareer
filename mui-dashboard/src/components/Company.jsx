// Company.jsx
import React, { useEffect, useState } from "react";
import {
  Grid,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FooterIllustrationsV1 from './FooterIllustration'

const cardStyle = {
  p: 2,
  borderRadius: 2,
  height: "100%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  backgroundColor: "#ffff",
};

export default function Company() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const navigate = useNavigate();

  // Fetch list of companies on component mount
  useEffect(() => {
    fetch("http://localhost:5000/company")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((error) => {
        console.error("Error fetching companies:", error);
      });
  }, []);

  // Fetch details of selected company
  useEffect(() => {
    if (selectedCompany) {
      fetch(
        `http://localhost:5000/company/${encodeURIComponent(selectedCompany)}`
      )
        .then((res) => res.json())
        .then((data) => setCompanyDetails(data))
        .catch((error) => {
          console.error("Error fetching company details:", error);
          setCompanyDetails(null);
        });
    } else {
      setCompanyDetails(null);
    }
  }, [selectedCompany]);

  // Navigate to rounds page on Go button click
  const handleGoClick = () => {
    if (!selectedCompany) {
      alert("Please select a company first!");
      return;
    }
    navigate(`/company-rounds/${encodeURIComponent(selectedCompany)}`);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2, justifyItems: "center" }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* Left Grid: Company List */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            ...cardStyle,
            height: 700,
            width: 500,
            borderRight: 1,
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#8e5aff", fontWeight: "bold" }}
          >
            Companies
          </Typography>
          <Typography> 
            Select a company to view its details and rounds.
          </Typography>

          {/* Scrollable list grows to fill available space */}
          <List
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              mb: 2, // margin bottom so button doesn't stick too close
            }}
          >
            {companies.map(({ name, logo }) => (
              <ListItemButton
                key={name}
                selected={selectedCompany === name}
                onClick={() => setSelectedCompany(name)}
                sx={{
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#f0ecfe",
                  },
                  backgroundColor:
                    selectedCompany === name ? "#f0ecfe" : "inherit",
                  color: selectedCompany === name ? "#5c47f5" : "inherit",
                  "&.Mui-selected": {
                    backgroundColor: "#f0ecfe",
                    color: "#5c47f5",
                    "&:hover": {
                      backgroundColor: "#f0ecfe",
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={name}
                    src={`http://localhost:5000/static/logo/${logo}`}
                  />
                </ListItemAvatar>
                <ListItemText primary={name} />
              </ListItemButton>
            ))}
          </List>

          {/* Button sticks to bottom */}
          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#8e5aff" }}
            onClick={handleGoClick}
          >
            Go
          </Button>
        </Grid>

        {/* Right Grid: Company Details */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            ...cardStyle,
            border: "none",
            height: 700,
            width: 660,
            overflowY: "auto",
          }}
        >
          {companyDetails ? (
            <Paper elevation={0} sx={{ p: 2 }}>
              {/* Company Logo at the top */}
              {companyDetails["Logo (link)"] && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <img
                    src={`http://localhost:5000/static/Infrastructure/${companyDetails["Infrastructure"]}`}
                    alt={
                      companyDetails["Company"] ||
                      companyDetails["name"] ||
                      "Company Logo"
                    }
                    style={{
                      height: "100%",
                      width: "100%",
                      maxHeight: "330px",
                      objectFit: "contain",
                      borderRadius: "10px",
            
                    }}
                  />
                </Box>
              )}

              {/* Company Name */}
              <Typography variant="h5" sx={{ mb: 1 , color: "#8e5aff", fontWeight: "bold" }}>
                {companyDetails["Company"] || companyDetails["name"]}
              </Typography>

              {/* Founder */}
              {companyDetails["Founder"] && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="#915eff"
                    component="span"
                    fontWeight="bold"
                    
                  >
                    Founder:{" "}
                  </Typography>
                  <Typography variant="body1" component="span">
                    {companyDetails["Founder"]}
                  </Typography>
                </Box>
              )}

              {/* Bio */}
              {companyDetails["Bio"] && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="#915eff"
                    component="span"
                    fontWeight="bold"
                  >
                    Bio:{" "}
                  </Typography>
                  <Typography variant="body1" component="span">
                    {companyDetails["Bio"]}
                  </Typography>
                </Box>
              )}

              {/* Product/Service */}
              {companyDetails["Product/Service"] && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="#915eff"
                    component="span"
                    fontWeight="bold"
                  >
                    Product/Service:{" "}
                  </Typography>
                  <Typography variant="body1" component="span">
                    {companyDetails["Product/Service"]}
                  </Typography>
                </Box>
              )}

              {/* Service */}
              {companyDetails["Service"] && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="#915eff"
                    component="span"
                    fontWeight="bold"
                
                  >
                    Service:{" "}
                  </Typography>
                  <Typography variant="body1" component="span">
                    {companyDetails["Service"]}
                  </Typography>
                </Box>
              )}
            </Paper>
          ) : (
            <Typography variant="body1" color="text.secondary">
              {selectedCompany
                ? "Loading details..."
                : "Select a company to see details."}
            </Typography>
          )}
        </Grid>
      </Grid>
      <FooterIllustrationsV1 />
    </Box>
  );
}