export interface Page<T>{
    
  pageNumber: number,
  pageSize: number,
  content: T[],
  countPages: number

}