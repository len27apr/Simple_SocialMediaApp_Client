import { Box,Typography,useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect,useCallback } from "react";
import { useDispatch,useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget=({userId}) => {
    const dispatch=useDispatch();
    const {palette} = useTheme();
    const token=useSelector(state=>state.token);
    const friends = useSelector(state=>state.user.friends);

    const getFriends=useCallback(async ()=>{
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/friends`,{
            method:"GET",
            headers:{
                Authorization: `Bearer ${token}`,
            }
            });
            const data=await response.json();
            dispatch(setFriends({friends:data}));
            }
        catch(error)
        {
            console.log('the error while fetching the user friends are: '+error.message);
        }
    },[userId,token,dispatch]);

    useEffect(()=>{
        getFriends();
    },[getFriends])

    return (
        <WidgetWrapper>
              <Typography color={palette.neutral.dark}
              variant="h5"
              fontWeight="500"
              sx={{
                mb:"1.5rem"
              }}
              >
                Friend List
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
             {friends.length>0 &&  friends.map((friend)=>(
                <Friend key={friend._id} friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
                />
             ))}
            </Box>
        </WidgetWrapper>
    )
}

export default FriendListWidget;