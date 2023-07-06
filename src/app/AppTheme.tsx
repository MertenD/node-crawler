'use client'

import {createTheme, ThemeProvider} from "@mui/material/styles";
import {selectedColor} from "@/stores/ReactFlowStore";

const appTheme = createTheme({
    palette: {
        mode: "dark",
        text: {
            primary: "white"
        },
        primary: {
            main: selectedColor
        }
    }
});

export default function AppTheme({ children }) {
    return <ThemeProvider theme={appTheme} >
        { children }
    </ThemeProvider>
}