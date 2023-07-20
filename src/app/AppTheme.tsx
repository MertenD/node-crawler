'use client'

import {createTheme, ThemeProvider} from "@mui/material/styles";
import {disabledColor, selectedColor, selectedColorHover, toolbarBackgroundColor} from "@/stores/editor/ReactFlowStore";

const appTheme = createTheme({
    palette: {
        mode: "dark",
        text: {
            primary: "#fff"
        },
        primary: {
            main: selectedColor
        },
        background: {
            default: toolbarBackgroundColor
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                contained: {
                    backgroundColor: selectedColor + ' !important',
                    '&:hover': {
                        backgroundColor: selectedColorHover + ' !important',
                    },
                    '&:disabled': {
                        backgroundColor: disabledColor + ' !important',
                    },
                }
            }
        }
    }
});

export default function AppTheme({ children }) {
    return<ThemeProvider theme={appTheme} >
        { children }
    </ThemeProvider>
}