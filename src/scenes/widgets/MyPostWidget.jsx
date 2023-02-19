import {
    EditOutlined,
    DeleteOutline,
    // AttachFileOutlined,
    // GifBoxOutlined,
    ImageOutlined,
    // MicOutlined,
    // MoreHorizOutlined,
} from '@mui/icons-material';
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    // useMediaQuery
} from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import DropZone from "react-dropzone";
import WidgetWrapper from 'components/WidgetWrapper';
import { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import {setPosts} from 'state';
import UserImage from "components/UserImage";

const MyPostWidget=({picturePath})=>{
    const dispatch=useDispatch();
    const [isImage,setIsImage]=useState(false);
    const [image,setImage]=useState(null);
    const [post,setPost]=useState("");
    const {palette}=useTheme();
    const {_id}=useSelector((state)=>state.user);
    const token=useSelector(state=>state.token);
    // const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const medium=palette.neutral.medium;
    const mediumMain = palette.neutral.mediumMain;

    const handlePost=async()=>{
        const formData=new FormData();
        formData.append('userId',_id);
        formData.append("description",post);
        if(image){
            formData.append("picture",image);
            formData.append("picturePath",image.name);
            formData.append("userPicturePath",picturePath);
        } 
        try{
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`,{
            method:"POST",
            headers: {Authorization:`Bearer ${token}`},
            body:formData
        })
        const posts = await response.json();
        dispatch(setPosts({posts}));
        setImage(null);
        setPosts("");
        }
        catch(error){
          console.log('the error while fetching posts are: '+error);
        }
    }

    return (
        <WidgetWrapper>
          <FlexBetween gap="1.5rem">
            <UserImage image={picturePath} />
            <InputBase placeholder="what's on your mind" onChange={(e)=> setPost(e.target.value)}
            value={post}
            sx={{
                width:"100%",
                backgroundColor:palette.neutral.light,
                borderRadius:"2rem",
                padding:'1rem 2rem'
            }}
            />   
          </FlexBetween>  
          {isImage && (
            <Box borderRadius="5px" border={`1px solid ${medium}`}>
                <DropZone acceptedFiles=".jpg,.jpeg,.png" multiple={false} onDrop={(acceptedFiles)=>
                       setImage(acceptedFiles[0])
                    }>
                        {({ getRootProps,getInputProps }) => (
                            <FlexBetween>
                                 <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p="1rem" 
                                 width="100%"
                            sx={{ "&:hover: ":{cursor:"pointer"}}}>
                                <input {...getInputProps()} />
                                {!image ? (
                                    <p>Add Picture here</p>):(
                                        <FlexBetween>
                                            <Typography>{image.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )
                                }
                            </Box>
                            {image && (
                                <IconButton onClick={()=> setImage(null)}
                                sx={{ width:"15%"}}
                                >
                                  <DeleteOutline />  
                                </IconButton>
                            )}
                        </FlexBetween>  
                        )}
                    </DropZone>
            </Box>
          )}

          <Divider sx={{ margin:"1.25rem 0" }} />
          
          <FlexBetween>
            <FlexBetween gap="0.25" onClick={()=>setIsImage(!isImage)}>
                <ImageOutlined sx={{color:mediumMain}} />
                <Typography color={mediumMain} sx={{"&hover": {cursor:"pointer",color:medium}}}>
                    Image
                </Typography> 
            </FlexBetween>
            {/* {!isNonMobileScreens ? (
                <>
                  <FlexBetween gap="0.25rem">
                    <GifBoxOutlined sx={{color:mediumMain}} />
                    <Typography color={mediumMain}>Clip</Typography>
                  </FlexBetween>

                  <FlexBetween gap="0.25rem">
                    <AttachFileOutlined sx={{color:mediumMain}} />
                    <Typography color={mediumMain}>Attachment</Typography>
                  </FlexBetween>

                  <FlexBetween gap="0.25rem">
                    <MicOutlined sx={{color:mediumMain}} />
                    <Typography color={mediumMain}>Audio</Typography>
                  </FlexBetween>
                </>
            ):(<FlexBetween>
               <MoreHorizOutlined sx={{color:mediumMain}} /> 
             </FlexBetween>    
                )} */}

           <Button disabled={!post} onClick={handlePost} sx={{color:palette.background.alt,
           backgroundColor:palette.primary.main,
           borderRadius:"3rem",
           "&:hover: ":{cursor:"pointer"}
           }}>
            POST
            </Button>     
          </FlexBetween>

        </WidgetWrapper>
    )
} 

export default MyPostWidget;