import {PersonAddOutlined,PersonRemoveOutlined} from "@mui/icons-material";
import {Box, Button, IconButton,Typography,useTheme} from '@mui/material';
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {setFriends} from 'state';
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { setPosts } from "state";

const Friend=({friendId,name,subtitle,userPicturePath,isProfile,postId})=>{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {_id} = useSelector(state=>state.user);
    const token=useSelector(state=>state.token);
    let friends=useSelector(state=>state.user.friends);

    const {palette}=useTheme();
    const primaryLight=palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main= palette.neutral.light;
    const medium=palette.neutral.medium;
    friends=Object.keys(friends).length===0?[]:friends;

    const isFriend = friends.find((friend) => friend._id === friendId);

    const patchFriend = async () => {
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${_id}/${friendId}`,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${token}`,
                'Content-Type':"application/json"
            }
       });
        const data =await response.json();
        dispatch(setFriends({friends:data})); 
        }
        catch(error){
            console.log('the error while fetching patch friends are: ');
            console.log(error);
        }
    };

    const deletePost=async()=>{
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`,{
                method:'DELETE',
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({userId:_id})
            }); 
            let updatedPosts = await response.json();
            dispatch(setPosts({posts:updatedPosts})); 
        }
        catch(error){
            console.log('the error occured while fetching user posts after deleting a post is: ');
            console.log(error);
        }
    }

    return (
        <FlexBetween>
            <FlexBetween gap="1rem">
                <UserImage image={userPicturePath} size="55px" />
                <Box onClick={()=>{
                    navigate(`/profile/${friendId}`);
                    navigate(0);
                }}>
                 <Typography color={main} variant="h5" fontWeight="500" sx={{
                    "&:hover":{
                        cursor:'pointer',
                        color:palette.primary.light
                    }
                 }}>
                  {name}
                 </Typography>
                 <Typography color={medium} fontSize="0.75rem">
                    {subtitle}
                 </Typography>
                </Box>
            </FlexBetween>
            {friendId!==_id ? <IconButton onClick={()=>patchFriend()}
            sx={{
              backgroundColor:primaryLight,
              p:"0.6rem"  
            }}
            >{isFriend?(
                <PersonRemoveOutlined sx={{color:primaryDark}} />
            ):(
                <PersonAddOutlined sx={{color:primaryDark}} />
            )}</IconButton>:isProfile && <Button variant="outlined" onClick={deletePost}>
                    Remove Post
                </Button>}

        </FlexBetween>
    )
}
export default Friend;