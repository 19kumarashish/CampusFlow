import type { PaginationMeta } from "../utils/pagination";

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}
