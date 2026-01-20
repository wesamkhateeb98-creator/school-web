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
        'update_academic_year':'تعديل السنة الأكادمية',
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
        'max_length_30': 'طول النص يجب ألا يتجاوز 30 محرف',
        'max_length_100': 'طول النص يجب ألا يتجاوز 100 محرف',
        'add_semester':'إضافة فضل دراسي',
        'update_semester':'تعديل فضل دراسي',
        'start_date_must_less_than_end_date':'تاريخ البداية يجب أن يكون أصغر من تاريخ النهاية',
        'ok':"نعم",
        'http_401':'الرجاء إعادة تسجيل الدخول',
        'http_403':'ليس لديك صلاحية الوصول',
        'http_404':'الخدمة غير موجودة',
        'http_500':'خطأ في السيرفر',
        'network_down': 'الشبكة مقطوعة',
        'server_error': 'خطأ من المخدم',
        "success":'تمت العملية بنجاح',
        'close':'إغلاق',
        'of':'من',
        'login': 'تسجيل الدخول',
        'logout':'تسجيل خروج',
        'denied_title':"مرفوض",
        'denied_header':'الوصول إلى واجهه التحكم غير مسموح',
        'denied_content':"ليس لديك صلاحية الوصول إلى لوحة التحكم. هذه المنطقة مخصصة للاشخاص المصرح لهم فقط.",
        'click_here_to_login_screen': 'انقر هنا للذهاب إلى واجهه تسجيل الدخول',
        'delete_semester': 'حذف الفصل',
        'age_group_title': 'المرحلة العمرية',
        'add_age_group': 'إضافة مرحلة عمرية',
        'delete_age_group': 'حذف مرحلة عمرية',
        'update_age_group': 'تعديل مرحلة عمرية',
        'subject_title':'المادة',
        'add_subject':'إضافة مادة',
        'update_subject':'تعديل مادة',
        'delete_subject': 'حذف مادة',
        'description_title': 'الوصف',
        'registrations_title': 'تسجيلات',
        'filter':'فلتر',
        'user_title':'المستخدمين',
        'students_title':'الطلاب',
        'teachers_title':'المدرسين',
        'managerial_title': 'الكادر الإداري',
        'father_name_title':'اسم الأب',
        'mother_name_title':'اسم الأم',
        'phonenumber_title':'رقم الهاتف',
        'address_title':'العنوان',
        'birthday_title': 'تاريخ الميلاد',
        'full_name_title':'الاسم الكامل',
        'max_length_50':'النص يجب أن يكون أصغر من 50 محرف.',
        'year_less_than_current_year':'السنة يجب أن تكون أصغر من السنة الحالية',
        'number_digit_between_7_10':'عدد الأرقام يجب أن يكون من 7 إلى ال 10',
        'all_title': 'الكل',
        'add_teacher':'إضافة مدرس',
        'update_teacher': 'تعديل مدرس',
        'administrative_staff_title':'الكادر الإداري',
        'permissions_title': 'الصلاحيات',
        'delete_staff': 'حذف كادر إداري',
        'update_administrative_staff':'تعديل كادر إداري',
        'add_administrative_staff': 'إضافة كادر إداري',
        'educational_supervisor_title':'المشرف التربوي',
        'registrar_title':'أمين السر',
        'delete_class_confirm':'حذف الصف',
        'section_title':'الشعبة',
        'add_class':'إضافة صف',
        'update_class':"تعديل صف",
        'classes_title':'الصفوف',
        'min_number_1':'الرقم المخل يجب أن يكون أكبر من 1',
        'verification-code':'رمز التحقق',
        'code':'الرمز',
        'copy':'نسخ',
        'generate-code':'إنشاء رمز',
        'no-code-available':'لا يوجد رمز متاح.',
        "validation_phonenumber_pattern": "يجب أن يكون رقم الهاتف بطول 10 أرقام ويبدأ بـ 09",
        "validation_password_pattern": "يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة، أرقام، ورموز، وألا يقل طولها عن 8 محارف",
        'year_must_equal_currenct_year_or_less_than_one': 'السنة الدراسية يجب أن تكون مطابقة لسنة الحالية أو السابقة',
        'end_academic_year':'إنهاء السنة الدراسية.',
        'started':'بدأ',
        'ended':'منتهي',
        'status':'الحالة',
        'end_title':'إنهاء',
        'do_you_want_end_question':'هل تريد إنهاء السنة؟؟',
        'class_title':"الصف",
        'assign_student':'تكليف طالب',
        'select_from_here':'أختر من هنا',
        'add_subject_to_age_group':'إضافة مادة لفئة عمرية',
        'assign_subject_to_teacher': 'تكليف مادة للمدرس',
        'class_schedules_title': 'جدول صفي',
        'periods_title': 'فترة زمنية',
        "min_number_0": "القيمة يجب أن تكون أكبر من أو تساوي 0",
        "invalid_time_pattern": "صيغة الوقت غير صحيحة (HH:mm)",
        "from_time_title": "من الساعة",
        "to_time_title": "إلى الساعة",
        'lesson_number_title': 'رقم الحصة',
        'end_time_must_less_than_from_time':'وقت النهاية يجب أن يكون أصغر من وقت البداية',
        'confirm':'تأكيد',
        'time_title':'الوقت',
        'add_period':'إضافة فترة زمنية',
        'update_period':'تعديل فترة زمنية',
        'shift_period':'إزاحة الفترات الزمنية',
        'delete_period':'حذف فترة زمنية',
        'shift': 'إزاحة',
        'hours_must_be_between_0_and_23':'الساعات يجب أن تكون بين 0 و 23',
        'minutes_must_be_between_0_and_59':'الدقائق يجب أن تكون بين 0 و 59',
        'time_cannot_be_zero':'الوقت لا يمكن أن يكون صفراً',
        'hours':'الساعات',
        'minutes':'الدقائق',
        'saturday_title': 'السبت',
        'sunday_title': 'الأحد',
        'monday_title': 'الاثنين',
        'tuesday_title': 'الثلاثاء',
        'wednesday_title': 'الأربعاء',
        'thursday_title': 'الخميس',
        'friday_title': 'الجمعة',
        class_period: 'الحصة',
        pm:'م',
        am:'ص',
        day_period_class_schedule_table:'الأيام/الفترات',
        class_schedule_title: 'الجدول الاسبوعي',
        add_class_period_title: 'إضافة حصص',
        update_class_period_title: 'تعديل حصة',
        day_title: 'اليوم',
        teacher_title: 'المدرس',
        class_period_exists_in_table:'الحصة مسجلة في الجدول الصفي',
        class_period_exists_in_added_table:'الحصة موجودة في جدول الإضافة',
        period_title:'الفترة',
        insert: 'إدراج',
        update_class_schedule_title:"تعديل معلومات الحصة",
        remove_class_period:"إزالة الحصة",
        assign_teacher_to_this_subject: 'تعيين المدرس لهذه المادة',
        update_mode: 'وضع التعديل',
        study_plan_title: 'الخطة الدراسية',
        add_study_plan: 'إضافة خطة دراسية',
        update_study_plan: 'تعديل الخطة الدراسية',
        delete_study_plan: 'حذف الخطة الدراسية',
        subjects_age_group: 'مواد السنة الدراسية'
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
        'update_academic_year': 'Update academic year',
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
        'max_length_30': 'The text should not exceed 30 characters in length.',
        'max_length_100': 'The text should not exceed 100 characters in length.',
        'add_semester':'Add semester',
        'update_semester':'Update semester',
        'start_date_must_less_than_end_date':'The start date must be less than the end date.',
        'ok': 'Ok',
        'http_401':'please login again',
        'http_403':'Don\'t have access to service',
        'http_404':'The service doesn\'t exists',
        'http_500':'Error in server',
        'network_down': 'The network is down',
        'server_error': 'Server error',
        "success":'The operation has successfully.',
        'close':'Close',
        'of':"of",
        'login':'Login',
        'logout':'logout',
        'denied_title':"Denied",
        "denied_header":"Access Denied",
        'denied_content':"You don't have permission to Dashboard. This area is restricted to authorized personnel only.",
        'click_here_to_login_screen':'Click here to go to login screen',
        'delete_semester':'Delete semester',
        'age_group_title': 'Age Group',
        'add_age_group': 'Add age group',
        'delete_age_group': 'Delete age group',
        'update_age_group': 'Update age group',
        'subject_title':'Subject',
        'add_subject':'Add Subject',
        'update_subject':'Update Subject',
        'delete_subject': 'Delete Subject',
        'description_title':"Description",
        'registrations_title': 'Registrations',
        'filter':'filter',
        'students_title':'Students',
        'user_title':'User',
        'teachers_title':'Teachers',
        'managerial_title': 'Managerial',
        'father_name_title':'Father name',
        'mother_name_title':'Mother name',
        'phonenumber_title':'Phonenumber',
        'address_title':'Address',
        'birthday_title': 'Birthday',
        'full_name_title':'Full name',
        'max_length_50':'The text must be less than 50.',
        'year_less_than_current_year':'The year must be less than current year',
        'number_digit_between_7_10':'The numnber of digits must be from 7 to 10 ',
        'all_title': 'All',
        'add_teacher':'Add teacher',
        'update_teacher': 'Update teacher',
        'administrative_staff_title':'Administrative staff',
        'permissions_title': 'Permissions',
        'delete_staff': 'Delete administrative staff',
        'update_administrative_staff':'Update administrative staff',
        'add_administrative_staff': 'Add administrative staff',
        'educational_supervisor_title':'Educational supervisor',
        'registrar_title':'Registrar',
        'delete_class_confirm':'Delete class',
        'section_title':'Section',
        'add_class':'Add class',
        'update_class':"Update class",
        'classes_title':"Classes",
        'min_number_1':'The input number must be greater than or equal 1.',
        'verification-code':'Verification Code',
        'code':'Code',
        'copy':'Copy',
        'generate-code':'Generate Code',
        'no-code-available':'No code available.',
        "validation_phonenumber_pattern": "Phone number must be 10 digits long and start with 09",
        "validation_password_pattern": "Password must be at least 8 characters long and contain uppercase and lowercase letters, numbers, and symbols",
        'year_must_equal_currenct_year_or_less_than_one': 'The academic year must match the current year or the previous year.',
        'end_academic_year':'End academic year',
        'started':'Started',
        'ended':'Closed',
        'status':'Status',
        'end_title':'End',
        'do_you_want_end_question':'Do you want to end academicYear ??',
        'class_title':"Class",
        'assign_student':'Assign student',
        'select_from_here':'Select from here.',
        'add_subject_to_age_group':'Add subject to age group',
        'assign_subject_to_teacher': 'Assign subject to teacher',
        'class_schedules_title': 'Class schedules',
        'periods_title': 'Periods',
        "min_number_0": "The value must be greater than or equal to 0",
        "invalid_time_pattern": "Invalid time format (HH:mm)",
        "from_time_title": "From time",
        "to_time_title": "To time",
        'lesson_number_title': 'Lesson number',
        'end_time_must_less_than_from_time':'End time must be less than from time',
        'confirm':'Confirm',
        'time_title':'Time',
        'add_period':'Add period',
        'update_period':'Update period',
        'shift_period':'Shift period',
        'delete_period':'Delete period',
        'shift': 'Shift',
        'hours_must_be_between_0_and_23':'Hours must be between 0 and 23',
        'minutes_must_be_between_0_and_59':'Minutes must be between 0 and 59',
        'time_cannot_be_zero':'Time cannot be zero',
        'hours':'Hours',
        'minutes':'Minutes',
        saturday_title: 'Saturday',
        sunday_title: 'Sunday',
        monday_title: 'Monday',
        tuesday_title: 'Tuesday',
        wednesday_title: 'Wednesday',
        thursday_title: 'Thursday',
        friday_title: 'Friday',
        class_period: 'Period',
        pm:'AM',
        am:'PM',
        day_period_class_schedule_table:'Days\\Periods',
        class_schedule_title: 'Class schedule',
        add_class_period_title: 'Add class period',
        update_class_period_title: 'Update class period',
        day_title:'Day',
        teacher_title:'Teacher',
        class_period_exists_in_table: 'The period is already registered in the class timetable',
        class_period_exists_in_added_table: 'The period already exists in the added list',
        period_title:'Period',
        insert: 'Insert',
        update_class_schedule_title:"Update schedule class",
        remove_class_period:"remove class period",
        assign_teacher_to_this_subject: 'Assign teacher to this subject',
        update_mode: 'Update mode',
        study_plan_title: 'Study Plan',
        add_study_plan: 'Add Study Plan',
        update_study_plan: 'Update Study Plan',
        delete_study_plan: 'Delete Study Plan',
        subjects_age_group: 'Age group subjects'
        
    }
}

