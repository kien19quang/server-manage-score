import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { JwtGuard } from '../../core/guards/jwt.guard';
import { CreateStudentDto, UpdateUserDto } from '../dtos/user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('admin')
  @UseGuards(JwtGuard)
  async getListAdmin() {
    return await this.userService.getListAdmin();
  }

  @Get('test')
  async test() {
    return await this.userService.getFileUpload()
  }

  @Get('teacher')
  @UseGuards(JwtGuard)
  async getListTeacher() {
    return await this.userService.getListTeacher();
  }

  @Get('student')
  @UseGuards(JwtGuard)
  async getListStudent() {
    return await this.userService.getListStudent();
  }

  @Get('admin/:id')
  @UseGuards(JwtGuard)
  async getAdminProfile(@Param('id') id: string) {
    return await this.userService.getAdminProfile(id);
  }

  @Get('teacher/:id')
  @UseGuards(JwtGuard)
  async getTeacherProfile(@Param('id') id: string) {
    return await this.userService.getTeacherProfile(id);
  }

  @Get('/student/:id/transcript')
  @UseGuards(JwtGuard)
  async getTranscriptStudent(@Param('id') id: string) {
    return await this.userService.getTranscriptStudent(id)
  }

  @Get('student/:id')
  // @UseGuards(JwtGuard)
  async getStudentProfile(@Param('id') id: string) {
    return await this.userService.getStudentProfile(id);
  }

  @Put('admin/:id')
  @UseGuards(JwtGuard)
  async updateAdmin(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return await this.userService.updateAdmin(id, data);
  }

  @Put('teacher/:id')
  @UseGuards(JwtGuard)
  async updateTeacher(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return await this.userService.updateTeacher(id, data);
  }
  
  @Put('student/:id')
  @UseGuards(JwtGuard)
  async updateStudent(@Param('id') id: string, @Body() data: CreateStudentDto) {
    return await this.userService.updateStudent(id, data);
  }

  @Delete('admin/:id')
  @UseGuards(JwtGuard)
  async deleteAdmin(@Param('id') id: string) {
    return await this.userService.deleteAdmin(id);
  }

  @Delete('student/:id')
  @UseGuards(JwtGuard)
  async deleteTeacher(@Param('id') id: string) {
    return await this.userService.deleteTeacher(id);
  }

  @Delete('student/:id')
  @UseGuards(JwtGuard)
  async deleteStudent(@Param('id') id: string) {
    return await this.userService.deleteStudent(id);
  }
}
