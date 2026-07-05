import { Types } from "mongoose";

import { facultyRepository as defaultFacultyRepository } from "@/modules/faculty/repositories/faculty.repository";
import { semesterRepository as defaultSemesterRepository } from "@/modules/semesters/repositories/semester.repository";
import { ApiError } from "@/utils/ApiError";

import { ISection } from "../models/section.interface";
import { sectionRepository as defaultSectionRepository } from "../repositories/section.repository";
import {
  CreateSectionInput,
  GetSectionsQueryInput,
  UpdateSectionInput,
} from "../validators/section.validator";

export class SectionService {
  constructor(
    private sectionRepository = defaultSectionRepository,
    private semesterRepository = defaultSemesterRepository,
    private facultyRepository = defaultFacultyRepository
  ) {}

  // ======================
  // Create Section
  // ======================

  async createSection(data: CreateSectionInput) {
    const semester = await this.semesterRepository.findById(
      data.semester
    );

    if (!semester) {
      throw new ApiError(404, "Semester not found");
    }

    const faculty = await this.facultyRepository.findById(
      data.facultyAdvisor
    );

    if (!faculty) {
      throw new ApiError(404, "Faculty advisor not found");
    }

    const existingSection =
      await this.sectionRepository.findByNameAndSemester(
        data.name,
        data.semester
      );

    if (existingSection) {
      throw new ApiError(
        409,
        "Section already exists for this semester"
      );
    }

    return this.sectionRepository.create({
      ...data,
      semester: new Types.ObjectId(data.semester),
      facultyAdvisor: new Types.ObjectId(data.facultyAdvisor),
    });
  }

  // ======================
  // Get All Sections
  // ======================

  async getSections(query: GetSectionsQueryInput) {
    return this.sectionRepository.findAll(query);
  }

  // ======================
  // Get Section By ID
  // ======================

  async getSectionById(id: string) {
    const section = await this.sectionRepository.findById(id);

    if (!section) {
      throw new ApiError(404, "Section not found");
    }

    return section;
  }

  // ======================
  // Update Section
  // ======================

  async updateSection(
    id: string,
    data: UpdateSectionInput
  ) {
    const section = await this.sectionRepository.findById(id);

    if (!section) {
      throw new ApiError(404, "Section not found");
    }

    const semesterId =
      data.semester ?? section.semester._id.toString();

    if (data.semester) {
      const semester =
        await this.semesterRepository.findById(
          data.semester
        );

      if (!semester) {
        throw new ApiError(404, "Semester not found");
      }
    }

    if (data.facultyAdvisor) {
      const faculty =
        await this.facultyRepository.findById(
          data.facultyAdvisor
        );

      if (!faculty) {
        throw new ApiError(
          404,
          "Faculty advisor not found"
        );
      }
    }

    if (
      data.name &&
      (data.name !== section.name ||
        semesterId !== section.semester._id.toString())
    ) {
      const duplicate =
        await this.sectionRepository.findByNameAndSemester(
          data.name,
          semesterId
        );

      if (
        duplicate &&
        duplicate._id.toString() !== id
      ) {
        throw new ApiError(
          409,
          "Section already exists for this semester"
        );
      }
    }

    const updateData: Partial<ISection> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.semester !== undefined) updateData.semester = new Types.ObjectId(data.semester);
    if (data.capacity !== undefined) updateData.capacity = data.capacity;
    if (data.classroom !== undefined) updateData.classroom = data.classroom;
    if (data.facultyAdvisor !== undefined) updateData.facultyAdvisor = new Types.ObjectId(data.facultyAdvisor);
    if (data.status !== undefined) updateData.status = data.status;

    return this.sectionRepository.updateById(id, updateData);
  }

  // ======================
  // Delete Section
  // ======================

  async deleteSection(id: string) {
    const section = await this.sectionRepository.findById(id);

    if (!section) {
      throw new ApiError(404, "Section not found");
    }

    if (section.deletedAt) {
      throw new ApiError(
        400,
        "Section already deleted"
      );
    }

    return this.sectionRepository.softDeleteById(id);
  }
}

export const sectionService = new SectionService();