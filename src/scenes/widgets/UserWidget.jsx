import {
    ManageAccountsOutlined,
    // EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined
} from "@mui/icons-material";
import {Box,Typography, Divider, useTheme,useMediaQuery} from '@mui/material';
import UserImage from "components/UserImage";
import FlexBetween from 'components/WidgetWrapper';
import { useSelector } from "react-redux";
import { useEffect,useState,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "components/WidgetWrapper";

const UserWidget = ({ userId, picturePath}) => {
    const [user,SetUser]=useState(null);
    const {palette} = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state)=>state.token);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main=palette.neutral.main;
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const getUser = useCallback(async () => {
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,{
                method:'GET',
                headers:{
                    Authorization: `Bearer ${token}`
                },
            });
            const data = await response.json();
            SetUser(data);
        }
        catch(error){
           console.log("the error while fecthing the user is: ");
           console.log(error.message);
        }
    },[userId,token]);

    useEffect(()=>{
      getUser();
    },[getUser]) //eslint-disable-ine react-hooks/exhaustive apps

    if(!user){
        return null;
    }

    const {
        firstName,
        lastName,
        location,
        occupation,
        viewedProfile,
        impressions,
        friends
    }=user;

    return (
        <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        sx={{padding:0}}
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box display="flex">
            <Typography
              variant={isNonMobileScreens?"p":"h4"}
              color={dark}
              fontWeight="500"
              width="70%"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography variant={isNonMobileScreens?"p":"h4"} color={medium} width="30%">{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined sx={{"&:hover":{cursor:"pointer"},marginLeft:`${isNonMobileScreens?"9.5%":"3%"}`}} />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem" display={isNonMobileScreens?'block':'flex'}>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem" width={isNonMobileScreens ?"100": "70%"}>
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem" width={isNonMobileScreens ?"100": "30%"}>
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0" display={isNonMobileScreens?'block':'flex'}>
        <FlexBetween mb="0.5rem" width={isNonMobileScreens ?"100": "65%"}>
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween width={isNonMobileScreens ?"100": "35%"}>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography variant='h4' color={main} fontWeight="500" mb="1rem" pl={isNonMobileScreens ?"9%": "3%"}>
          Social Profiles
        </Typography>

        <FlexBetween display={isNonMobileScreens?'block':'flex'} sx={{padding:"0"}}>
          <FlexBetween gap="1rem" mb="0.5rem" width={isNonMobileScreens ?"100": "65%"}>
            <FlexBetween gap="1rem" sx={{padding:"0"}}>
              <img src="../assets/twitter.png" alt="twitter" />
              <Box>
                <Typography color={main} fontWeight="500">
                  Twitter
                </Typography>
                <Typography color={medium}>Social Network</Typography>
              </Box>
            </FlexBetween>
            {/* <EditOutlined sx={{ color: main }} /> */}
          </FlexBetween>
        
          <FlexBetween gap="1rem" width={isNonMobileScreens ?"100": "35%"}>
            <FlexBetween gap="1rem" sx={{padding:"0"}}>
              <img src="../assets/linkedin.png" alt="linkedin" />
              <Box>
                <Typography color={main} fontWeight="500">
                  Linkedin
                </Typography>
                <Typography color={medium}>Network Platform</Typography>
              </Box>
            </FlexBetween>
            {/* <EditOutlined sx={{ color: main }} /> */}
          </FlexBetween>
        </FlexBetween>
               
      </Box>
    </WidgetWrapper>
    )
}

export default UserWidget;