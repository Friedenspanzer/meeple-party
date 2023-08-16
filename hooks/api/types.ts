export interface Result<T> {
  isLoading: boolean;
  isError: boolean;
  data: T | undefined | null;
  invalidate: () => void;
}

export interface MutableResult<T> extends Result<T> {
  mutate: (data: Partial<T>, configuration: MutationConfiguration) => void;
}

export interface DeleteableResult<T> extends Result<T> {
  deleteFunction: () => void;
}

export interface MutationConfiguration {}
