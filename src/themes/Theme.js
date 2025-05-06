import { PixelRatio } from "react-native";
import { Dimensions } from "react-native";



const fontSize = (size) => {
    return PixelRatio.getFontScale() * size;
}

const height = () =>{
    return Dimensions.get('window').height
}

const width = () =>{
    return Dimensions.get('window').width
}

export const Theme = {
    colors:{

    },
    fontSize:{
        header:fontSize(30),
        buttonTxt:fontSize(20),
        paragraph:fontSize(18),
    },
    dimensions:{
        usewidth:width(),
        useheight:height(),
    },
}