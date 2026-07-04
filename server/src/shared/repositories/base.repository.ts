import { Document, Model } from "mongoose";

export abstract class BaseRepository<T extends Document> {
    constructor(protected model: Model<T>) { }

    async create(data: Partial<T>) {
        return this.model.create(data as T);
    }

    async findById(id: string) {
        return this.model.findById(id);
    }

    async updateById(id: string, data: Partial<T>) {
        return this.model.findByIdAndUpdate(
            id,
            {
                $set: data,
            },
            {
                new: true,
                runValidators: true,
            },
        );
    }

    async softDeleteById(id: string, statusValue: unknown = "INACTIVE") {
        return this.model.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: statusValue,
                    deletedAt: new Date(),
                },
            },
            {
                new: true,
                runValidators: true,
            },
        );
    }
}
