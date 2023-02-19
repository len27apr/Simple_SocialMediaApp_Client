import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget=()=>{
    const {palette} = useTheme();
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;

    return (
        <WidgetWrapper>
            <FlexBetween pb='3%'>
                <Typography color={dark} variant="h5" fontWeight="500" pb='1%'>
                    Sponsored
                </Typography>
                <Typography color={medium}>Create Ad</Typography>
            </FlexBetween>
            <img width="100%" height="auto" alt="advert" src={`${process.env.REACT_APP_BACKEND_URL}/assets/mobileAd.png`} style={{borderRadius:"0.75rem", margin:"0.75 0"}} />
            <Typography color={medium} m="0.5rem 0">
            Modern technology has given consumers a wider range of options when it comes to how they consume media.
            </Typography>
        </WidgetWrapper>
    )
}

export default AdvertWidget;