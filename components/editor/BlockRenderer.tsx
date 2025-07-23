import NameBlock from '@/components/blocks/NameBlock'
import BioBlock from '@/components/blocks/BioBlock'
import LinkBlock from '@/components/blocks/LinkBlock'
import { Block } from '@/shared/blocks'

export default function BlockRenderer({ block, isEdit = false }: { block: Block; isEdit?: boolean }) {
    switch (block.type) {
        case 'name':
            return <NameBlock block={block} isEdit={isEdit} />
        case 'bio':
            return <BioBlock block={block} isEdit={isEdit} />
        case 'link':
            return <LinkBlock block={block} isEdit={isEdit} />
        default:
            return null
    }
}
