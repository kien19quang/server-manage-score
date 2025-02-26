import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ClassDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  maxQuantityStudent: number

  @ApiProperty()
  @IsNotEmpty()
  teacherId: string;

  @ApiProperty()
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty()
  @IsNotEmpty()
  semesterId: string;
}

export class RegisterToClassDto {
  @ApiProperty()
  @IsNotEmpty()
  classId: string;

  @ApiProperty()
  @IsNotEmpty()
  studentId: string;
}

export class UpdateScoreDto {
  @ApiProperty()
  @IsNotEmpty()
  classId: string;

  @ApiProperty()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  processScore
}