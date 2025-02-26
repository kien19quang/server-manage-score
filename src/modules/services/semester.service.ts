import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Semester } from "src/schema/semester.schema"
import { SemesterDto } from "../dtos/semester.dto"

@Injectable()
export class SemesterService {
  constructor(
    @InjectModel(Semester.name) private readonly semesterModel: Model<Semester>,
  ) {}

  getListSemester = async () => {
    return await this.semesterModel.find().sort({ createdAt: 'desc' })
  }

  createSemester = async (data: SemesterDto) => {
    return await this.semesterModel.create(data)
  }

  updateSemester = async (id: string, data: SemesterDto) => {
    return await this.semesterModel.findByIdAndUpdate(id, data, { new: true })
  }

  deleteSemester = async (id: string)  => {
    return await this.semesterModel.deleteOne({ _id: id })
  }
}