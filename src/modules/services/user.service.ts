import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto, CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
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
    @InjectModel(Transcript.name) private readonly transcriptModel: Model<Transcript>,
  ) {}

  async getListAdmin() {
    return await this.adminModel.find().sort({ createdAt: 'desc' });
  }

  async getListTeacher() {
    return await this.teacherModel.find().sort({ createdAt: 'desc' });
  }

  async getListStudent() {
    const response = await this.studentModel.find().sort({ createdAt: 'desc' }).populate(['semester']).exec();
    return response;
  }

  async createAdmin(data: CreateUserDto) {
    const admin = await this.adminModel.findOne({
      email: data.email,
    });

    if (admin) throw new ConflictException('Email đã tồn tại');

    const countAdmin = await this.adminModel.countDocuments();

    const newAdmin = await this.adminModel.create({
      _id: `ADMIN_${countAdmin + 1}`,
      ...data,
    });

    return newAdmin;
  }

  async createTeacher(data: CreateUserDto) {
    const teacher = await this.teacherModel.findOne({
      email: data.email,
    });

    if (teacher) throw new ConflictException('Email đã tồn tại');

    const countTeacher = await this.teacherModel.countDocuments();

    const newTeacher = await this.teacherModel.create({
      _id: `T${countTeacher + 1}`,
      ...data,
    });

    return newTeacher;
  }

  async createStudent(data: CreateStudentDto) {
    const student = await this.studentModel.findOne({
      email: data.email,
    });

    if (student) throw new ConflictException('Email đã tồn tại');

    const countStudent = await this.studentModel.countDocuments();

    const newStudent = await this.studentModel.create({
      _id: `A${countStudent + 1}`,
      semester: data.semesterId,
      ...data,
    });

    await newStudent.populate('semester');

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
    const student = await this.studentModel
      .findOneAndUpdate(
        { _id: id },
        {
          ...data,
          semester: data.semesterId,
        },
        {
          new: true,
        },
      )
      .populate('semester');

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
    console.log(id);
    return await this.studentModel
      .findOne({
        _id: id,
      })
      .populate('semester')
      .exec();
  }

  async getTranscriptStudent(studentId: string) {
    return await this.transcriptModel.find({ student: studentId }).populate(['student', 'teacher', 'subject', 'semester']).exec();
  }

  async getFileUpload() {
    return {
      sensitive_operation: [
        {
          ip: '1.52.232.216',
          timestamp: 1740671187,
          operation: 'change_password',
          country: 'VN',
        },
        {
          ip: '1.52.232.216',
          timestamp: 1740671096,
          operation: 'change_email',
          country: 'VN',
        },
        {
          ip: '116.109.135.7',
          timestamp: 1740652744,
          operation: 'change_email',
          country: 'VN',
        },
        {
          ip: '116.109.135.7',
          timestamp: 1740652726,
          operation: 'change_password',
          country: 'VN',
        },
        {
          ip: '116.109.135.7',
          timestamp: 1740652707,
          operation: 'change_mobile_no',
          country: 'VN',
        },
        {
          ip: '14.229.25.239',
          timestamp: 1737560234,
          operation: 'change_mobile_no',
          country: 'VN',
        },
      ],
      login_history: [
        {
          ip: '1.52.232.216',
          source: 'FC Online M (VN)',
          timestamp: 1740672439,
          country: 'VN',
        },
        {
          ip: '1.52.232.216',
          source: 'FC Online M (VN)',
          timestamp: 1740672439,
          country: 'VN',
        },
        {
          ip: '1.52.232.216',
          country: 'VN',
          timestamp: 1740661175,
          source: 'FC Online M (VN)',
        },
      ],
      game_otp_configs: {
        TW: {
          '32775': {
            status: 0,
            sms_available: false,
            name: '英雄聯盟',
            authenticator_available: true,
          },
        },
        MO: {
          '32775': {
            status: 0,
            sms_available: false,
            name: '英雄聯盟',
            authenticator_available: true,
          },
        },
        VN: {
          '32787': {
            status: 0,
            sms_available: false,
            name: 'Liên Minh Huyền Thoại',
            authenticator_available: true,
          },
        },
        HK: {
          '32775': {
            status: 0,
            sms_available: false,
            name: '英雄聯盟',
            authenticator_available: true,
          },
        },
        TH: {
          '32786': {
            status: 0,
            sms_available: false,
            name: 'League of Legends',
            authenticator_available: true,
          },
        },
        PH: {
          '32774': {
            status: 0,
            sms_available: false,
            name: 'League of Legends',
            authenticator_available: true,
          },
        },
      },
      country: 'VN',
      init_ip: '14.232.245.149',
      user_info: {
        status: 1,
        acc_country: 'VN',
        uid: 449707448,
        suspicious: false,
        mobile_no: '****6774',
        country_code: '84',
        authenticator_algorithm: 2,
        mobile_binding_status: 0,
        send_otp_methods: {
          region_br: {
            options: ['sms_gateway'],
          },
          region_my: {
            options: ['sms_gateway'],
          },
          region_id: {
            options: ['whatsapp_gateway', 'sms_gateway'],
          },
          region_sg: {
            options: ['sms_gateway'],
          },
          region_hk: {
            options: ['sms_gateway'],
          },
          region_ph: {
            options: ['sms_gateway'],
          },
          region_th: {
            options: ['sms_gateway'],
          },
          region_tw: {
            options: ['sms_gateway'],
          },
          region_vn: {
            options: [],
          },
          region_cl: {
            options: ['sms_gateway'],
          },
          region_mx: {
            options: ['sms_gateway'],
          },
        },
        email_verified_time: 1740671138,
        email: 'qua****@gmail.com',
        username: 'huonggiangboo',
        shell: 0,
        password_s: 4,
        email_v: 1,
        authenticator_enable: 0,
        nickname: '',
        two_step_verify_enable: 1,
        email_verify_available: true,
        avatar: 'https://cdngarenanow-a.akamaihd.net/gxx/resource/avatar/0.jpg',
        signature: '',
        fb_account: null,
      },
    };
  }
}
