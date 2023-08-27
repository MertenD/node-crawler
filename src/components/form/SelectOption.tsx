import React from "react";
import {InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

export interface SelectOptionProps {
    values: string[],
    selectedValue: string,
    onSelectionChanged: (newSelection: string) => void,
    label?: string
}

export default function SelectOption(props: SelectOptionProps) {

    return <div style={{
        width: "100%"
    }}>
        { props.label && <InputLabel id="selectAttributeLabel">{ props.label }</InputLabel> }
        <Select
            labelId="selectAttributeLabel"
            value={props.selectedValue}
            onChange={(event: SelectChangeEvent) => {
                props.onSelectionChanged(event.target.value)
            }}
            sx={{
                width: "100%"
            }}
        >
            { props.values.map(attribute => {
                return <MenuItem value={attribute}>{ attribute }</MenuItem>
            }) }
        </Select>
    </div>
}