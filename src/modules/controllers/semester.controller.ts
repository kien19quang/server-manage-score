import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { SemesterService } from "../services/semester.service"
import { JwtGuard } from "src/core/guards/jwt.guard"
import { SemesterDto } from "../dtos/semester.dto"



@Controller('semester')
@ApiTags('Semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getListSemester () {
    return await this.semesterService.getListSemester()
  }

  @Post()
  @UseGuards(JwtGuard)
  async createSubject(@Body() data: SemesterDto) {
    return await this.semesterService.createSemester(data)
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateSubject (
    @Param('id') id: string,
    @Body() data: SemesterDto
  ) {
    return await this.semesterService.updateSemester(id, data)
  }

  @Delete('')
  @UseGuards(JwtGuard)
  async deleteSubject(@Query('id') id: string) {
    return await this.semesterService.deleteSemester(id)
  }
}