// types/blocks.ts

export type NameBlockType = {
    type: 'name'
    props: { text: string }
}

export type BioBlockType = {
    type: 'bio'
    props: { text: string }
}

export type LinkBlockType = {
    type: 'link'
    props: { label: string; url: string }
}

export type Block = NameBlockType | BioBlockType | LinkBlockType
