export enum OutputValueType {
    NONE = "none",
    HTML = "html",
    JSON = "json",
    TEXT = "text",
    DATABASE = "database"
}

export interface Output {
    value: any
    metadata?: any
}
export interface NoneOutput extends Output {}

export interface HtmlOutput extends Output {
    metadata: {
        source_url: string
    }
    value: string[]
}

export interface JsonOutput extends Output {
    value: any
}

export interface TextOutput extends Output {
    value: string[]
}

export interface DatabaseOutput extends Output {
    value: {
        schema: string
        content: string
    }
}
