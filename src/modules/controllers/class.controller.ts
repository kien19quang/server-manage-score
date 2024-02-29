import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { ClassService } from "../services/class.service"
import { ClassDto, RegisterToClassDto, UpdateScoreDto } from "../dtos/class.dto"
import { JwtGuard } from "src/core/guards/jwt.guard"


@Controller('class')
@ApiTags('Class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getListClass () {
    return await this.classService.getListClass()
  }

  @Get('student')
  @UseGuards(JwtGuard)
  async getListClassStudent(@Query('semesterId') semesterId: string) {
    return await this.classService.getListClassStudent(semesterId)
  }

  @Get('teacher')
  @UseGuards(JwtGuard)
  async getListClassTeacher(@Query('teacherId') teacherId: string) {
    return await this.classService.getListClassTeacher(teacherId)
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getClassDetail(@Param('id') id: string) {
    return await this.classService.getClassDetail(id)
  }

  @Post()
  @UseGuards(JwtGuard)
  async createClass(@Body() data: ClassDto) {
    return await this.classService.createClass(data)
  }

  @Post('update-score') 
  @UseGuards(JwtGuard)
  async updateScore(@Body() data: UpdateScoreDto) {
    return await this.classService.updateScore(data)
  }

  @Post('register-to-class')
  @UseGuards(JwtGuard)
  async registerToClass(@Body() data: RegisterToClassDto) {
    return await this.classService.registerStudentToClass(data.studentId, data.classId)
  }

  @Post('cancel-register-to-class')
  @UseGuards(JwtGuard)
  async cancelRegistration(@Body() data: RegisterToClassDto) {
    return await this.classService.cancelRegistration(data.studentId, data.classId)
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateClass (
    @Param('id') id: string,
    @Body() data: ClassDto
  ) {
    return await this.classService.updateClass(id, data)
  }

  @Delete('')
  @UseGuards(JwtGuard)
  async deleteClass(@Query('id') id: string) {
    return await this.classService.deleteClass(id)
  }
}