import { PhrasesType } from "../../../core/resource/phrases";

export interface NavItemViewModel{
    url: string;
    name: PhrasesType;
    isSelected: boolean;
    icon:string;
}