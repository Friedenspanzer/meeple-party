import classNames from "classnames";

export interface GameCollectionFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onFilterChange: (filter: GameCollectionFilterOptions) => void;
}

export interface GameCollectionFilterOptions {}

const GameCollectionFilter: React.FC<GameCollectionFilterProps> = ({
  onFilterChange,
  ...props
}) => {
  return (
    <div {...props} className={classNames(props.className)}>
      Filter!
    </div>
  );
};

export default GameCollectionFilter;
