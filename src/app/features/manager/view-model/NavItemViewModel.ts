import { PhrasesType } from "../../../core/resource/phrases";

export interface NavItemViewModel{
    name: PhrasesType;
    icon:string;
    url?: string;
    subItem?: NavItemViewModel[];
    isExpended: boolean;
}