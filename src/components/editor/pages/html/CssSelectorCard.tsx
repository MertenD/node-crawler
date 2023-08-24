import Typography from "@mui/material/Typography";
import {IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip} from "@mui/material";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import React, {useEffect, useState} from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {toolbarBackgroundColor} from "@/config/colors";

export interface CssSelectorCardProps {
    selector: string
    index: number,
    htmlString: string,
    allSelectors: string[],
    setAllSelectors: (newSelectors: string[]) => void
    isAttributeSelectionVisible: boolean
}

export default function CssSelectorCard(props: CssSelectorCardProps) {

    const [attributes, setAttributes] = useState<string[]>([])
    const [selectedAttribute, setSelectedAttribute] = React.useState('');

    const handleAttributeSelected = (event: SelectChangeEvent) => {
        setSelectedAttribute(event.target.value as string);
    };

    useEffect(() => {

        // Create an invisible iFrame
        const iframe = document.createElement('iframe')

        iframe.style.display = 'none'
        document.body.appendChild(iframe)

        // Put the given html in the iFrame
        // @ts-ignore
        iframe.contentDocument.open()
        // @ts-ignore
        iframe.contentDocument.write(props.htmlString)
        // @ts-ignore
        iframe.contentDocument.close()

        // Search for element in iFrame
        // @ts-ignore
        let element = iframe.contentDocument.querySelector(props.selector)

        let attributeList = []

        if (element) {
            // @ts-ignore
            for (let attr of element.attributes) {
                attributeList.push(attr.name)
            }
        }

        setAttributes(attributeList)

        document.body.removeChild(iframe)
    }, [props.selector])

    return <div style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 10,
        backgroundColor: toolbarBackgroundColor,
        padding: 20
    }}>
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%"
        }}>
            <Typography variant="body1">
                { props.selector }
            </Typography>
            <div style={{
                display: "flex",
                flexDirection: "row"
            }}>
                <Tooltip title="Go one up in hierarchy" >
                    <IconButton style={{ height: 40, width: 40, marginLeft: 20 }} onClick={() =>{
                        props.allSelectors[props.index] = props.selector.substring(0, props.selector.lastIndexOf(">"))
                        if (props.allSelectors[props.index] === "") {
                            props.allSelectors.splice(props.index, 1)
                        }
                        props.setAllSelectors([...props.allSelectors])
                    }}>
                        <MoveUpIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Remove Selector" >
                    <IconButton style={{ height: 40, width: 40 }} onClick={() =>{
                        props.allSelectors.splice(props.index, 1)
                        props.setAllSelectors([...props.allSelectors])
                    }}>
                        <DeleteForeverIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
        { props.isAttributeSelectionVisible && <InputLabel style={{ marginTop: 20 }} id="selectAttributeLabel">
            Available attributes to extract
        </InputLabel> }
        { props.isAttributeSelectionVisible && <Select
            labelId="selectAttributeLabel"
            value={selectedAttribute}
            onChange={handleAttributeSelected}
            sx={{
                accentColor: "white"
            }}
        >
            <MenuItem value={"Content"}>Content</MenuItem>
            { attributes.map(attribute => {
               return <MenuItem value={attribute}>{ attribute }</MenuItem>
            }) }
        </Select> }
    </div>
}