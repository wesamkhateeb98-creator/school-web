export class SubjectMarkDistributionViewModel {
  constructor(
    public id: number,
    public subjectAgeGroupId: number,
    public name: string,
    public percentage: number,
    public markType: number,
    public createdAt: Date
  ) {}
}
