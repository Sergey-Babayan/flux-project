export interface IResponse<T> {
  status: number;
  success: boolean;
  data: T;
}
