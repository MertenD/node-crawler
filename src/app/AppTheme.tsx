'use client'

import {createTheme, ThemeProvider} from "@mui/material/styles";
import {selectedColor, toolbarBackgroundColor} from "@/stores/editor/ReactFlowStore";

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
    }
});

export default function AppTheme({ children }) {
    return <ThemeProvider theme={appTheme} >
        { children }
    </ThemeProvider>
}