import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { CreateStudentDto, CreateUserDto } from "../dtos/user.dto";
import { LoginDto } from "../dtos/auth.dto";
import { RefreshJwtGuard } from "src/core/guards/refresh.guard";


@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('admin/register')
  async registerAdmin(@Body() data: CreateUserDto) {
    return await this.userService.createAdmin(data);
  }

  @Post('admin/login')
  async login(@Body() data: LoginDto) {
    return await this.authService.adminLogin(data);
  }

  @Post('teacher/register')
  async registerTeacher(@Body() data: CreateUserDto) {
    return await this.userService.createTeacher(data);
  }

  @Post('teacher/login')
  async loginTeacher(@Body() data: LoginDto) {
    return await this.authService.teacherLogin(data);
  }

  @Post('student/register')
  async registerStudent(@Body() data: CreateStudentDto) {
    return await this.userService.createStudent(data)
  }

  @Post('student/login')
  async studentLogin(@Body() data: LoginDto) {
    return await this.authService.studentLogin(data);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  async refreshToken(@Request() req: Record<string, any>) {
    return await this.authService.refreshToken(req.user);
  }
}
