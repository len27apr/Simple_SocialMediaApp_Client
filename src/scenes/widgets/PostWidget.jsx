import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined,FavoriteOutlined,ShareOutlined,RemoveCircleOutline } from "@mui/icons-material";
import {Box,Button,Divider,IconButton,Typography,useTheme,TextField} from '@mui/material';
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import {useState} from 'react';
import { useDispatch,useSelector } from "react-redux";
import { setPost } from "state";



const PostWidget=({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
    isProfile
})=>{
    const [IsComments,setIsComments] = useState(false);
    const [newComment,setNewComment]=useState('');
    const dispatch=useDispatch();
    const token=useSelector(state=>state.token);
    const loggedInUserId = useSelector(state=>state.user._id);
    const IsLiked=Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;

    const {palette}=useTheme();
    const primary=palette.primary.main;
    const main = palette.neutral.main;

    const patchLike=async()=>{
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/like`,{
            method:'PATCH',
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({userId:loggedInUserId})
        });
        const updatedPost = await response.json();
        dispatch(setPost({post:updatedPost}));
    };

    const addNewComment=async()=>{
        const response=await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/addNewComment/${postId}`,{
            method:'POST',
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                userId:loggedInUserId,
                newComment
            })
        });
        const updatedPost=await response.json();
        dispatch(setPost({post:updatedPost}));
        setNewComment('');
    }

    const deleteComment=async(commentToBeDeleted)=>{
        try{
            const response=await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/deleteComment/${postId}`,{
                method:'DELETE',
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    userId:loggedInUserId,
                    commentToBeDeleted
                })
            });
            const updatedPost=await response.json();
            dispatch(setPost({post:updatedPost}));
        }
        catch(error){
            console.log('the error occured while deleting a comment is: '+error);
        }
    }

    return (
        <WidgetWrapper m="2rem 0">
            <Friend friendId={postUserId} name={name} subtitle={location} userPicturePath={userPicturePath} isProfile={isProfile} postId={postId}/>
            <Typography color={main} sx={{mt:"1rem"}}>
                {description}
            </Typography>
            {picturePath && (
               <img width="100%" height="auto" alt="post" style={{borderRadius:"0.75rem", marginTop:"0.75rem"}}
               src={`${process.env.REACT_APP_BACKEND_URL}/assets/${picturePath}`} /> 
            )}
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={patchLike}>
                          {IsLiked?(
                            <FavoriteOutlined sx={{color:primary}} />
                          ):(
                            <FavoriteBorderOutlined />
                          )}  
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>
                    <FlexBetween gap="0.3rem">
                            <IconButton onClick={()=> setIsComments(!IsComments)} sx={{"&:hover": {
                                cursor: "pointer",
                                }}}>
                                <ChatBubbleOutlineOutlined />
                            </IconButton>
                            <Typography>
                                {comments.length}
                            </Typography>
                    </FlexBetween>
                </FlexBetween>
                <IconButton>
                    <ShareOutlined />
                </IconButton>
            </FlexBetween>
            {IsComments && (
              <Box mt="0.5rem">
                {comments.map((comment,i)=>(
                    <Box key={`${name}-${i}`} pr="2%">
                       <Divider />
                       <FlexBetween justifyContent='space-between'>
                           <Typography sx={{color:"main",m:"0.5rem"}} width="90%">
                                {comment}
                           </Typography> 
                           <RemoveCircleOutline onClick={()=>deleteComment(comment)} style={{cursor:'pointer'}}/>
                       </FlexBetween>
                    </Box>
                ))}
                <Divider />
                <Box spacing={2}>
                    <TextField variant="outlined" multiline={true} sx={{width:"100%",marginBottom:'2%', paddingRight:'2%'}} minRows={2} maxRows={4} onChange={(event)=>setNewComment(event.target.value)} value={newComment}/>
                    <Typography align='center'>
                        <Button variant="outlined" sx={{borderRadius:'10px',marginBottom:'2%'}} onClick={addNewComment}>Add Comment</Button>
                    </Typography>
                </Box>
                <Divider />
              </Box>  
            )}
        </WidgetWrapper>
    )
}
export default PostWidget;