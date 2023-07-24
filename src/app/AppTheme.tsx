'use client'

import {createTheme, ThemeProvider} from "@mui/material/styles";
import {disabledColor, selectedColor, selectedColorHover, toolbarBackgroundColor} from "@/stores/editor/ReactFlowStore";
import {ReactNode} from "react";

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
        },
        warning: {
            main: selectedColor
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

interface AppThemeProps {
    children: ReactNode;
}

export default function AppTheme({ children }: AppThemeProps) {
    return<ThemeProvider theme={appTheme} >
        { children }
    </ThemeProvider>
}