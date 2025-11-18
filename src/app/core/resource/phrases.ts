export const Phrases: Record<'ar' | 'en', Record<PhrasesType, string>> = {
    ar:{
        'name':"الاسم",
        "academic_year_title": "السنة الدراسية",
        "settings": "الإعدادات",
        "created_at_title":"تاريخ الإنشاء",
        "language":"اللغة",
        "arabic":"العربية",
        "english":"الأنكليزية",
        "color":"اللون",
        "green_color":"أخضر",
        "blue_color":"أزرق",
        "theme":"الثمة",
        "dark_mode":"الوضع الداكن",
        "light_mode":"الوضع الفاتح",
        "system_mode":"وضع النظام",
        'action':'الإجراءات',
        'add_academic_year':'إضافة السنة الأكادمية',
        'field_required':"الحقل مطلوب.",
        'year_greater_than_or_equal_2025': 'التاريخ يجب أن يكون أكبر أو يساوي 2025.',
        "do_you_want_delete_question":"هل أنت متأمد من أنك تريد إتمام عملية الحذف؟",
        "delete_academic_year":"حذف السنة الدراسية",
        "add": "إضافة",
        "update": 'تعديل',
        "delete": 'حذف',
        'cancel': 'إلغاء',
        'details_academic_year': 'تفاصيل السنة الأكاديمية',
        'semester_title': 'الفصل',
        'start_date_title':"تاريخ البداية",
        'end_date_title':"تاريخ النهاية",
        'min_length_3': 'طول النص يجب أن لا يقل عن 3 محارف',
        'add_semester':'إضافة فضل دراسي',
        'start_date_must_less_than_end_date':'تاريخ البداية يجب أن يكون أصغر من تاريخ النهاية',
        'ok':"نعم",
        'http_401':'الرجاء إعادة تسجيل الدخول'
    },
    en:{
        'name':"Name",
        "academic_year_title": "Academic Year",
        "settings": "Settings",
        "created_at_title": "Created At",
        "language":"Language",
        "arabic":"Arabic",
        "english":"English",
        "color":"Color",
        "green_color":"Green color",
        "blue_color":"Blue_color",
        "theme":"Theme",
        "dark_mode":"Dark mode",
        "light_mode":"Light mode",
        "system_mode":"System mode",
        'action':'Action',
        'add_academic_year': 'Add academic year',
        'field_required': 'The field is required.',
        'year_greater_than_or_equal_2025': 'The year must be greater than or equal 2025.',
        "do_you_want_delete_question":"Do you want to complete the deletion process?",
        "delete_academic_year":"Delete academic year.",
        "add": "Add",
        "update": 'Update',
        "delete": 'Delete',
        'cancel': 'Cancel',
        'details_academic_year': 'Academic year details',
        'semester_title': 'Semester',
        'start_date_title':"Start Date",
        'end_date_title':"End Date",
        'min_length_3': 'The length text must be greater than or equal 3',
        'add_semester':'Add semester',
        'start_date_must_less_than_end_date':'The start date must be less than the end date.',
        'ok': 'Ok',
        'http_401':'please login again'
    }
}

export type PhrasesType =  
LoginPhrases | 
AcademicYearPhrases|
SettingsPhrases|
ValidationMessagePhrases|
ButtonPhrases|
SemesterPhrases|
httpErrors; 


export type LoginPhrases = 
'name' 

export type SettingsPhrases = 
'settings'|
'language'|
"arabic"|
"english"|
"theme"|
'light_mode'|
'dark_mode'|
'system_mode'|
"color"|
'green_color'|
'blue_color';

export type AcademicYearPhrases = 
'academic_year_title'|
'created_at_title'|
'action'|
'add_academic_year'|
'delete_academic_year'|
'do_you_want_delete_question'|
'details_academic_year';

export type ValidationMessagePhrases = 
'field_required'|
'year_greater_than_or_equal_2025'|
'min_length_3'|
'start_date_must_less_than_end_date';

export type ButtonPhrases = 
'add' | 'update' | 'delete' | 'cancel' | 'ok';

export type SemesterPhrases = 
'semester_title'|
'start_date_title'|
'end_date_title'|
'add_semester'
;

export type httpErrors = 
'http_401'
;