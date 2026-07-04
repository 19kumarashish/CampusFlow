import { expect } from "chai";

import { QueryBuilder, QueryLike } from "../src/shared/builders/query.builder";
import { buildPaginationMeta } from "../src/shared/utils/pagination";

describe("QueryBuilder", () => {
    it("applies search, sort, and pagination in a chain", () => {
        const calls: string[] = [];

        const baseQuery = {
            find: (filter: unknown) => {
                calls.push(`find:${JSON.stringify(filter)}`);
                return baseQuery;
            },
            sort: (sort: unknown) => {
                calls.push(`sort:${JSON.stringify(sort)}`);
                return baseQuery;
            },
            skip: (skip: number) => {
                calls.push(`skip:${skip}`);
                return baseQuery;
            },
            limit: (limit: number) => {
                calls.push(`limit:${limit}`);
                return baseQuery;
            },
        };

        const builder = new QueryBuilder(baseQuery as unknown as QueryLike, {
            search: "math",
            page: 2,
            limit: 5,
            sortBy: "name",
            sortOrder: "asc",
        });

        const result = builder
            .search(["name", "code"])
            .sort()
            .paginate()
            .execute();

        expect(result).to.equal(baseQuery);
        expect(calls).to.include("find:{\"$or\":[{\"name\":{\"$regex\":\"math\",\"$options\":\"i\"}},{\"code\":{\"$regex\":\"math\",\"$options\":\"i\"}}]}");
        expect(calls).to.include("sort:{\"name\":1}");
        expect(calls).to.include("skip:5");
        expect(calls).to.include("limit:5");
    });

    it("builds pagination metadata with sensible defaults", () => {
        const meta = buildPaginationMeta(2, 10, 25);

        expect(meta).to.deep.include({
            page: 2,
            limit: 10,
            total: 25,
            totalPages: 3,
            hasNextPage: true,
            hasPreviousPage: true,
        });
    });
});
