export type NameBlockType = {
    id: string
    type: 'name'
    props: { text: string }
}

export type BioBlockType = {
    id: string
    type: 'bio'
    props: { text: string }
}

export type LinkBlockType = {
    id: string
    type: 'link'
    props: { label: string; url: string }
}

export type Block = NameBlockType | BioBlockType | LinkBlockType
