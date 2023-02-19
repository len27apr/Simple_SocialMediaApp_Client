import {useEffect,useCallback} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import {setPosts} from 'state';
import PostWidget from './PostWidget';

const PostWidgets = ({userId,isProfile=false})=>{
    const dispatch = useDispatch();
    let posts=useSelector(state=>state.posts);
    const token=useSelector(state=>state.token);
    posts=(Object.keys(posts).length===0 || posts.message)?null:posts;

    const getPosts =useCallback(async()=>{
        try{
            const response=await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`,{
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            });
            const data=await response.json();
            dispatch(setPosts({posts:data}));
        }
        catch(error){
            console.log('the error while fetching the posts are: '+error);
        }
    },[dispatch,token]);

    const getUserPosts = useCallback(async() => {
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${userId}/posts`,{
                method:"GET",
                headers:{Authorization:`Bearer ${token}`},
            })
            const data= await response.json();
            dispatch(setPosts({posts:data}));
        }
        catch(error){
            console.log('the error while fetching the  user posts are: '+error); 
        }
    },[token,userId,dispatch])

    useEffect(()=>{
        isProfile?getUserPosts():getPosts();
    },[getUserPosts,getPosts,isProfile]);

    return (
        <>
            {posts && posts.map(({_id,userId,firstName,lastName,description,location,picturePath,userPicturePath,likes,comments}) => (
              <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
              isProfile={isProfile}
              />
            ))}
        </>
    )
}

export default PostWidgets;