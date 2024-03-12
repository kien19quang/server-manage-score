import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Class } from "src/schema/class.schema"
import { ClassDto, UpdateScoreDto } from "../dtos/class.dto"
import { Student } from "src/schema/student.schema"
import { Transcript } from "src/schema/transcript.schema"


@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<Class>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Transcript.name) private transcriptModel: Model<Transcript>,
  ) {}

  getListClass = async () => {
    return await this.classModel.find().sort({ createdAt: 'desc' }).populate(['teacher', 'subject', 'semester', 'students']).exec();
  }

  getListClassStudent = async (semesterId: string) => {
    return await this.classModel.find({ semester: semesterId }).populate(['teacher']).exec()
  }

  getListClassTeacher = async (teacherId: string) => {
    return await this.classModel.find({ teacher: teacherId }).populate(['subject', 'semester']).exec()
  }

  getClassDetail = async (classId: string) => {
    return await this.classModel.findById(classId).populate('students').exec()
  }

  createClass = async (data: ClassDto) => {
    const newClass = await this.classModel.create({
      title: data.title,
      teacher: data.teacherId,
      subject: data.subjectId,
      semester: data.semesterId,
      maxQuantityStudent: data.maxQuantityStudent
    })

    await newClass.populate(['teacher', 'subject', 'semester'])

    return newClass
  }

  updateClass = async (id: string, data: ClassDto) => {
    return await this.classModel.findByIdAndUpdate(id, {
      title: data.title,
      teacher: data.teacherId,
      subject: data.subjectId,
      semester: data.semesterId,
      maxQuantityStudent: data.maxQuantityStudent
    }, { new: true }).populate(['teacher', 'subject', 'semester', 'students']).exec()
  }

  deleteClass = async (id: string)  => {
    return await this.classModel.deleteOne({ _id: id })
  }

  registerStudentToClass = async (studentId: string, classId: string) => {
    const classInstance = await this.classModel.findById(classId);

    if (!classInstance) {
      throw new BadRequestException('Lớp học không tồn tại')
    }

    const studentInstance = await this.studentModel.findById(studentId);

    if (!studentInstance) {
      throw new BadRequestException('Sinh viên không tồn tại');
    }

    if (classInstance.students.length >= classInstance.maxQuantityStudent) {
      throw new BadRequestException('Lớp học đã đầy, không thể đăng ký thêm sinh viên');
    }
    const existingStudentIndex = classInstance.students.findIndex(student => (student as any) === studentId);
    if (existingStudentIndex === -1) {
      classInstance.students.push(studentId as any);
      await classInstance.save();
      studentInstance.classes.push(classId as any);
      await studentInstance.save();

      return classInstance
    } else {
      throw new BadRequestException('Sinh viên đã đăng ký trong lớp học này');
    }
  }

  async cancelRegistration(studentId: string, classId: string) {
    const classInstance = await this.classModel.findById(classId);

    if (!classInstance) {
      throw new BadRequestException('Lớp học không tồn tại');
    }

    // Tìm sinh viên với ID tương ứng
    const studentInstance = await this.studentModel.findById(studentId);

    if (!studentInstance) {
      throw new BadRequestException('Sinh viên không tồn tại');
    }

    // Kiểm tra xem sinh viên đã đăng ký trong lớp học này chưa
    const existingStudentIndex = classInstance.students.findIndex(student => (student as any) === studentId);
    if (existingStudentIndex !== -1) {
      // Nếu sinh viên đã đăng ký, loại bỏ sinh viên khỏi lớp học
      classInstance.students.splice(existingStudentIndex, 1);
      await classInstance.save();

      // Đồng thời cập nhật thông tin lớp học trong thông tin sinh viên
      const classIndex = studentInstance.classes.findIndex(cls => (cls as any) === classId);
      if (classIndex !== -1) {
        studentInstance.classes.splice(classIndex, 1);
        await studentInstance.save();
      }

      return classInstance
    } else {
      throw new BadRequestException('Sinh viên chưa đăng ký trong lớp học này');
    }
  }

  async updateScore(data: UpdateScoreDto) {
    const { classId, studentId, score, processScore } = data
    // Tìm lớp học với ID tương ứng
    const classInstance = await this.classModel.findById(classId);

    if (!classInstance) {
      throw new BadRequestException('Lớp học không tồn tại');
    }

    // Tìm sinh viên với ID tương ứng
    const studentInstance = await this.studentModel.findById(studentId);

    if (!studentInstance) {
      throw new BadRequestException('Sinh viên không tồn tại');
    }

    // Kiểm tra xem sinh viên có trong lớp học không
    const studentIndex = classInstance.students.findIndex((student: any)=> student === studentId);
    if (studentIndex === -1) {
      throw new BadRequestException('Sinh viên không học trong lớp này');
    }

    // Cập nhật điểm số của sinh viên
    const scoreIndex = classInstance.scores.findIndex(score => score.studentId === studentId);
    if (scoreIndex !== -1) {
      // Nếu đã có, cập nhật điểm số
      classInstance.scores[scoreIndex].score = score;
    } else {
      // Nếu chưa có, thêm bản ghi mới vào mảng scores
      classInstance.scores.push({ studentId: studentId, score: score, processScore: processScore });
    }

    const transcript = await this.transcriptModel.findOne({ subject: classInstance.subject, semester: classInstance.semester });
    if (transcript) {
      transcript.score = score;
      transcript.processScore = processScore;
      transcript.student = studentInstance._id as any
      await transcript.save()
    }
    else {
      const newTranscript = await this.transcriptModel.create({
        score: score,
        processScore: processScore,
        subject: classInstance.subject,
        semester: classInstance.semester,
        teacher: classInstance.teacher,
        student: studentInstance._id, 
      })

      studentInstance.transcript.push(newTranscript._id as any)
      await studentInstance.save()
    }

    await classInstance.save();

    await classInstance.populate('students')

    return classInstance
  }
}