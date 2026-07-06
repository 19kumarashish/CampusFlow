import { QueryFilter } from "mongoose";

import { AssignmentStatus } from "@/shared/enums/assignment-status.enum";

import { IAssignment } from "../models/assignment.interface";
import { Assignment } from "../models/assignment.model";
import { ISubmission } from "../models/submission.interface";
import { Submission } from "../models/submission.model";
import {
  GetAssignmentsQueryInput,
  GetSubmissionsQueryInput,
} from "../validators/assignment.validator";

class AssignmentRepository {
  /* -------------------------------------------------------------------------- */
  /*                            Assignment Methods                              */
  /* -------------------------------------------------------------------------- */

  // Create Assignment
  async createAssignment(
    data: Partial<IAssignment>,
  ) {
    return Assignment.create(data);
  }

  // Find Assignment By ID
  async findAssignmentById(
    id: string,
  ) {
    return Assignment.findById(id)
      .populate("subject")
      .populate({
        path: "faculty",
        populate: {
          path: "user",
        },
      })
      .populate("section")
      .populate("semester");
  }

  // Find Published Assignment
  async findPublishedAssignment(
    id: string,
  ) {
    return Assignment.findOne({
      _id: id,
      status:
        AssignmentStatus.PUBLISHED,
      deletedAt: null,
    });
  }

  // Find Assignments
  async findAssignments(
    query: GetAssignmentsQueryInput,
  ) {
    const {
      page,
      limit,
      subject,
      faculty,
      section,
      semester,
      status,
      sortBy,
      sortOrder,
    } = query;

    const filter: QueryFilter<IAssignment> =
      {
        deletedAt: null,
      };

    if (subject)
      filter.subject = subject;

    if (faculty)
      filter.faculty = faculty;

    if (section)
      filter.section = section;

    if (semester)
      filter.semester = semester;

    if (status)
      filter.status = status;

    const skip =
      (page - 1) * limit;

    const [
      assignments,
      total,
    ] = await Promise.all([
      Assignment.find(filter)
        .populate("subject")
        .populate("faculty")
        .populate("section")
        .populate("semester")
        .sort({
          [sortBy]:
            sortOrder === "asc"
              ? 1
              : -1,
        })
        .skip(skip)
        .limit(limit),

      Assignment.countDocuments(
        filter,
      ),
    ]);

    return {
      assignments,

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

  // Update Assignment
  async updateAssignment(
    id: string,
    data: Partial<IAssignment>,
  ) {
    return Assignment.findByIdAndUpdate(
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

  // Soft Delete Assignment
  async softDeleteAssignment(
    id: string,
  ) {
    return Assignment.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      {
        new: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                            Submission Methods                              */
  /* -------------------------------------------------------------------------- */

  // Create Submission
  async createSubmission(
    data: Partial<ISubmission>,
  ) {
    return Submission.create(data);
  }

  // Find Submission By ID
  async findSubmissionById(
    id: string,
  ) {
    return Submission.findById(id)
      .populate("assignment")
      .populate({
        path: "enrollment",
        populate: {
          path: "student",
        },
      });
  }

  // Find Student Submission
  async findStudentSubmission(
    assignmentId: string,
    enrollmentId: string,
  ) {
    return Submission.findOne({
      assignment:
        assignmentId,
      enrollment:
        enrollmentId,
    });
  }

  // Find Submissions
  async findSubmissions(
    query: GetSubmissionsQueryInput,
  ) {
    const {
      page,
      limit,
      assignment,
      enrollment,
      status,
      sortBy,
      sortOrder,
    } = query;

    const filter: QueryFilter<ISubmission> =
      {};

    if (assignment)
      filter.assignment =
        assignment;

    if (enrollment)
      filter.enrollment =
        enrollment;

    if (status)
      filter.status = status;

    const skip =
      (page - 1) * limit;

    const [
      submissions,
      total,
    ] = await Promise.all([
      Submission.find(filter)
        .populate("assignment")
        .populate("enrollment")
        .sort({
          [sortBy]:
            sortOrder === "asc"
              ? 1
              : -1,
        })
        .skip(skip)
        .limit(limit),

      Submission.countDocuments(
        filter,
      ),
    ]);

    return {
      submissions,

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

  // Grade Submission
  async gradeSubmission(
    id: string,
    data: Partial<ISubmission>,
  ) {
    return Submission.findByIdAndUpdate(
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
}

export const assignmentRepository =
  new AssignmentRepository();