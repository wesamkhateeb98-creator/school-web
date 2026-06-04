export interface StaffProfile {
  fullName: string;
  phoneNumber: string;
  role: number;
  permissions: number[];
}

export interface StaffProfileResponse {
  profile: StaffProfile;
  semesterForOpenedAcademicYear: any | null;
}
