import { time24hTo12 } from "../../../../../../../core/consts"
import { Language } from "../../../../../../../core/services/language"

export class PeriodViewModel {
  constructor(
    public id: number,
    public lessonNumber: number,
    public fromTime: string,
    public toTime: string,
    public createdAt: Date = new Date()
  ) {}
}