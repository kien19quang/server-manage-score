import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto, CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import axios from 'axios';
import { Admin } from 'src/schema/admin.schema';
import { Student } from 'src/schema/student.schema';
import { Teacher } from 'src/schema/teacher.schema';
import { Transcript } from 'src/schema/transcript.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    @InjectModel(Transcript.name) private readonly transcriptModel: Model<Transcript>
  ) {}

  async getListAdmin() {
    return await this.adminModel.find().sort({ createdAt: 'desc' });
  }

  async getListTeacher() {
    return await this.teacherModel.find().sort({ createdAt: 'desc' })
  }

  async getListStudent() {
    const response = await this.studentModel.find().sort({ createdAt: 'desc' }).populate(['semester']).exec()
    return response
  }

  async createAdmin(data: CreateUserDto) {
    const admin = await this.adminModel.findOne({
      email: data.email,
    });

    if (admin) throw new ConflictException('Email đã tồn tại');

    const countAdmin = await this.adminModel.countDocuments()

    const newAdmin = await this.adminModel.create({
      _id: `ADMIN_${countAdmin + 1}`,
      ...data
    });

    return newAdmin;
  }

  async createTeacher(data: CreateUserDto) {
    const teacher = await this.teacherModel.findOne({
      email: data.email,
    });

    if (teacher) throw new ConflictException('Email đã tồn tại');

    const countTeacher = await this.teacherModel.countDocuments()

    const newTeacher = await this.teacherModel.create({
      _id: `T${countTeacher + 1}`,
      ...data
    });

    return newTeacher;
  }

  async createStudent(data: CreateStudentDto) {
    const student = await this.studentModel.findOne({
      email: data.email,
    });

    if (student) throw new ConflictException('Email đã tồn tại');

    const countStudent = await this.studentModel.countDocuments()

    const newStudent = await this.studentModel.create({
      _id: `A${countStudent + 1}`,
      semester: data.semesterId,
      ...data,
    });

    await newStudent.populate('semester')

    return newStudent;
  }

  async updateAdmin(id: string, data: UpdateUserDto) {
    const admin = await this.adminModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    return admin;
  }

  async updateTeacher(id: string, data: UpdateUserDto) {
    const teacher = await this.teacherModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    return teacher;
  }

  async updateStudent(id: string, data: CreateStudentDto) {
    const student = await this.studentModel.findOneAndUpdate({ _id: id }, {
      ...data,
      semester: data.semesterId
    }, {
      new: true,
    }).populate('semester');

    return student;
  }

  async deleteAdmin(id: string) {
    return await this.adminModel.deleteOne({ _id: id });
  }

  async deleteTeacher(id: string) {
    return await this.teacherModel.deleteOne({ _id: id });
  }

  async deleteStudent(id: string) {
    return await this.studentModel.deleteOne({ _id: id });
  }

  async findByEmailAdmin(email: string) {
    return await this.adminModel.findOne({ email: email });
  }

  async findByEmailTeacher(email: string) {
    return await this.teacherModel.findOne({ email: email });
  }

  async findByEmailStudent(email: string) {
    return await this.studentModel.findOne({ email: email });
  }

  async getAdminProfile(id: string) {
    return await this.adminModel.findOne({
      _id: id,
    });
  }

  async getTeacherProfile(id: string) {
    return await this.teacherModel.findOne({
      _id: id,
    });
  }

  async getStudentProfile(id: string) {
    console.log(id)
    return await this.studentModel.findOne({
      _id: id,
    }).populate('semester').exec();
  }

  async getTranscriptStudent(studentId: string) {
    return await this.transcriptModel.find({ student: studentId }).populate(['student', 'teacher', 'subject', 'semester']).exec()
  }
}
