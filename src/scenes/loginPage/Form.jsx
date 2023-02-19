import { useState } from "react";
import {Box,Button,TextField,useMediaQuery,Typography,useTheme} from '@mui/material';
import EditOutlinedIcon  from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";   //drop a file or user to import a file.
import FlexBetween from "components/FlexBetween";

//validation fields for validating inputs
const registerSchema = yup.object().shape({
    firstName:yup.string().required("required"),    
    lastName:yup.string().required("required"),
    email:yup.string().email("invalid email").required("required"),
    password:yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture:yup.string().required("required")
});

const loginSchema=yup.object().shape({
    email:yup.string().email("invalid email").required("required"),
    password:yup.string().required("required")
});

const initialValuesRegister = {
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    location:"",
    occupation:"",
    picture:""
}

const initialValuesLogin={
    email:"",
    password:""
}

const Form=()=>{
    const [pageType,setPageType]=useState("Login");
    const { palette } = useTheme();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === 'Login';
    const isRegister = pageType==='register';

    const register=async(values,onSubmitProps) =>{
        // this allows su to send info with image
        const formData = new FormData();
        for (let value in values){
            formData.append(value, values[value])
        }
        formData.append('picturePath',values.picture.name)

        const savedUserResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/register`,{
            method:"POST",
            body:formData,
        });
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if(savedUser){
            setPageType("Login");
        }
    };

    const login = async(values,onSubmitProps) =>{
        try{
            const loggedInResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(values),
            });
            if(!loggedInResponse.ok)
            {
                throw new Error(loggedInResponse.text);
            }
            const loggedIn = await loggedInResponse.json();
            onSubmitProps.resetForm();
            if(loggedIn){
                dispatch(setLogin({
                    user:loggedIn.user,
                    token:loggedIn.token    
            }));
            navigate("/home");
            }  
        }
        catch(error){
            console.log('the error while logging in the user is: ');
            console.log(error);
        }
    }

    const handleFormSubmit=async(values,onSubmitProps) =>{
        isLogin ? await login(values,onSubmitProps):await register(values, onSubmitProps);
    };

    return <Formik onSubmit={handleFormSubmit} initialValues={isLogin?initialValuesLogin:initialValuesRegister} 
    validationSchema={isLogin?loginSchema:registerSchema}>
        {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,  
            setFieldValue,
            resetForm
        }) => {
        return  (<form onSubmit={handleSubmit}>
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4,minmax(0,   1fr))" 
            sx={{
                "& > div":{      //any element > parent
                   gridColumn:isNonMobile?undefined: "span 4"
                }
            }}
            >   
             {isRegister && (
                <>
                 <TextField label="First Name" onBlur={handleBlur} onChange={handleChange} value={values.firstName}
                 name="firstName"
                 error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                 helperText={touched.firstName && errors.firstName}
                 sx={{gridColumn:"span 2"}}
                 />
                 <TextField label="Last Name" onBlur={handleBlur} onChange={handleChange} value={values.lastName}
                 name="lastName"
                 error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                 helperText={touched.lastName && errors.lastName}
                 sx={{gridColumn:"span 2"}}
                 />
                 <TextField label="Location" onBlur={handleBlur} onChange={handleChange} value={values.location}
                 name="location"
                 error={Boolean(touched.location) && Boolean(errors.location)}
                 helperText={touched.location && errors.location}
                 sx={{gridColumn:"span 4"}}
                 />
                 <TextField label="Occupation" onBlur={handleBlur} onChange={handleChange} value={values.occupation}
                 name="occupation"
                 error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                 helperText={touched.occupation && errors.occupation}
                 sx={{gridColumn:"span 4"}}
                 />
                 <Box gridColumn="span 4" border={`2px solid ${palette.neutral.medium}`}
                 borderRadius="5px"
                 p="1rem"
                 > 
                    <Dropzone acceptedFiles=".jpg,.jpeg,.png" multiple={false} onDrop={(acceptedFiles)=>
                       setFieldValue("picture",acceptedFiles[0])
                    }>
                        {({ getRootProps,getInputProps }) => (
                            <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p="1rem" 
                            sx={{ "&:hover: ":{cursor:"pointer"}}}>
                                <input {...getInputProps()} />
                                {!values.picture ? (
                                    <p>Add Picture here</p>):(
                                        <FlexBetween>
                                            <Typography>{values.picture.name}</Typography>
                                            <EditOutlinedIcon />
                                        </FlexBetween>
                                    )
                                }
                            </Box>
                        )}
                    </Dropzone>
                 </Box>
                </>
             )}
             <TextField label="Email" 
                onBlur={handleBlur} 
                onChange={handleChange} 
                value={values.email}
                 name="email"
                 error={Boolean(touched.email) && Boolean(errors.email)}
                 helperText={touched.email && errors.email}
                 sx={{gridColumn:"span 4"}}
                 /> 
              <TextField label="Password"              
                type="password"
                onBlur={handleBlur} 
                onChange={handleChange} 
                value={values.password}
                 name="password"
                 error={Boolean(touched.password) && Boolean(errors.password)}
                 helperText={touched.password && errors.password}
                 sx={{gridColumn:"span 4"}}
                 />     
            </Box>

            {/* REGISTER */}
            <Box>
              <Button 
              fullWidth
              type="submit"
              sx={{
                m:"2rem 0",
                p:"1rem",
                backgroundColor:palette.primary.main,
                color:palette.background.alt,
                "&:hover":{color:palette.primary.main}
              }}
              >
                {isLogin ? "LOGIN" :"REGISTER"}
             </Button>  
             <Typography onClick={()=>{
                setPageType(isLogin?"register":"Login");
                resetForm();
             }}
             sx={{
                textDecoration:"underline",
                color:palette.primary.main,
                "&:hover":{
                    cursor:"pointer",
                    color:palette.primary.light
                }
             }}
             >
                {isLogin?"Don't have an account? Sign up here":"Already have an account? Login here"}
             </Typography>
            </Box>
            </form>)
        }}
    </Formik>
}

export default Form;