export type PhrasesType =  
LoginPhrases | 
AcademicYearPhrases|
SettingsPhrases|
ValidationMessagePhrases|
ButtonPhrases|
SemesterPhrases|
HttpErrors|
Denied|
AgeGroupPhrases|
SubjectPhrases|
GlobalType|
PersonPhrases |
ClassPhrases;

export type ClassPhrases = 
'delete_class_confirm'|
'section_title'|
'add_class'|
'update_class'|
'classes_title'|
'class_title'|
ClassSchedulePhrases|
PeriodPhrases
;

export type ClassSchedulePhrases = 
'class_schedules_title'|
'class_schedule_title'|
'saturday_title'|
'sunday_title'|
'monday_title'|
'tuesday_title'|
'wednesday_title'|
'thursday_title'|
'friday_title'|
'day_period_class_schedule_table'|
'add_class_period_title'|
'update_class_period_title'|
'class_period_exists_in_table'|
'class_period_exists_in_added_table'|
'update_class_schedule_title'|
'remove_class_period'|
'assign_teacher_to_this_subject';

export type PeriodPhrases = 'periods_title'|
'from_time_title'|
'to_time_title'|
'lesson_number_title'|
'end_time_must_less_than_from_time'|
'time_title'|
'add_period'|
'update_period'|
'shift_period'|
'delete_period'|
'hours_must_be_between_0_and_23'|
'minutes_must_be_between_0_and_59'|
'time_cannot_be_zero'|
'hours'|
'minutes'|
'class_period'|
'pm'|
'am'|
'day_title'|
'period_title';

