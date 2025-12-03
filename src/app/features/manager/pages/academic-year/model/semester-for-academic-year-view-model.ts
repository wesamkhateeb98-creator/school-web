
export interface SemesterForAcademicYearViewModel
{
    id:number,
    startDate:Date,
    endDate:Date,
    semesterId:number,
    semesterName:string,
    createdAt:Date,
}

export interface SemesterForAcademicYearModel
{
    id:number,
    startDate:string,
    endDate:string,
    semesterId:number,
    semesterName:string,
    createdAt:Date,
}