import { border, extendTheme } from "@chakra-ui/react";
import { color } from "framer-motion";
import { text } from "stream/consumers";

const baseColors = {
  blue: "#2598F0",
  red: "#F01A1E",
  white: "#FFFFFF",
  green: "#00E454",
};
const semanticColors = {
  primaryText: "#000000",
  cardBackground: "#262626",
  buttonBackground: "rgba(255, 255, 255, 0.08)",
  buttonBackgroundFocus: "rgba(255, 255, 255, 0.2)",
  border: "rgba(255, 255, 255, 0.5)",
  inputBorder: "rgba(255, 255, 255, 0.3)",
};

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "background",
        height: "100vh",
      },
    },
  },
  colors: {
    ...baseColors,
    ...semanticColors,
  },
  fonts: {
    body: "'Nunito', sans-serif",
  },
  shadows: {
    activeInput: "0 0 0 4px rgba(1, 132, 207, 0.5)",
  },
  components: {
    Card: {
      variants: {
        info: {
          container: {
            backgroundColor: "cardBackground",
            color: "white",
            borderRadius: "20px",
          },
          body: {
            padding: "16px",
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "500",
        letterSpacing: "0em",
        color: "primaryText",
      },
      variants: {
        h1: {
          color: "primaryText",
          fontSize: "40px",
          lineHeight: "70%",
        },
        h2: {
          color: "primaryText",
          fontSize: "20px",
          fontWeight: "600",
          lineHeight: "117%",
        },
      },
    },
    Text: {
      baseStyle: {
        fontSize: "16px",
        letterSpacing: "-0.03em",
      },
      variants: {
        regular: {
          fontWeight: "400",
          lineHeight: "150%",
          color: "secondaryText",
        },
        ended: {
          color: "error",
        },
      },
    },
    Button: {
      baseStyle: {
        bgColor: "#000000",
        hover: {
          bgColor: "buttonBackgroundFocus",
        },
      },
      variants: {
        outline: {
          borderColor: "#000000",
          border: "1px solid",
          color: "#000000",
          fontWeight: "500",
          fontSize: "14px",
          bgColor: "#ffffff",
        },
      },
    },
    Input: {
      variants: {
        editable: {
          field: {
            border: "1px solid",
            borderColor: "border",
            borderRadius: "4px",
            background: "none",
            padding: "10px",
            width: "200px",
            height: "22px",
            fontWeight: "400",
            fontSize: "16px",
            lineHeight: "157%",
            letterSpacing: "-0.03em",
            color: "white",
            _active: {
              borderColor: "primary",
            },
            _hover: {
              borderColor: "primary",
            },
            _focus: {
              borderColor: "primary",
            },
          },
        },
      },
    },
  },
});
