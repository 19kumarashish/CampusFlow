import { QueryFilter } from "mongoose";

import { IAttendance } from "../models/attendance.interface";
import { Attendance } from "../models/attendance.model";
import { GetAttendanceQueryInput } from "../validators/attendance.validator";

class AttendanceRepository {
    async create(
        data: Partial<IAttendance>,
    ) {
        return Attendance.create(data);
    }
    async findById(id: string) {
        return Attendance.findById(id)
            .populate({
                path: "enrollment",
                populate: [
                    {
                        path: "student",
                        select:
                            "rollNumber user",
                    },
                    {
                        path: "section",
                        select:
                            "name classroom",
                    },
                ],
            })
            .populate({
                path: "subject",
                select:
                    "name code",
            })
            .populate({
                path: "faculty",
                populate: {
                    path: "user",
                    select:
                        "firstName lastName",
                },
            });
    }
    async findDuplicateAttendance(
        enrollmentId: string,
        subjectId: string,
        lectureNumber: number,
        date: Date,
    ) {
        return Attendance.findOne({
            enrollment: enrollmentId,
            subject: subjectId,
            lectureNumber,
            date,
        });
    }
    async findBySubject(
        subjectId: string,
    ) {
        return Attendance.find({
            subject: subjectId,
        }).sort({
            date: -1,
        });
    }
    async findByEnrollment(
        enrollmentId: string,
    ) {
        return Attendance.find({
            enrollment: enrollmentId,
        })
            .populate({
                path: "enrollment",
            })
            .populate("subject")
            .populate("faculty")
            .sort({
                date: -1,
            });
    }
    async findAll(
        query: GetAttendanceQueryInput,
    ) {
        const {
            page,
            limit,
            enrollment,
            subject,
            faculty,
            date,
            status,
            sortBy,
            sortOrder,
        } = query;

        const filter:
            QueryFilter<IAttendance> = {};

        if (enrollment) {
            filter.enrollment =
                enrollment;
        }

        if (subject) {
            filter.subject =
                subject;
        }

        if (faculty) {
            filter.faculty =
                faculty;
        }

        if (date) {
            filter.date = new Date(
                date,
            );
        }

        if (status) {
            filter.status =
                status;
        }

        const skip =
            (page - 1) * limit;

        const [attendance, total] =
            await Promise.all([
                Attendance.find(filter)
                    .populate({
                        path:
                            "enrollment",
                    })
                    .populate(
                        "subject",
                    )
                    .populate(
                        "faculty",
                    )
                    .sort({
                        [sortBy]:
                            sortOrder === "asc"
                                ? 1
                                : -1,
                    })
                    .skip(skip)
                    .limit(limit),

                Attendance.countDocuments(
                    filter,
                ),
            ]);

        return {
            attendance,

            pagination: {
                total,

                page,

                limit,

                totalPages:
                    Math.ceil(
                        total / limit,
                    ),

                hasNextPage:
                    page <
                    Math.ceil(
                        total / limit,
                    ),

                hasPreviousPage:
                    page > 1,
            },
        };
    }
    async updateById(
        id: string,
        data: Partial<IAttendance>,
    ) {
        return Attendance.findByIdAndUpdate(
            id,
            {
                $set: data,
            },
            {
                new: true,
                runValidators: true,
            },
        )
            .populate(
                "enrollment",
            )
            .populate("subject")
            .populate("faculty");
    }
    async deleteById(
        id: string,
    ) {
        return Attendance.findByIdAndDelete(
            id,
        );
    }
}

export const attendanceRepository =
    new AttendanceRepository();