import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SubjectService } from "../services/subject.service";
import { JwtGuard } from "src/core/guards/jwt.guard";
import { SubjectDto } from "../dtos/subject.dto";


@Controller('subject')
@ApiTags('Subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getListSubject () {
    return await this.subjectService.getListSubject()
  }

  @Post()
  @UseGuards(JwtGuard)
  async createSubject(@Body() data: SubjectDto) {
    return await this.subjectService.createSubject(data)
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateSubject (
    @Param('id') id: string,
    @Body() data: SubjectDto
  ) {
    return await this.subjectService.updateSubject(id, data)
  }

  @Delete('')
  @UseGuards(JwtGuard)
  async deleteSubject(@Query('id') id: string) {
    return await this.subjectService.deleteSubject(id)
  }
}