export type PersonPhrases = 
'user_title'|
'no-code-available'|
StudentPhrases|
TeacherPhrases|
AdmistrativeStaffPhrases|
ManagerialPhrases

export type AdmistrativeStaffPhrases = 
'administrative_staff_title'|
'permissions_title'|
'delete_staff'|
'update_administrative_staff'|
'add_administrative_staff'|
'educational_supervisor_title'|
'registrar_title';

export type StudentPhrases = 
'students_title'|
'father_name_title'|
'mother_name_title'|
'phonenumber_title'|
'address_title'|
'birthday_title'|
'full_name_title'|
'assign_student'
;

export type TeacherPhrases = 
'teachers_title'|
'update_teacher'|
'add_teacher'|
'assign_subject_to_teacher'|
'teacher_title';

export type ManagerialPhrases = 'managerial_title';

export type GlobalType = 
'registrations_title' |
'filter'|
'all_title'|
'select_from_here'

export type LoginPhrases = 
'name' |
'verification-code'|
'code'|
'validation_password_pattern'|
'validation_phonenumber_pattern'

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
'update_academic_year'|
'delete_academic_year'|
'do_you_want_delete_question'|
'details_academic_year'|
'end_academic_year'|
'status'|
'started'|
'ended'|
'end_title'|
'do_you_want_end_question';

