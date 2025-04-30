import { useState, Fragment } from 'react'
import { Link } from 'react-router-dom'

// MUI Components
import {
  Box,
  Button,
  Card as MuiCard,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel as MuiFormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  styled,
  useTheme
} from '@mui/material'

// Icons
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import FooterIllustrationsV1 from './FooterIllustration'
// Config (replace with your actual config or constants)
import logo from '../assets/hero.png';
const themeConfig = {
  templateName: 'CampusCareer'
}

// Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))




const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))



const Register = () => {
  const [values, setValues] = useState({ password: '', showPassword: false })
  const theme = useTheme()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          name: username,
          password: values.password
        })
      })

      const result = await res.json()

      if (res.ok) {
        alert(result.message)
        window.location.href = result.redirect
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }


  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }



  return (

    <Box className='content-center' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
      <Card sx={{ zIndex: 1, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <CardContent sx={{  padding: theme => `${theme.spacing(4, 6, 6)} !important` }}>

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
                color: '#915eff', // Change this to your desired color
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5, color: '#915eff' }}>
              Adventure starts here 🚀
            </Typography>
            <Typography variant='body2'>Make your career preparation personalized and powerful!</Typography>
          </Box>

          <form noValidate autoComplete='off' onSubmit={handleSubmit}>

            <TextField
              autoFocus
              fullWidth
              id='username'
              label='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                marginBottom: 2,
                '& label': {
                  color: '#757575', 
                },
                '&:hover .MuiInputLabel-root': {
                  color: '#915eff', 
                },
                '& label.Mui-focused': {
                  color: '#915eff', 
                },
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
                }
              }}
            />
            <TextField
              fullWidth
              type='email'
              label='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                marginBottom: 2,
                '& label': {
                  color: '#757575', 
                },
                '&:hover .MuiInputLabel-root': {
                  color: '#915eff', 
                },
                '& label.Mui-focused': {
                  color: '#915eff', 
                },
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
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel htmlFor='auth-register-password' sx={{
                color: '#757575',
                '&.Mui-focused': {
                  color: '#915eff',

                },

              }}>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-register-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <Visibility fontSize='small' /> : <VisibilityOff fontSize='small' />}

                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  color: '#757575',
                  '&:hover .MuiInputLabel-root': {
                    color: '#915eff', 
                  },
                  '&:hover': {
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

            <FormControlLabel
              control={<Checkbox sx={{
                color: 'default', 
                '&.Mui-checked': {
                  color: '#915eff', 
                }
              }} />}
              label={
                <Fragment>
                  <span>I agree to </span>
                  <LinkStyled to='#' onClick={e => e.preventDefault()} sx={{ color: '#915eff'  }}>
                    privacy policy & terms
                  </LinkStyled>
                </Fragment>
              }
            />

            <Button fullWidth size='large' type='submit' variant='contained' sx={{ marginTop: -2,marginBottom: 2, backgroundColor: '#915eff', }}>
              Sign up
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Already have an account?
              </Typography>
              <Typography variant='body2'>
                <LinkStyled to='/' sx={{ color: '#915eff' }}>Sign in instead</LinkStyled>
              </Typography>
            </Box>

            <Divider sx={{ my: 5, marginTop:2,marginBottom:2 }}>or</Divider>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',marginBottom:-5 }}>
              <IconButton onClick={e => e.preventDefault()}>
                <FacebookIcon sx={{ color: '#497ce2' }} />
              </IconButton>
              <IconButton onClick={e => e.preventDefault()}>
                <TwitterIcon sx={{ color: '#1da1f2' }} />
              </IconButton>
              <IconButton onClick={e => e.preventDefault()}>
                <GitHubIcon sx={{ color: theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300] }} />
              </IconButton>
              <IconButton onClick={e => e.preventDefault()}>
                <GoogleIcon sx={{ color: '#db4437' }} />
              </IconButton>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

export default Register