import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../dtos/auth.dto";
import { ERole } from "../enums/common.enum";

const EXPRIRE_TIME = 60 * 60 * 24 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async adminLogin(data: LoginDto) {
    const admin = await this.validateAdmin(data);
    const payload = {
      email: admin.email,
      _id: admin._id,
      role: ERole.admin,
      sub: {
        name: admin.name,
      },
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET_KEY,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_TOKEN,
      }),
    ]);

    return {
      admin,
      role: ERole.admin,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: new Date().setTime(new Date().getTime() + EXPRIRE_TIME),
    };
  }

  async teacherLogin(data: LoginDto) {
    console.log(data)
    const teacher = await this.validateTeacher(data);
    const payload = {
      email: teacher.email,
      _id: teacher._id,
      role: ERole.teacher,
      sub: {
        name: teacher.name,
      },
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET_KEY,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_TOKEN,
      }),
    ]);

    return {
      teacher,
      role: ERole.teacher,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: new Date().setTime(new Date().getTime() + EXPRIRE_TIME),
    };
  }

  async studentLogin(data: LoginDto) {
    const student = await this.validateStudent(data)

    const payload = {
      email: student.email,
      _id: student._id,
      role: ERole.student,
      sub: {
        name: student.name,
      },
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_TOKEN,
      }),
    ]);

    return {
      student,
      role: ERole.student,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: new Date().setTime(new Date().getTime() + EXPRIRE_TIME),
    };
  }

  async validateAdmin(dto: LoginDto) {
    const admin = await this.userService.findByEmailAdmin(dto.email);

    if (!admin) throw new UnauthorizedException('Người dùng không tồn tại');

    if (admin.password !== dto.password) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    return admin;
  }

  async validateTeacher(dto: LoginDto) {
    const teacher = await this.userService.findByEmailTeacher(dto.email);

    if (!teacher) throw new UnauthorizedException('Người dùng không tồn tại');

    if (teacher.password !== dto.password) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    return teacher;
  }

  async validateStudent(dto: LoginDto) {
    const student = await this.userService.findByEmailStudent(dto.email);

    if (!student) throw new UnauthorizedException('Người dùng không tồn tại');

    if (student.password !== dto.password) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    return student;
  }

  async refreshToken(user: any) {
    const payload = {
      email: user.email,
      sub: {
        ...user.sub
      },
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET_KEY,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_TOKEN,
      }),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: new Date().setTime(new Date().getTime() + EXPRIRE_TIME),
    };
  }
}
