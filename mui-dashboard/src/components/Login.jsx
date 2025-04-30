import { useState } from 'react'
import {
  Box, Button, Card, CardContent, Checkbox, Divider,
  FormControl, FormControlLabel, IconButton, InputAdornment,
  InputLabel, OutlinedInput, TextField, Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'

import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/Facebook'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import { useNavigate } from 'react-router-dom'
import FooterIllustrationsV1 from './FooterIllustration'

import logo from '../assets/hero.png';
const themeConfig = {
  templateName: 'CampusCareer'
}

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main,
  cursor: 'pointer'
}))

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [values, setValues] = useState({ password: '', showPassword: false })
  const navigate = useNavigate()

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleLogin = async e => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: values.password })
      })

      const result = await response.json()
      if (response.ok) {
        alert(result.message)
        window.location.href = result.redirect
      } else {
        alert(result.error)
      }
    } catch (err) {
      alert('Login failed. Server error.')
      console.error(err)
    }
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  return (
    <Box className='content-center' sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card sx={{ width: '28rem', zIndex: 1, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"  }}>
        <CardContent sx={{ p: 6 }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={logo} alt='CampusCareer Logo' style={{ width: 40, height: 40 }} />

            <Typography
              variant='h6'
              sx={{
                ml: 1,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important',
                color: '#915eff',
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Typography variant='h5' sx={{ mb: 1, color: '#915eff', fontWeight: 'bold' }}>Welcome! 👋🏻</Typography>
          <Typography variant='body2' sx={{ mb: 2 }}>Please sign in to continue</Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth label='Email' sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#e0e0e0' },
                  '&:hover fieldset': { borderColor: '#915eff' },
                  '&.Mui-focused fieldset': { borderColor: '#915eff' }
                },
                '& .MuiInputLabel-root': {
                  color: 'gray',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#915eff',
                },
                '& .MuiInputLabel-root.MuiFormLabel-filled': {
                  color: 'gray',
                },


              }}
              value={email} onChange={e => setEmail(e.target.value)}
              required
            />
            <FormControl fullWidth required>
              <InputLabel
                sx={{
                  color: 'gray',
                  '&.Mui-focused': {
                    color: '#915eff',
                  },
                }}
              >
                Password
              </InputLabel>
              <OutlinedInput

                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }

                label="Password"
                sx={{
                  color: '#757575',
                  '&:hover': {
                    color: '#915eff',
                  },
                  '&:hover .MuiInputLabel-root': {
                    color: '#915eff',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#915eff',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#915eff',
                  },
                }}
              />


            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: 'grey',
                      '&.Mui-checked': {
                        color: '#915eff',
                      },
                    }}
                  />
                }
                label="Remember Me"
                sx={{
                  fontSize: '16px',
                  color: 'normal',

                }}
              />
              <LinkStyled
                sx={{
                  color: '#915eff',
                }}
                onClick={() => alert('Forgot password clicked')}
              >
                Forgot Password?
              </LinkStyled>

            </Box>
            <Button type='submit' fullWidth variant='contained' sx={{
              backgroundColor: '#915eff', mt: -2
            }}>Login</Button>
            <Box sx={{ mt: 2, textAlign: 'center', mb: -4 }}>
              <Typography variant='body2'>
                New here? <LinkStyled
                  sx={{
                    color: '#915eff',
                  }}
                  onClick={() => navigate('/register')}>Create an account</LinkStyled>
              </Typography>
            </Box>
            <Divider sx={{ my: 5, mb: 1 }}>or</Divider>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <IconButton><FacebookIcon sx={{ color: '#497ce2' }} /></IconButton>
              <IconButton><TwitterIcon sx={{ color: '#1da1f2' }} /></IconButton>
              <IconButton><GitHubIcon sx={{ color: '#272727' }} /></IconButton>
              <IconButton><GoogleIcon sx={{ color: '#db4437' }} /></IconButton>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

export default LoginPage