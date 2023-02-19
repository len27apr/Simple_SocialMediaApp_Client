import React from 'react'
import { useState } from 'react'
import { 
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  keyframes
 } from '@mui/material'
import {
  Search,
  // Message,
  DarkMode,
  LightMode,
  // Notifications,
  Help,
  Menu,
  Close
} from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import {setMode,setLogout} from "state";
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import {setPosts} from 'state';
 
const Navbar = (props) => {
  const [isMobileMenuToggled,setIsMobileMenuToggled]=useState(false);
  const isProfilePage=props.isProfilePage?true:false;
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const user=useSelector(state=>state.user);
  const token=useSelector(state=>state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.dark;
  const dark = theme.palette.neutral.dark;
  // const background = theme.palette.primary.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const fullName = user?`${user.firstName} ${user.lastName}`:'John Snow'; 
  const menuItemAnimation=keyframes`
  0%
  {
    -webkit-transform:translateX(100px);
    transform:translateX(100px)
  }
  100%
  {
    -webkit-transform:translateX(0);
    transform:translateX(0)
  }
  `;

  const searchPosts= async(searchValue)=>{
    try{
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/searchPosts`,{
        method:'POST',
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
          userId:user._id,
          isProfilePage,
          searchValue
        })
      });
      const posts=await response.json();
      dispatch(setPosts({posts}));
    }
    catch(error){
      console.log('the error occured while searching posts are: '+error);
    }   
  }

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography fontWeight="bold" fontSize="clamp(1rem, 2rem, 2.25rem)" color="primary" onClick={()=>navigate("/home")}
        sx={{
         "&:hover":{
          color:primaryLight,
          cursor:"pointer"
         } 
        }}>
            Social FunLife
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween background={neutralLight} borderRadius="9px" padding="0.1rem 1.5rem">
            <InputBase placeholder="Search..." onChange={(event)=>searchPosts(event.target.value)}/>
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween> 
      {/* DESKTOP NAV*/}
      {isNonMobileScreens ? (<FlexBetween gap="2rem">
          <IconButton onClick={()=>dispatch(setMode())}>
            {theme.palette.mode === 'dark'? (
              <DarkMode sx={{fontSize:"25px"}} />
            ):(
              <LightMode sx={{color:dark,fontSize:"25px"}} />
            )}
          </IconButton>
          {/* <Message sx={{fontSize:"25px"}} />
          <Notifications sx={{fontSize:"25px"}} /> */}
          <Help sx={{fontSize:"25px"}} />
          <FormControl variant="standard" value={fullName}>
              <Select value={fullName} sx={{backgroundColor: neutralLight,
              width:"150px",
              borderRadius: "0.25rem",
              p: "0.25rem 1rem",
              "& .MuiSvgIcon-root": {
                 pr:"0.25rem",
                 width: "3rem"
              },
              "& .MuiSelect-selet:focus":{
                backgroundColor: neutralLight
              }  
            }}
            input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>
                Log Out
              </MenuItem>
            </Select>
          </FormControl>
      </FlexBetween>):(<IconButton onClick={()=>setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <Menu />
        </IconButton>)}

    {/* MOBILE NAV*/}
    {!isNonMobileScreens && isMobileMenuToggled && (<Box position="fixed" right="0" top="0" height="40%" zIndex="10" maxWidth="300px" minWidth="200px" backgroundColor="#fffffff5" sx={{
        animation: `${menuItemAnimation} 0.6s ease-out both` 
    }}>
      {/* CLOSE ICON */}
      <Box display="flex" justifyContent="flex-end" p="1rem">
        <IconButton onClick={()=>setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <Close />
        </IconButton>
      </Box>

      {/* MENU ITEMS */}
      <FlexBetween display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="2rem">
          <IconButton onClick={()=>dispatch(setMode())} sx={{fontSize:"25px"}} >
            {theme.palette.mode === 'dark'? (
              <DarkMode sx={{fontSize:"25px"}} />
            ):(
              <LightMode sx={{color:dark,fontSize:"25px"}} />
            )}
          </IconButton>
          {/* <Message sx={{fontSize:"25px"}} />
          <Notifications sx={{fontSize:"25px"}} /> */}
          <Help sx={{fontSize:"25px"}} />
          <FormControl variant="standard" value={fullName}>
              <Select value={fullName} sx={{backgroundColor: neutralLight,
              width:"150px",
              borderRadius: "0.25rem",
              p: "0.25rem 1rem",
              "& .MuiSvgIcon-root": {
                 pr:"0.25rem",
                 width: "3rem"
              },
              "& .MuiSelect-selet:focus":{
                backgroundColor: neutralLight
              }  
            }}
            input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>
                Log Out
              </MenuItem>
            </Select>
          </FormControl>
      </FlexBetween>
    </Box>)}    
    </FlexBetween>
  )
}

export default Navbar
