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

  async getFileUpload() {
    const response = await axios.request({
      url: 'https://scontent-ham3-1.xx.fbcdn.net/v/t39.30808-1/350788057_579366280962856_4571341295059703285_n.png?stp=dst-png_s200x200&_nc_cat=107&ccb=1-7&_nc_sid=79bf43&_nc_eui2=AeEpHfi5uwoKeLsUdneqeojfsdJP557OSEix0k_nns5ISEM7GtsVgsopmLtlbhaRHTYRpFdSK1o3CWXnXZWTzxXh&_nc_ohc=_ql9eyfdb0AQ7kNvgHw5j76&_nc_zt=24&_nc_ht=scontent-ham3-1.xx&edm=AOf6bZoEAAAA&_nc_gid=AgjBCHl7uCFl-NlAiEw03qA&oh=00_AYAOMDLjGHCLnKONXek93fAWlEPZF9LauTjvkxvxA8VC-Q&oe=67C4B5AD',
      method: 'GET',
      responseType: 'arraybuffer',
    });
    const fileBuffer = Buffer.from(response.data, 'binary');
    const buffer = fileBuffer;
    const originalname = `123`;
    const size = Buffer.byteLength(buffer);
    return {
      originalname: originalname,
      buffer: buffer,
      size: size,
    };
  }
}
