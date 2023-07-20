"use client"

import Typography from '@mui/material/Typography';
import {Button} from "@mui/material";
import Link from "next/link";
import useEditorPageState from "@/stores/editor/EditorPageStore";

// TODO Es wäre geil Verbindungsregeln in einer Config Datei setzten zu können. Vielleicht kann ich dort ja auch die NodeTypes und co. setzen. Eine einheitliche Struktur wäre auf jeden Fall schön

export default function Home() {
  return <div style={{
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }}>
      <Typography variant="h1" style={{ marginBottom: 50 }}>
          Node-Crawler
      </Typography>
      <Link href="/editor">
          <Button variant="text" onClick={() => {
            useEditorPageState.getState().onPageChanged("edit")
          }} style={{ padding: 10 }}>
              <Typography variant="h4">
                  Go to /editor
              </Typography>
          </Button>
      </Link>
  </div>
}
