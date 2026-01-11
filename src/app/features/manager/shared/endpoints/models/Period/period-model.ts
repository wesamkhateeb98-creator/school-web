
export class PeriodModel {
  constructor(
    public id: number,
    public lessonNumber: number,
    public fromTime: string,
    public toTime: string,
    public createdAt: Date = new Date()
  ) {}
}