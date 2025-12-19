import { inject } from "@angular/core";
import { Language } from "../../../../../core/services/language";

export interface AgeGroupModel {
    id: number;
    lock: boolean;
    name: string;
    createdAt: Date;
}