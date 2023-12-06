import { 
  // extendTheme, 
  // defineStyle,
  defineStyleConfig 
} from "@chakra-ui/react";


export const textTheme = defineStyleConfig({
  baseStyle:{ 
    color: "#44498D",
    fontSize: "14px",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
  } 
});

export default textTheme;
