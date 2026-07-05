import { expect } from "chai";

import {
    createSemesterSchema,
    updateSemesterSchema,
} from "../src/modules/semesters/validators/semester.validator";
import { SemesterType } from "../src/shared/enums/semester-type.enum";

describe("Semester validator", () => {
    it("builds an update schema from a partial object schema", () => {
        const result = updateSemesterSchema.safeParse({
            name: "Semester 2",
        });

        expect(result.success).to.equal(true);
    });

    it("keeps create schema validation intact", () => {
        const result = createSemesterSchema.safeParse({
            name: "Semester 1",
            semesterNumber: 1,
            type: SemesterType.ODD,
            academicYear: "2026-27",
            course: "CS101",
            startDate: "2026-01-01",
            endDate: "2026-06-30",
            registrationStart: "2025-12-01",
            registrationEnd: "2025-12-15",
            examStart: "2026-06-01",
            examEnd: "2026-06-15",
            resultDate: "2026-06-20",
            isCurrent: false,
        });

        expect(result.success).to.equal(true);
    });
});
