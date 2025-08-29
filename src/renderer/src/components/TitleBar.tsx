import { DotIcon } from 'lucide-react'
import { JSX } from 'react'

export default function TitleBar(): JSX.Element {
  return (
    <div className="drag-region   items-center">
      <div>
        <DotIcon className="text-white" />
      </div>
    </div>
  )
}