export type ValidationMessagePhrases = 
'field_required'|
'year_greater_than_or_equal_2025'|
'min_length_3'|
'max_length_30'|
'max_length_50'|
'max_length_100'|
'start_date_must_less_than_end_date'|
'year_less_than_current_year'|
'number_digit_between_7_10'|
'min_number_1'|
'year_must_equal_currenct_year_or_less_than_one'|
'min_number_0'|
'invalid_time_pattern';

export type ButtonPhrases = 
'add' | 
'update' | 
'delete' | 
'cancel' | 
'ok'| 
'close' | 
'of' | 
'login'|
'logout'|
'click_here_to_login_screen'|
'copy'|
'generate-code'|
'confirm'|
'shift'|
'insert'|
'update_mode';

export type SemesterPhrases = 
'semester_title'|
'start_date_title'|
'end_date_title'|
'add_semester'|
'update_semester'|
'delete_semester'
;

export type AgeGroupPhrases = 
'age_group_title'|
'add_age_group'|
'update_age_group'|
'delete_age_group'|
'add_subject_to_age_group'|
'subjects_age_group'
;

export type SubjectPhrases = 
'subject_title'|
'add_subject'|
'update_subject'|
'delete_subject'|
'description_title'|
'study_plan_title'|
'add_study_plan'|
'update_study_plan'|
'delete_study_plan';

export type HttpErrors = 
'http_401'|
'http_403'|
'http_404'|
'http_500'|
'network_down'|
'server_error'|
"success"
;

export type Denied = 
    'denied_title'|
    'denied_header'|
    'denied_content'
;