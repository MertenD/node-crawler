import React from "react";
import {Checkbox, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';

export interface MultiSelectOptionProps {
    values: string[],
    selectedValues: string[],
    onSelectionChanged: (newSelection: string[]) => void,
    label?: string
}

export default function MultiSelectOption(props: MultiSelectOptionProps) {

    return <div style={{
        width: "100%"
    }}>
        <Select
            label={props.label}
            value={props.selectedValues}
            onChange={(event: SelectChangeEvent<typeof props.selectedValues>) => {
                const {
                    target: { value },
                } = event
                props.onSelectionChanged(typeof value === 'string' ? value.split(',') : value)
            }}
            multiple
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}
            sx={{
                width: "100%"
            }}
        >
            { props.values.map(value => {
                return <MenuItem value={value}>
                    <Checkbox checked={props.selectedValues.indexOf(value) > -1} />
                    <ListItemText primary={value} />
                </MenuItem>
            }) }
        </Select>
    </div>
}