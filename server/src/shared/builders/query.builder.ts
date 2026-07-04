export type SortOrder = "asc" | "desc";

export interface QueryLike {
    find(filter: Record<string, unknown> | unknown): QueryLike;
    sort(sort: Record<string, number> | unknown): QueryLike;
    skip(skip: number): QueryLike;
    limit(limit: number): QueryLike;
}

interface QueryBuilderOptions {
    defaultFilter?: Record<string, unknown>;
    filterFn?: (queryParams: Record<string, unknown>) => Record<string, unknown>;
    searchFields?: string[];
    defaultSortBy?: string;
    defaultSortOrder?: SortOrder;
}

export class QueryBuilder<TDoc = unknown> {
    private currentQuery: QueryLike;

    constructor(
        private baseQuery: QueryLike,
        private queryParams: Record<string, unknown> = {},
        private options: QueryBuilderOptions = {},
    ) {
        this.currentQuery = baseQuery;
    }

    search(fields?: string[]) {
        const resolvedFields = fields ?? this.options.searchFields ?? [];
        const searchValue = this.queryParams.search;

        if (
            typeof searchValue === "string" &&
            searchValue.trim() &&
            resolvedFields.length
        ) {
            this.currentQuery = this.currentQuery.find({
                $or: resolvedFields.map((field) => ({
                    [field]: {
                        $regex: searchValue,
                        $options: "i",
                    },
                })),
            });
        }

        return this;
    }

    filter(filter?: Record<string, unknown>) {
        const resolvedFilter =
            filter ??
            this.options.filterFn?.(this.queryParams) ??
            {};
        const fallbackFilter = this.options.defaultFilter ?? {};
        const combinedFilter = {
            ...fallbackFilter,
            ...resolvedFilter,
        };

        if (Object.keys(combinedFilter).length > 0) {
            this.currentQuery = this.currentQuery.find(combinedFilter);
        }

        return this;
    }

    sort(sortBy?: string, sortOrder?: SortOrder) {
        const resolvedSortBy =
            sortBy ??
            (this.queryParams.sortBy as string | undefined) ??
            this.options.defaultSortBy ??
            "createdAt";
        const resolvedSortOrder =
            sortOrder ??
            (this.queryParams.sortOrder as SortOrder | undefined) ??
            this.options.defaultSortOrder ??
            "desc";

        this.currentQuery = this.currentQuery.sort({
            [resolvedSortBy]: resolvedSortOrder === "asc" ? 1 : -1,
        });

        return this;
    }

    paginate(page?: number, limit?: number) {
        const resolvedPage = Number(page ?? this.queryParams.page ?? 1);
        const resolvedLimit = Number(limit ?? this.queryParams.limit ?? 10);
        const skip = (resolvedPage - 1) * resolvedLimit;

        this.currentQuery = this.currentQuery.skip(skip).limit(resolvedLimit);

        return this;
    }

    execute(): TDoc {
        return this.currentQuery as unknown as TDoc;
    }
}
