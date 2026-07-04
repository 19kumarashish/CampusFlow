import { ApiError } from "@/utils/ApiError";

export abstract class BaseService {
    protected async findOrFail<T>(
        entity: T | null,
        entityName: string,
        notFoundMessage?: string,
    ): Promise<T> {
        if (!entity) {
            throw new ApiError(
                404,
                notFoundMessage ?? `${entityName} not found`,
            );
        }

        return entity;
    }

    protected async ensureNotDeleted<T extends { deletedAt?: Date | null }>(
        entity: T,
        entityName: string,
        alreadyDeletedMessage?: string,
    ): Promise<T> {
        if (entity.deletedAt) {
            throw new ApiError(
                400,
                alreadyDeletedMessage ?? `${entityName} is already deleted`,
            );
        }

        return entity;
    }
}
