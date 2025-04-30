// src/pages/Personal.jsx
import React, { useEffect, useState } from 'react'
import {
  Paper, Box, Typography,
  FormControl, InputLabel, Select, MenuItem,
  TextField, Button
} from '@mui/material'
import FooterIllustrationsV1 from './FooterIllustration'

const API_BASE = "http://localhost:5000/api"

export default function Personal() {
  const [collegeList,   setCollegeList]   = useState([])
  const [selectedCollege, setSelectedCollege] = useState('')
  const [courses,       setCourses]       = useState([])
  const [selectedCourse,  setSelectedCourse]  = useState('')
  const [location,       setLocation]      = useState('')
  const [email,          setEmail]         = useState('')

  // ① on-mount: grab email & load colleges
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get('email') || '')

    fetch(`${API_BASE}/get_colleges`)
      .then(res => res.json())
      .then(setCollegeList)
      .catch(err => {
        console.error(err)
        alert("Could not load colleges")
      })
  }, [])

  // ② when college changes, fetch its details
  const handleCollegeChange = async e => {
    const c = e.target.value
    setSelectedCollege(c)
    try {
      const res = await fetch(`${API_BASE}/get_details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ college: c })
      })
      const data = await res.json()
      setLocation(data.location || '')
      setCourses(data.courses || [])
      setSelectedCourse('')
    } catch (err) {
      console.error(err)
      alert("Could not load details")
    }
  }

  // ③ submit
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/submit", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          college: selectedCollege,
          course: selectedCourse,
          location
        })
      });
      
      const result = await res.json();
      if (res.ok && result.redirect) {
        window.location.href = result.redirect;
      } else if (res.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };
  

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        width: 400,
        p: 4,
        mx: 'auto',
        mt: 14,
        borderRadius: 2,
        bgcolor: 'white',
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" 
      }}
    >
      <Typography variant="h5" color="#915eff" sx={{fontWeight:'bold'}} gutterBottom>
        Personal Info
      </Typography>
      <Typography variant="body2" mb={1} mt={4}>
        Tell us about you, so we can tailor your preparation path.
      </Typography>

      <FormControl fullWidth margin="normal"
      sx={{
        '& .MuiOutlinedInput-root': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0', 
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#915eff', 
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#915eff', 
          },
        },
        '& .MuiInputLabel-root': {
          color: '#757575', 
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#757575', 
        },
        '& .MuiInputLabel-root.MuiFormLabel-filled': {
          color: '#757575', 
        }
      }}
      >
        <InputLabel id="college-label">College Name</InputLabel>
        <Select
          labelId="college-label"
          value={selectedCollege}
          onChange={handleCollegeChange}
          label="College Name"
        >
          <MenuItem value="">Select College</MenuItem>
          {collegeList.map((c, i) => (
            <MenuItem key={i} value={c}
            sx={{
              
              '&:hover': {
                backgroundColor: '#F3EBFF',
              },
              '&.Mui-selected': {
                backgroundColor: '#E5D8FF',
                '&:hover': {
                  backgroundColor: '#D7C2FF',
                },
              },
            }}
            >{c}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal"
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#e0e0e0' },
          '&:hover fieldset': { borderColor: '#915eff' },
          '&.Mui-focused fieldset': { borderColor: '#915eff' },
        },
        '& .MuiInputLabel-root': {
          color: '#757575',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#915eff',
        },
        '& .MuiInputLabel-root.MuiFormLabel-filled': {
          color: '#757575',
        }
      }}
      >
        <InputLabel id="course-label">Course</InputLabel>
        <Select
          labelId="course-label"
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
          label="Course"
          disabled={!courses.length}
        >
          <MenuItem value="">Select Course</MenuItem>
          {courses.map((c, i) => (
            <MenuItem key={i} value={c}
            sx={{
              
              '&:hover': {
                backgroundColor: '#F3EBFF',
              },
              '&.Mui-selected': {
                backgroundColor: '#E5D8FF',
                '&:hover': {
                  backgroundColor: '#D7C2FF',
                },
              },
            }}
            >{c}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="College Location"
        value={location}
        InputProps={{ readOnly: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e0e0e0', 
            },
            '&:hover fieldset': {
              borderColor: '#915eff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#915eff', 
            },
          },
          '& .MuiInputLabel-root': {
            color: '#757575',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#915eff', 
          },
          '& .MuiInputLabel-root.MuiFormLabel-filled': {
            color: '#757575', 
          }
        }}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, backgroundColor: '#915eff' }}
        onClick={handleSubmit}
      >
        Enter
      </Button>
      <FooterIllustrationsV1 />
    </Box>
  )
}