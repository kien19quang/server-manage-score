import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Subject } from "src/schema/subject.schema";
import { SubjectDto } from "../dtos/subject.dto";

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name) private readonly subjectModel: Model<Subject>,
  ) {}

  getListSubject = async () => {
    return await this.subjectModel.find().sort({ createdAt: 'desc' })
  }

  createSubject = async (data: SubjectDto) => {
    return await this.subjectModel.create(data)
  }

  updateSubject = async (id: string, data: SubjectDto) => {
    return await this.subjectModel.findByIdAndUpdate(id, data, { new: true })
  }

  deleteSubject = async (id: string)  => {
    return await this.subjectModel.deleteOne({ _id: id })
  }
}