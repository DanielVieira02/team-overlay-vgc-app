import { SelectList } from "../ui/SelectList";

interface OBSSourcesListProps {
    sources: Object[],
    onSelectSource: (source: string) => void
}

export const OBSSourcesList = ({
    sources,
    onSelectSource
}: OBSSourcesListProps) => {
    const sourcesNames = sources.map((source) => source.sourceName);

    const handleSelectedSource = function (event: any) {
        onSelectSource(event.target.value);
    }

    return (
        <div>
            <SelectList
                onChange={handleSelectedSource}
                values={sourcesNames}
                multiple={true}
            />
        </div>
    )
}