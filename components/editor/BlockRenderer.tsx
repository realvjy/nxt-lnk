// components/editor/BlockRenderer.tsx
import NameBlock from '@/components/blocks/NameBlock'
import BioBlock from '@/components/blocks/BioBlock'
import LinkBlock from '@/components/blocks/LinkBlock'
import { Block } from '@/shared/blocks'

type Props = {
    block: Block
    index: number
    isEdit?: boolean
}

export default function BlockRenderer({ block, isEdit = false }: { block: Block; isEdit?: boolean }) {
    switch (block.type) {
        case 'name':
            return <NameBlock data={block.props} id={block.id} isEdit={isEdit} />
        case 'bio':
            return <BioBlock data={block.props} id={block.id} isEdit={isEdit} />
        case 'link':
            return <LinkBlock data={block.props} id={block.id} isEdit={isEdit} />
        default:
            return null
    }
}

