export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiMessageResponse<T>
  extends ApiResponse<T> {
  message: string;
}