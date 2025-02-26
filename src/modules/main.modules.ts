import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, AdminSchema } from "src/schema/admin.schema";
import { Student, StudentSchema } from "src/schema/student.schema";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { JwtService } from "@nestjs/jwt";
import { AuthController } from "./controllers/auth.controller";
import { UserController } from "./controllers/user.controller";
import { Teacher, TeacherSchema } from "src/schema/teacher.schema";
import { Subject, SubjectSchema } from "src/schema/subject.schema";
import { SubjectController } from "./controllers/subject.controller";
import { SubjectService } from "./services/subject.service";
import { Semester, SemesterSchema } from "src/schema/semester.schema";
import { SemesterController } from "./controllers/semester.controller";
import { SemesterService } from "./services/semester.service";
import { Class, ClassSchema } from "src/schema/class.schema";
import { ClassController } from "./controllers/class.controller";
import { ClassService } from "./services/class.service";
import { Transcript, TranscriptSchema } from "src/schema/transcript.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Semester.name, schema: SemesterSchema },
      { name: Class.name, schema: ClassSchema },
      { name: Transcript.name, schema: TranscriptSchema },
    ])
  ],
  controllers: [AuthController, UserController, SubjectController, SemesterController, ClassController],
  providers: [AuthService, UserService, JwtService, SubjectService, SemesterService, ClassService],
})
export class MainModule {}
