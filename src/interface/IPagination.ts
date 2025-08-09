export interface IPagination<T> {
  data: T;
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

export interface IQueryPagination {
  page?: number;
  pageSize?: number;
}
