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
        'save': 'حفظ',
        'add_student_to_class': 'إضافة طالب إلى الصف',
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
        'login_control_panel': 'لوحة التحكم',
        'login_welcome_title': 'مرحباً بعودتك',
        'login_welcome_subtitle': 'سجّل الدخول للوصول إلى حسابك',
        'login_motto': 'ميراث النبيين ونهج الصالحين',
        'password_title': 'كلمة المرور',
        'logout':'تسجيل خروج',
        'notifications': 'الإشعارات',
        'no_notifications': 'لا توجد إشعارات',
        'load_more': 'تحميل المزيد',
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
        'year_must_equal_currenct_year_or_greater_than_one': 'السنة الدراسية يجب أن تكون مطابقة لسنة الحالية أو التالية',
        'end_academic_year':'إنهاء السنة الدراسية.',
        'started':'بدأ',
        'ended':'منتهي',
        'status':'الحالة',
        'end_title':'إنهاء',
        'do_you_want_end_question':'هل تريد إنهاء السنة؟؟',
        'active':'تفعيل',
        'deactive':'إلغاء التفعيل',
        'active_academic_year':'تفعيل السنة الدراسية',
        'deactive_academic_year':'إلغاء تفعيل السنة الدراسية',
        'active_title':'تفعيل',
        'semester_status_start':'بدء',
        'semester_status_end':'منتهي',
        semester_status_active:'مفعل',
        semester_status_deactive:'غير مفعل',
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
        subjects_age_group: 'مواد السنة الدراسية',
        number_of_students: 'عدد الطلاب',
        behavioral_title: 'سلوكي',
        academic_title: 'علمي',
        type: 'النوع',
        recordedAt: 'تاريخ التسجيل',
        releasedAt: 'تاريخ تبليغ الأهل',
        isReleased: 'تبليغ الأهل',
        isSolved: 'تم الحل',
        solvedAt: 'تاريخ الحل',
        notes: 'ملاحظات',
        solve: 'حل الملاحظة',
        release_to_parent: 'تبليغ الأهل',
        solve_note: 'حل الملاحظة',
        do_you_want_release_to_parent_question: 'هل تريد تبليغ الأهل؟',
        do_you_want_solve_question: 'هل تريد حل الملاحظة؟',
        max_length_1000: 'النص يجب ألا يتجاوز 1000 محرف.',
        problem_in_get_semester_for_currenct_year: 'هناك مشكلة في جلب الفصل للسنة الدراسية الحالية.',
        out_of_range_date: 'التاريخ المدخل يجب أن يكون بين {first} و {second}',
        failed_to_load_semester: 'خطأ في تحميل معلومات الفصل الدراسي.',
        to:'إلى',
        points:'النقاط',
        add_student_note:'إضافة ملاحظة للطالب',
        update_student_note:'تعديل ملاحظة الطالب',
        add_student_point:'إضافة نقاط للطالب',
        update_student_point:'تعديل نقاط الطالب',
        points_title:'النقاط',
        max_value_1000:'القيمة يجب أن تكون أقل من أو تساوي 1000.',
        min_value_1:'القيمة يجب أن تكون أكبر من أو تساوي 1.',
        input_date_must_be_less_than_Date: 'يجب أن يكون التاريخ المُدخل اليوم أو تاريخًا في الماضي.',
        
        present_title: "حاضر",
        excused_absence_title: "غياب بعذر",
        unexcused_absence_title: "غياب بدون عذر",
        excused_late_title: "تأخر بعذر",
        unexcused_late_title: "تأخر بدون عذر",
        excused_leave_title: "مغادرة مبكرة بعذر",
        unexcused_leave_title: "مغادرة مبكرة بدون عذر",
        expelled_title: "مفصول",
        solve_attendance: 'حل الحضور',
        attendances: 'الحضور',
        add_attendance:  'إضافة حضور',
        update_attendance: 'تعديل حصور' ,
        today_or_before:"يجب أن يكون التاريخ اليوم أو قبل اليوم",
        student_personal_information: " معلومات الطالب الشخصية",
        get_student_note_permission: 'عرض ملاحظات الطالب',
        add_student_note_permission: 'إضافة ملاحظة طالب',
        update_student_note_permission: 'تعديل ملاحظة طالب',
        delete_student_note_permission: 'حذف ملاحظة طالب',

        get_point_permission: 'عرض النقاط',
        add_point_permission: 'إضافة نقاط',
        update_point_permission: 'تعديل نقاط',
        delete_point_permission: 'حذف نقاط',
        consume_points_permission: 'استهلاك النقاط',

        release_student_note_to_parent_permission: 'إرسال الملاحظة لولي الأمر',
        solve_student_note_permission: 'معالجة ملاحظة الطالب',

        get_student_attendance_permission: 'عرض الحضور',
        add_student_attendance_permission: 'إضافة حضور',
        update_student_attendance_permission: 'تعديل حضور',
        delete_student_attendance_permission: 'حذف حضور',
        release_student_attendance_to_parent_permission: 'إرسال الحضور لولي الأمر',
        solve_student_attendance_permission: 'معالجة الحضور',

        expel_student_permission: 'فصل الطالب',

        get_parent_visit_history_permission: 'عرض سجل زيارات ولي الأمر',
        add_parent_visit_history_permission: 'إضافة زيارة ولي أمر',
        update_parent_visit_history_permission: 'تعديل زيارة ولي أمر',
        delete_parent_visit_history_permission: 'حذف زيارة ولي أمر',
        confirm_parent_visit_permission: 'تأكيد زيارة ولي الأمر',

        add_assignment_permission: 'إضافة تكليف',
        update_assignment_permission: 'تعديل تكليف',
        delete_assignment_permission: 'حذف تكليف',
        get_assignment_permission: 'عرض التكليفات',

        add_mark_entry_permission: 'إضافة علامات',
        update_mark_entry_permission: 'تعديل علامات',
        delete_mark_entry_permission: 'حذف علامات',
        get_mark_entry_permission: 'عرض إدخال العلامات',
        add_mark_sheet_permission: 'إضافة كشف علامات',
        update_mark_sheet_permission: 'تعديل كشف علامات',
        delete_mark_sheet_permission: 'حذف كشف علامات',
        get_mark_sheet_permission: 'عرض كشوف العلامات',
        confirm_mark_sheet_permission: 'تأكيد كشف العلامات',

        add_student_assignment_evaluation_permission: 'إضافة تقييم تكليف',
        update_student_assignment_evaluation_permission: 'تعديل تقييم تكليف',
        delete_student_assignment_evaluation_permission: 'حذف تقييم تكليف',
        get_student_assignment_evaluation_permission: 'عرض تقييم التكليفات',

        severity_title: "درجة الخطورة",
        low_title: "منخفض",
        middle_title: "متوسط",
        high_title: "مرتفع",
        confirm_parent_visit: "تأكيد زيارة ولي الأمر",
        do_you_want_confirm_parent_visit_question: "هل تريد تأكيد زيارة ولي الأمر؟",
        completed_parent_visit_count: "عدد زيارات أولياء الأمور المكتملة",
        pending_parent_visit_count: "عدد زيارات أولياء الأمور المعلقة",
        parent_visit: "زيارة ولي الأمر",
        is_parent_visit: "تمت زيارةالأهل؟",
        true: "نعم",
        false: "لا",
        student_parent_visits: 'زيارات الأهل',
        update_parent_visit: 'تحديث زيارة ولي الأمر',
        add_parent_visit: 'إضافة زيارة ولي الأمر',
        student_status_new: "جديد",
        student_status_transferred: "منقول",
        student_status_graduated: "أنهى المراحل",
        student_status_expelled: "مفصول",
        student_status: 'حالة الطالب',
        is_expelled: 'هل الطالب مفصول؟',
        is_visit_parent_required: 'هل زيارة وليّ الأمر مطلوبة؟',
        date: 'التاريخ',
        delete_attendance: 'حذف الحضور',
        select_at_less_one_date: 'يجب أختيار تاريخ واحد على الأقل.',
        max_grade_title: 'العلامة القصوى',
        min_pass_grade_title: 'علامة النجاح',
        sort_order_title: 'ترتيب',
        week_title: 'الأسبوع',
        week_number_title: 'رقم الأسبوع',
        title_label: 'العنوان',
        titles_label: 'عناوين',
        no_study_plan: 'لا توجد خطة دراسية',
        assignments_title: 'التكليفات',
        add_assignment: 'إضافة تكليف',
        update_assignment: 'تعديل تكليف',
        delete_assignment: 'حذف تكليف',
        assignment_at_title: 'تاريخ التكليف',
        required_time_title: 'محدد بوقت',
        no_assignments: 'لا توجد تكليفات',
        clear: 'امسح',
        time: "الوقت",
        include_time: "تضمين الوقت",
        class_assignment: "تكليف صف",
        mark_distribution_title: 'توزيع العلامات',
        add_mark_distribution: 'إضافة توزيع علامة',
        update_mark_distribution: 'تعديل توزيع علامة',
        delete_mark_distribution: 'حذف توزيع علامة',
        coursework_title: 'أعمال الطلاب',
        final_exam_title: 'الامتحان النهائي',
        percentage_title: 'النسبة المئوية',
        mark_type_title: 'نوع العلامة',
        percentage_must_be_greater_than_0: 'العلامة يجب أن تكون أكبر من 0',
        percentage_must_not_exceed_100: 'العلامة تتجاوز الحد المتبقي',
        grade_title: 'العلامة',
        remaining_grade_title: 'المتبقي',
        entered_grade_title: 'المدخل',
        student_mark_title: 'علامات الطلاب',
        student_mark_sheet_title: 'كشوف العلامات',
        add_student_mark_sheet: 'إضافة كشف علامات',
        update_student_mark_sheet: 'تعديل كشف علامات',
        delete_student_mark_sheet: 'حذف كشف علامات',
        no_student_mark_sheets: 'لا توجد كشوف علامات',
        students_count_title: 'عدد الطلاب',
        details_title: 'تفاصيل',
        confirm_mark_sheet: 'تأكيد الكشف',
        already_confirmed: 'مؤكد مسبقاً',
        publish_title: 'نشر',
        release_title: 'رفع للأهل',
        report_title: 'تقرير',
        with_sheet_title: 'لديها كشف',
        without_sheet_title: 'بدون كشف',
        not_confirmed_title: 'غير مؤكدة',
        pending_subjects_title: 'مواد معلقة',
        has_sheet_title: 'لديها كشف',
        release_success: 'تم الرفع بنجاح',
        mark_entry_title: 'إدخال العلامات',
        add_mark_entry: 'إضافة علامة',
        no_distribution_found: 'لا يوجد توزيعة لهذه المادة ضمن الفئة العمرية',
        delete_mark_entry: 'حذف علامات الطالب',
        update_mark_entry: 'تعديل علامة',
        value_title: 'القيمة',
        value_exceeds_max: 'القيمة تتجاوز الحد الأقصى المسموح',
        search_student_placeholder: 'ابحث عن طالب...',
        coursework_avg_title: 'مجموع الأعمال',
        final_exam_avg_title: 'مجموع الامتحان',
        total_avg_title: 'المجموع الكلي',
        dashboard: 'لوحة التحكم',
        dashboard_overview: 'نظرة عامة على المدرسة',
        quick_access_title: 'الوصول السريع',
        distribution_title: 'نسبة التوزيع',
        total_title: 'الإجمالي',
        mark_sheets_status_title: 'حالة كشوف العلامات',
        sheets_submitted_title: 'كشوف مُدخلة',
        sheets_confirmed_title: 'كشوف مؤكدة',
        students_by_grade_title: 'توزيع الطلاب والنتائج حسب الصف',
        results_status_title: 'حالة النتائج',
        group_academic_title: 'الشؤون الأكاديمية',
        group_people_title: 'الأشخاص',
        group_records_title: 'السجلات',
        open_menu: 'فتح القائمة',
        close_menu: 'إغلاق القائمة',
        toggle_sidebar: 'طي/فتح الشريط الجانبي',
        school_short_name: 'المدرسة الشرعية',
        admin_panel_title: 'لوحة الإدارة',
        staff_panel_title: 'لوحة الموجّه',
        appearance_group_title: 'المظهر',
        back: 'رجوع',
        student: 'طالب',
        student_profile_title: 'ملف الطالب',
        no_data: 'لا توجد بيانات',
        created_by: 'بواسطة',
        student_evaluations: 'تقييمات الطلاب',
        evaluation_ratio: 'نسبة التقييم',
        add_evaluation: 'إضافة تقييم',
        value_must_be_positive: 'القيمة يجب أن تكون رقمًا إيجابيًا',
        max_100: 'القيمة يجب ألا تتجاوز 100',
        unassigned_students: 'لم يُقيَّموا',
        student_assignments: 'تكليفات الطالب',
        completed: 'مكتمل',
        not_completed: 'غير مكتمل',
        student_class_assignments: 'تكليفات الطالب على الصفوف',

        // ── أ-١ · التصديق وفتح للتعديل ──
        results_promotion_group_title: 'النتائج والترفيع',
        confirm_reopen_title: 'التصديق وفتح للتعديل',
        pending_confirmation_queue_title: 'بانتظار التصديق',
        mark_sheet_status_draft_title: 'مسودة',
        mark_sheet_status_submitted_title: 'مُرسَل',
        mark_sheet_status_confirmed_title: 'مُصدَّق',
        mark_sheet_status_published_title: 'منشور',
        confirm_action_title: 'تصديق',
        reopen_action_title: 'فتح للتعديل',
        reopen_warning_message: 'بعده تصبح النتائج المولَّدة قديمة، ويُقفل النشر والترفيع حتى يُعاد التوليد.',
        view_sheet_title: 'عرض الكشف',

        // ── أ-٢ · شريط المراحل ──
        stage_entry_title: 'إدخال',
        stage_generation_title: 'بانتظار التوليد',
        stage_decision_title: 'حسم المعلّقين',
        stage_publish_title: 'بانتظار النشر',
        stage_promotion_title: 'الترفيع متاح',
        stage_completed_title: 'انتهت',
        results_stale_warning: 'النتائج قديمة — يلزم إعادة التوليد',

        // ── أ-٣ · توليد النتائج ──
        generate_results_title: 'توليد النتائج',
        generate_semester_results_title: 'توليد نتائج الفصل',
        generate_year_results_title: 'توليد نتائج السنة',
        students_without_marks_title: 'طلاب بلا علامات',
        projected_passed_title: 'المتوقع ناجح',
        projected_pending_title: 'المتوقع معلّق',
        generate_preview_title: 'معاينة التوليد',
        year_end_scope_title: 'نهاية السنة',

        // ── أ-٤ · شاشة الطلاب ──
        results_students_title: 'شاشة الطلاب',
        pending_only_filter_title: 'المعلّقون',
        max_total_title: 'الحد الأعلى',
        min_total_title: 'الحد الأدنى',
        final_total_title: 'المحصلة',
        failed_subjects_title: 'المواد الراسبة',
        status_passed_auto_title: 'ناجح',
        status_pending_decision_title: 'معلّق',
        status_passed_with_help_title: 'نجح بالمساعدة',
        status_failed_admin_title: 'راسب',

        // ── أ-٥ · تفاصيل الطالب ──
        student_result_details_title: 'تفاصيل الطالب',
        failed_despite_average_warning: 'راسب رغم أن المحصلة فوق الحد الأدنى — بسبب الرسوب في أحد الفصول',

        // ── أ-٦ · الحسم ──
        decision_title: 'الحسم',
        passed_with_help_action_title: 'نجح بالمساعدة',
        failed_action_title: 'راسب',
        note_title: 'ملاحظة',
        bulk_decision_title: 'قرار جماعي',

        // ── أ-٧ · النشر ──
        publish_results_title: 'النشر',
        publish_readonly_warning: 'بعد النشر تصبح الكشوف للقراءة فقط.',
        sheet_count_title: 'عدد الكشوف',

        // ── أ-٨ · معالج الترفيع ──
        promotion_wizard_title: 'معالج الترفيع',
        select_target_year_title: 'اختيار السنة الهدف',
        blockers_title: 'الموانع',
        promotion_preview_title: 'معاينة قابلة للتعديل',
        execute_title: 'التنفيذ',
        promoted_count_title: 'ترفيع',
        repeated_count_title: 'إعادة',
        graduated_count_title: 'تخرّج',
        action_enrolled_title: 'تسجيل',
        action_promoted_title: 'ترفيع',
        action_repeated_title: 'إعادة',
        action_graduated_title: 'تخرّج',
        current_age_group_title: 'المرحلة الحالية',
        target_age_group_title: 'المرحلة الهدف',
        warnings_title: 'تحذيرات',

        // ── أ-٩ · سجل النقل ──
        transfer_log_title: 'سجل النقل',

        // ── و-١ · كشوف الفصل ──
        mark_entry_group_title: 'إدخال العلامات',
        mark_sheets_list_title: 'كشوف الفصل',
        generate_sheets_title: 'توليد الكشوف',
        generate_sheets_confirm_message: 'سيُنشأ كشف فارغ لكل مادة وشعبة تنقص هذه المرحلة في هذا الفصل.',
        all_classes_title: 'كل الشعب',
        completion_title: 'الاكتمال',
        delete_sheet_confirm_message: 'سيُحذف الكشف نهائياً — لا يمكن التراجع عن هذا الإجراء.',

        // ── و-٢ · شبكة الإدخال ──
        mark_entry_grid_title: 'شبكة الإدخال',
        mark_entry_help_message: 'تنقّل بين الخلايا بالأسهم أو Enter أو Tab — التغييرات تُحفظ تلقائياً بعد لحظات من التوقف عن الكتابة.',
        read_only_sheet_message: 'هذا الكشف مقفل للتعديل — للقراءة فقط.',
        submit_sheet_title: 'إرسال الكشف',
        submit_blocked_message: 'أكمل علامات كل الطلاب قبل الإرسال.',
        saving_title: 'جارٍ الحفظ…',
        saved_title: 'تم الحفظ',
        incomplete_row_title: 'ناقص',

        // ── و-٣ · مصفوفة المتابعة ──
        mark_sheet_matrix_title: 'مصفوفة المتابعة',
        no_sheet_title: 'لا كشف',
        open_sheet_action_title: 'فتح',
        back_to_list_title: 'رجوع للقائمة',

        // ── مركز النتائج والترفيع (تبويبات) ──
        next: 'التالي',
        results_center_title: 'مركز النتائج والترفيع',
        confirm_reopen_tab_hint: 'صدّق كل كشف يرسله الموجّه — هذا أول شرط لأي خطوة بعده. راجع الكشف قبل التصديق، أو أعده لموجّه العلامات للتعديل.',
        generate_tab_hint: 'احسب نتائج الطلاب من الكشوف المصدَّقة — لكل فصل على حدة، ثم مرة أخيرة لكامل السنة بعد انتهاء كل الفصول.',
        students_tab_hint: 'تصفّح نتائج طلاب مرحلة معيّنة، وافتح تفاصيل أي طالب لمعرفة سبب حالته.',
        decision_tab_hint: 'كل طالب هون رسب بمادة بفصل معيّن رغم أن مجموعه العام قد يكون فوق الحد — راجع علاماته واحسم: نجح بالمساعدة، أو راسب. متاح فقط بعد توليد نتائج السنة كاملة.',
        publish_tab_hint: 'انشر نتائج فصل مصدَّق ومولَّد — تصير عندها ظاهرة للطالب وللقراءة فقط.',
        promotion_tab_hint: 'انقل الطلاب الناجحين للسنة الدراسية التالية، بعد ما تُحسم كل الحالات المعلّقة وتُنشر كل فصول السنة.',
        select_age_group_first_message: 'اختر مرحلة عمرية أولاً لعرض البيانات.',
        no_matching_students_message: 'لا يوجد طلاب مطابقون لهذا الفلتر.',
        select_target_year_hint: 'اختر السنة الدراسية التي سينتقل إليها الطلاب الناجحون — يجب أن تختلف عن السنة الحالية.',
        no_other_academic_year_message: 'لا توجد سنة دراسية أخرى بعد. أنشئ سنة جديدة أولاً لتتمكن من الترفيع إليها.',
        create_academic_year_title: 'إنشاء سنة دراسية جديدة',
        blockers_hint: 'هذه الأمور يجب أن تكتمل قبل تنفيذ الترفيع — اضغط الزر جانب كل مانع للانتقال وحله.',
        no_blockers_message: 'لا يوجد أي مانع — الترفيع جاهز للتنفيذ.',
        promotion_preview_hint: 'هكذا سينتقل كل طالب. يمكنك تغيير مصير أي طالب يدوياً من القائمة قبل التنفيذ.',
        execute_hint: 'اضغط تنفيذ لتثبيت الترفيع. إعادة التنفيذ آمنة، لكن الزر يُقفل بعد أول نجاح.',
        no_pending_students_message: 'لا يوجد طلاب معلّقون — كل الحالات محسومة.',
        max_total_hint: 'أعلى مجموع ممكن لعلامات هذه المرحلة على كل فصول السنة.',
        min_total_hint: 'أدنى مجموع مطلوب لنجاح المرحلة تلقائياً.',
        semester_total_hint: 'مجموع علامات الطالب في هذا الفصل وحده.',
        final_total_hint: 'المحصلة النهائية لمجموع كل فصول السنة.',

        pending_only_hint: 'أظهر فقط الطلاب اللي علاماتهم بانتظار قرارك — يعني حالتهم "معلّق" ولسا ما انحسمت.',
        generate_success_title: 'تم التوليد',
        view_results_action_title: 'شاهد النتائج بشاشة الطلاب',
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
        'save': 'Save',
        'add_student_to_class': 'Add Student to Class',
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
        'login_control_panel': 'Control Panel',
        'login_welcome_title': 'Welcome back',
        'login_welcome_subtitle': 'Log in to access your account',
        'login_motto': 'The heritage of the prophets, the path of the righteous',
        'password_title': 'Password',
        'logout':'logout',
        'notifications': 'Notifications',
        'no_notifications': 'No notifications',
        'load_more': 'Load more',
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
        'year_must_equal_currenct_year_or_greater_than_one': 'The academic year must match the current year or the following year.',
        'end_academic_year':'End academic year',
        'started':'Started',
        'ended':'Closed',
        'status':'Status',
        'end_title':'End',
        'do_you_want_end_question':'Do you want to end academicYear ??',
        'active':'Active',
        'deactive':'Deactive',
        'active_academic_year':'Active academic year',
        'deactive_academic_year':'Deactive academic year',
        'active_title':'Active',
        'semester_status_start':'started',
        'semester_status_end':'ended',
        semester_status_active:'Active',
        semester_status_deactive:'Deactive',
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
        subjects_age_group: 'Age group subjects',
        number_of_students: 'Number of students',
        behavioral_title: 'Behavioral',
        academic_title: 'Academic',
        type: 'Type',
        recordedAt: 'Recorded At',
        releasedAt: 'Released At',
        isReleased: 'Is Released',
        isSolved: 'Is Solved',
        solvedAt: 'Solved At',
        notes: 'Notes',
        solve: 'Solve Note',
        release_to_parent: 'Release to Parent',
        solve_note: 'Solve Note',
        do_you_want_release_to_parent_question: 'Do you want to release to parent?',
        do_you_want_solve_question: 'Do you want to solve the note?',
        max_length_1000: 'The text should not exceed 1000 characters in length.',
        problem_in_get_semester_for_currenct_year: 'There is a problem in getting the semester for the current academic year.',
        out_of_range_date: 'The date is out of range, between {first} , {second}',
        failed_to_load_semester: 'Failed to load semester information.',
        to:'to',
        points:'Points',
        add_student_note:'Add student note',
        update_student_note:'Update student note',
        add_student_point:'Add student point',
        update_student_point:'Update student point',
        points_title:'Points Title',
        max_value_1000:'The value must be less than or equal to 1000.',
        min_value_1:'The value must be greater than or equal to 1.',
        input_date_must_be_less_than_Date: 'The date entered must be today or a date in the past.',
        present_title: "Present",
        excused_absence_title: "Excused Absence",
        unexcused_absence_title: "Unexcused Absence",
        excused_late_title: "Excused Late",
        unexcused_late_title: "Unexcused Late",
        excused_leave_title: "Excused Early Leave",
        unexcused_leave_title: "Unexcused Early Leave",
        expelled_title: "Expelled",
        solve_attendance:"Solve attendance",
        attendances: 'Attendances',
        add_attendance:  'Add attendance',
        update_attendance: 'update attendance' ,
        today_or_before: 'Date must be today or earlie',
        student_personal_information: "Student Personal Information",
        get_student_note_permission: 'Get Student Note',
        add_student_note_permission: 'Add Student Note',
        update_student_note_permission: 'Update Student Note',
        delete_student_note_permission: 'Delete Student Note',
        get_point_permission: 'Get Point',
        add_point_permission: 'Add Point',
        update_point_permission: 'Update Point',
        delete_point_permission: 'Delete Point',
        consume_points_permission: 'Consume Points',
        release_student_note_to_parent_permission: 'Release Student Note To Parent',
        solve_student_note_permission: 'Solve Student Note',
        get_student_attendance_permission: 'Get Student Attendance',
        add_student_attendance_permission: 'Add Student Attendance',
        update_student_attendance_permission: 'Update Student Attendance',
        delete_student_attendance_permission: 'Delete Student Attendance',
        release_student_attendance_to_parent_permission: 'Release Student Attendance To Parent',
        solve_student_attendance_permission: 'Solve Student Attendance',
        expel_student_permission: 'Expel Student',
        get_parent_visit_history_permission: 'Get Parent Visit History',
        add_parent_visit_history_permission: 'Add Parent Visit History',
        update_parent_visit_history_permission: 'Update Parent Visit History',
        delete_parent_visit_history_permission: 'Delete Parent Visit History',
        confirm_parent_visit_permission: 'Confirm Parent Visit',

        add_assignment_permission: 'Add Assignment',
        update_assignment_permission: 'Update Assignment',
        delete_assignment_permission: 'Delete Assignment',
        get_assignment_permission: 'Get Assignments',

        add_mark_entry_permission: 'Add Mark Entry',
        update_mark_entry_permission: 'Update Mark Entry',
        delete_mark_entry_permission: 'Delete Mark Entry',
        get_mark_entry_permission: 'Get Mark Entry',
        add_mark_sheet_permission: 'Add Mark Sheet',
        update_mark_sheet_permission: 'Update Mark Sheet',
        delete_mark_sheet_permission: 'Delete Mark Sheet',
        get_mark_sheet_permission: 'Get Mark Sheets',
        confirm_mark_sheet_permission: 'Confirm Mark Sheet',

        add_student_assignment_evaluation_permission: 'Add Assignment Evaluation',
        update_student_assignment_evaluation_permission: 'Update Assignment Evaluation',
        delete_student_assignment_evaluation_permission: 'Delete Assignment Evaluation',
        get_student_assignment_evaluation_permission: 'Get Assignment Evaluations',

        severity_title: "Severity",
        low_title: "Low",
        middle_title: "Medium",
        high_title: "High",
        confirm_parent_visit: "Confirm Parent Visit",
        do_you_want_confirm_parent_visit_question: "Do you want to confirm the parent visit?",
        completed_parent_visit_count: "Completed Parent Visits",
        pending_parent_visit_count: "Pending Parent Visits",
        parent_visit: "Parent Visit",
        is_parent_visit: "Is Parent Visit?",
        true: "Yes",
        false: "No",
        student_parent_visits: 'Parent visits',
        update_parent_visit: 'Update Parent Visit',
        add_parent_visit: 'Add Parent Visit',
        student_status_new: "New",
        student_status_transferred: "Transferred",
        student_status_graduated: "Graduated",
        student_status_expelled: "Expelled",
        student_status: 'Student status',
        is_expelled: 'Is expelled?',
        is_visit_parent_required: 'Is parent visit required?',
        date:'Date',
        delete_attendance: 'Delete attendation',
        select_at_less_one_date: 'At least one date must be selected.',
        max_grade_title: 'Max Grade',
        min_pass_grade_title: 'Min Pass Grade',
        sort_order_title: 'Sort Order',
        week_title: 'Week',
        week_number_title: 'Week Number',
        title_label: 'Title',
        titles_label: 'Titles',
        no_study_plan: 'No study plan available',
        assignments_title: 'Assignments',
        add_assignment: 'Add Assignment',
        update_assignment: 'Update Assignment',
        delete_assignment: 'Delete Assignment',
        assignment_at_title: 'Assignment Date',
        required_time_title: 'Required Time',
        no_assignments: 'No assignments',
        clear: 'Clear',
        time: 'Time',
        include_time: 'Include Time',
        class_assignment: 'Class Assignment',
        mark_distribution_title: 'Mark Distribution',
        add_mark_distribution: 'Add Mark Distribution',
        update_mark_distribution: 'Update Mark Distribution',
        delete_mark_distribution: 'Delete Mark Distribution',
        coursework_title: 'Coursework',
        final_exam_title: 'Final Exam',
        percentage_title: 'Percentage',
        mark_type_title: 'Mark Type',
        percentage_must_be_greater_than_0: 'Grade must be greater than 0',
        percentage_must_not_exceed_100: 'Grade exceeds the remaining limit',
        grade_title: 'Grade',
        remaining_grade_title: 'Remaining',
        entered_grade_title: 'Entered',
        student_mark_title: 'Student Mark',
        student_mark_sheet_title: 'Student Mark Sheets',
        add_student_mark_sheet: 'Add Mark Sheet',
        update_student_mark_sheet: 'Update Mark Sheet',
        delete_student_mark_sheet: 'Delete Mark Sheet',
        no_student_mark_sheets: 'No mark sheets found',
        students_count_title: 'Students Count',
        details_title: 'Details',
        confirm_mark_sheet: 'Confirm Sheet',
        already_confirmed: 'Already confirmed',
        publish_title: 'Publish',
        release_title: 'Release to Parent',
        report_title: 'Report',
        with_sheet_title: 'With Sheet',
        without_sheet_title: 'Without Sheet',
        not_confirmed_title: 'Not Confirmed',
        pending_subjects_title: 'Pending Subjects',
        has_sheet_title: 'Has Sheet',
        release_success: 'Released successfully',
        mark_entry_title: 'Mark Entry',
        add_mark_entry: 'Add Mark',
        no_distribution_found: 'No distribution found for this subject in this age group',
        delete_mark_entry: 'Delete Student Marks',
        update_mark_entry: 'Update Mark',
        value_title: 'Value',
        value_exceeds_max: 'Value exceeds the allowed maximum',
        search_student_placeholder: 'Search for a student...',
        coursework_avg_title: 'Coursework Total',
        final_exam_avg_title: 'Final Exam Total',
        total_avg_title: 'Grand Total',
        dashboard: 'Dashboard',
        dashboard_overview: 'School overview',
        quick_access_title: 'Quick access',
        distribution_title: 'Distribution',
        total_title: 'Total',
        mark_sheets_status_title: 'Mark Sheets Status',
        sheets_submitted_title: 'Sheets submitted',
        sheets_confirmed_title: 'Sheets confirmed',
        students_by_grade_title: 'Students & Results by Grade',
        results_status_title: 'Results Status',
        group_academic_title: 'Academics',
        group_people_title: 'People',
        group_records_title: 'Records',
        open_menu: 'Open menu',
        close_menu: 'Close menu',
        toggle_sidebar: 'Toggle sidebar',
        school_short_name: "Al-Shar'iyya School",
        admin_panel_title: 'Admin Panel',
        staff_panel_title: 'Staff Panel',
        appearance_group_title: 'Appearance',
        back: 'Back',
        student: 'Student',
        student_profile_title: 'Student Profile',
        no_data: 'No data found',
        created_by: 'Created By',
        student_evaluations: 'Student Evaluations',
        evaluation_ratio: 'Evaluation Ratio',
        add_evaluation: 'Add Evaluation',
        value_must_be_positive: 'Value must be a positive number',
        max_100: 'Value must not exceed 100',
        unassigned_students: 'Not Evaluated',
        student_assignments: 'Student Assignments',
        completed: 'Completed',
        not_completed: 'Not Completed',
        student_class_assignments: 'Student Class Assignments',

        // ── أ-١ · Confirm & Reopen ──
        results_promotion_group_title: 'Results & Promotion',
        confirm_reopen_title: 'Confirm & Reopen',
        pending_confirmation_queue_title: 'Pending Confirmation',
        mark_sheet_status_draft_title: 'Draft',
        mark_sheet_status_submitted_title: 'Submitted',
        mark_sheet_status_confirmed_title: 'Confirmed',
        mark_sheet_status_published_title: 'Published',
        confirm_action_title: 'Confirm',
        reopen_action_title: 'Reopen for Editing',
        reopen_warning_message: 'Afterward, generated results become stale, and publishing and promotion are locked until results are regenerated.',
        view_sheet_title: 'View Sheet',

        // ── أ-٢ · Pipeline stage bar ──
        stage_entry_title: 'Entry',
        stage_generation_title: 'Awaiting Generation',
        stage_decision_title: 'Deciding Pending Cases',
        stage_publish_title: 'Awaiting Publish',
        stage_promotion_title: 'Promotion Available',
        stage_completed_title: 'Completed',
        results_stale_warning: 'Results are stale — regeneration required',

        // ── أ-٣ · Generate results ──
        generate_results_title: 'Generate Results',
        generate_semester_results_title: 'Generate Semester Results',
        generate_year_results_title: 'Generate Year Results',
        students_without_marks_title: 'Students Without Marks',
        projected_passed_title: 'Projected Passed',
        projected_pending_title: 'Projected Pending',
        generate_preview_title: 'Generation Preview',
        year_end_scope_title: 'End of Year',

        // ── أ-٤ · Students screen ──
        results_students_title: 'Students',
        pending_only_filter_title: 'Pending',
        max_total_title: 'Max Total',
        min_total_title: 'Min Total',
        final_total_title: 'Final Total',
        failed_subjects_title: 'Failed Subjects',
        status_passed_auto_title: 'Passed',
        status_pending_decision_title: 'Pending',
        status_passed_with_help_title: 'Passed with Help',
        status_failed_admin_title: 'Failed',

        // ── أ-٥ · Student details ──
        student_result_details_title: 'Student Details',
        failed_despite_average_warning: 'Failed despite the total being above the minimum — due to failing in one of the semesters',

        // ── أ-٦ · Decision ──
        decision_title: 'Decision',
        passed_with_help_action_title: 'Passed with Help',
        failed_action_title: 'Failed',
        note_title: 'Note',
        bulk_decision_title: 'Bulk Decision',

        // ── أ-٧ · Publish ──
        publish_results_title: 'Publish',
        publish_readonly_warning: 'After publishing, sheets become read-only.',
        sheet_count_title: 'Sheet Count',

        // ── أ-٨ · Promotion wizard ──
        promotion_wizard_title: 'Promotion Wizard',
        select_target_year_title: 'Select Target Year',
        blockers_title: 'Blockers',
        promotion_preview_title: 'Editable Preview',
        execute_title: 'Execute',
        promoted_count_title: 'Promoted',
        repeated_count_title: 'Repeated',
        graduated_count_title: 'Graduated',
        action_enrolled_title: 'Enrolled',
        action_promoted_title: 'Promoted',
        action_repeated_title: 'Repeated',
        action_graduated_title: 'Graduated',
        current_age_group_title: 'Current Grade',
        target_age_group_title: 'Target Grade',
        warnings_title: 'Warnings',

        // ── أ-٩ · Transfer log ──
        transfer_log_title: 'Transfer Log',

        // ── و-١ · Class sheets ──
        mark_entry_group_title: 'Mark Entry',
        mark_sheets_list_title: 'Class Sheets',
        generate_sheets_title: 'Generate Sheets',
        generate_sheets_confirm_message: 'An empty sheet will be created for every subject/class missing one in this semester.',
        all_classes_title: 'All Classes',
        completion_title: 'Completion',
        delete_sheet_confirm_message: 'The sheet will be permanently deleted — this cannot be undone.',

        // ── و-٢ · Entry grid ──
        mark_entry_grid_title: 'Entry Grid',
        mark_entry_help_message: 'Navigate cells with the arrow keys, Enter, or Tab — changes are saved automatically shortly after you stop typing.',
        read_only_sheet_message: 'This sheet is locked for editing — read only.',
        submit_sheet_title: 'Submit Sheet',
        submit_blocked_message: 'Complete every student\'s marks before submitting.',
        saving_title: 'Saving…',
        saved_title: 'Saved',
        incomplete_row_title: 'Incomplete',

        // ── و-٣ · Follow-up matrix ──
        mark_sheet_matrix_title: 'Follow-up Matrix',
        no_sheet_title: 'No Sheet',
        open_sheet_action_title: 'Open',
        back_to_list_title: 'Back to List',

        // ── Results & Promotion Center (tabs) ──
        next: 'Next',
        results_center_title: 'Results & Promotion Center',
        confirm_reopen_tab_hint: 'Confirm every sheet the staff submits — the first requirement for every step after it. Review the sheet before confirming, or reopen it for the staff to edit.',
        generate_tab_hint: 'Calculate student results from confirmed sheets — once per semester, then one more time for the whole year after every semester is done.',
        students_tab_hint: 'Browse a grade\'s student results, and open any student\'s details to see the reason for their status.',
        decision_tab_hint: 'Every student here failed a subject in a specific semester even if their overall total may be above the minimum — review their marks and decide: passed with help, or failed. Only available after the full-year results are generated.',
        publish_tab_hint: 'Publish a confirmed, generated semester — it then becomes visible to the student and read-only.',
        promotion_tab_hint: 'Move passing students to the next academic year, after every pending case is decided and every semester of the year is published.',
        select_age_group_first_message: 'Select an age group first to view the data.',
        no_matching_students_message: 'No students match this filter.',
        select_target_year_hint: 'Choose the academic year passing students will move into — it must differ from the current year.',
        no_other_academic_year_message: 'No other academic year exists yet. Create a new one first so you can promote into it.',
        create_academic_year_title: 'Create New Academic Year',
        blockers_hint: 'These must be resolved before promotion can run — press the button next to each blocker to go resolve it.',
        no_blockers_message: 'No blockers — promotion is ready to run.',
        promotion_preview_hint: 'This is how each student will move. You can change any student\'s fate manually from the list before executing.',
        execute_hint: 'Press execute to commit the promotion. Re-running is safe, but the button locks after the first success.',
        no_pending_students_message: 'No pending students — every case has been decided.',
        max_total_hint: 'The highest possible total for this grade across the whole year.',
        min_total_hint: 'The minimum total required to pass the grade automatically.',
        semester_total_hint: 'The student\'s total marks in this semester alone.',
        final_total_hint: 'The final total across every semester of the year.',

        pending_only_hint: 'Show only students whose marks are awaiting your decision — i.e. their status is "pending" and not yet decided.',
        generate_success_title: 'Generated',
        view_results_action_title: 'View Results in Students Tab',
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
ClassPhrases|
StudentNotePhrases|
StudentPointPhrases|
StudentAttendancePhrases|
PermissionsPhrases|
StudentParentVisitPhrases|
AssignmentPhrases|
MarkDistributionPhrases|
StudentMarkSheetPhrases|
StudentMarkEntryPhrases|
ResultsPromotionPhrases|
MarkEntryTaskPhrases;

export type MarkEntryTaskPhrases =
  'mark_entry_group_title'|
  'mark_sheets_list_title'|
  'generate_sheets_title'|
  'generate_sheets_confirm_message'|
  'all_classes_title'|
  'completion_title'|
  'delete_sheet_confirm_message'|
  'mark_entry_grid_title'|
  'mark_entry_help_message'|
  'read_only_sheet_message'|
  'submit_sheet_title'|
  'submit_blocked_message'|
  'saving_title'|
  'saved_title'|
  'incomplete_row_title'|
  'mark_sheet_matrix_title'|
  'no_sheet_title'|
  'open_sheet_action_title'|
  'back_to_list_title'|
  'next'|
  'results_center_title'|
  'confirm_reopen_tab_hint'|
  'generate_tab_hint'|
  'students_tab_hint'|
  'decision_tab_hint'|
  'publish_tab_hint'|
  'promotion_tab_hint'|
  'select_age_group_first_message'|
  'no_matching_students_message'|
  'select_target_year_hint'|
  'no_other_academic_year_message'|
  'create_academic_year_title'|
  'blockers_hint'|
  'no_blockers_message'|
  'promotion_preview_hint'|
  'execute_hint'|
  'no_pending_students_message'|
  'max_total_hint'|
  'min_total_hint'|
  'semester_total_hint'|
  'final_total_hint'|
  'pending_only_hint'|
  'generate_success_title'|
  'view_results_action_title';

export type ResultsPromotionPhrases =
  'results_promotion_group_title'|
  'confirm_reopen_title'|
  'pending_confirmation_queue_title'|
  'mark_sheet_status_draft_title'|
  'mark_sheet_status_submitted_title'|
  'mark_sheet_status_confirmed_title'|
  'mark_sheet_status_published_title'|
  'confirm_action_title'|
  'reopen_action_title'|
  'reopen_warning_message'|
  'view_sheet_title'|
  'stage_entry_title'|
  'stage_generation_title'|
  'stage_decision_title'|
  'stage_publish_title'|
  'stage_promotion_title'|
  'stage_completed_title'|
  'results_stale_warning'|
  'generate_results_title'|
  'generate_semester_results_title'|
  'generate_year_results_title'|
  'students_without_marks_title'|
  'projected_passed_title'|
  'projected_pending_title'|
  'generate_preview_title'|
  'year_end_scope_title'|
  'results_students_title'|
  'pending_only_filter_title'|
  'max_total_title'|
  'min_total_title'|
  'final_total_title'|
  'failed_subjects_title'|
  'status_passed_auto_title'|
  'status_pending_decision_title'|
  'status_passed_with_help_title'|
  'status_failed_admin_title'|
  'student_result_details_title'|
  'failed_despite_average_warning'|
  'decision_title'|
  'passed_with_help_action_title'|
  'failed_action_title'|
  'note_title'|
  'bulk_decision_title'|
  'publish_results_title'|
  'publish_readonly_warning'|
  'sheet_count_title'|
  'promotion_wizard_title'|
  'select_target_year_title'|
  'blockers_title'|
  'promotion_preview_title'|
  'execute_title'|
  'promoted_count_title'|
  'repeated_count_title'|
  'graduated_count_title'|
  'action_enrolled_title'|
  'action_promoted_title'|
  'action_repeated_title'|
  'action_graduated_title'|
  'current_age_group_title'|
  'target_age_group_title'|
  'warnings_title'|
  'transfer_log_title';

export type StudentMarkSheetPhrases =
  'student_mark_title'|
  'student_mark_sheet_title'|
  'add_student_mark_sheet'|
  'update_student_mark_sheet'|
  'delete_student_mark_sheet'|
  'no_student_mark_sheets'|
  'students_count_title'|
  'details_title'|
  'confirm_mark_sheet'|
  'already_confirmed'|
  'publish_title'|
  'release_title'|
  'report_title'|
  'with_sheet_title'|
  'without_sheet_title'|
  'not_confirmed_title'|
  'pending_subjects_title'|
  'has_sheet_title'|
  'release_success';

export type StudentMarkEntryPhrases =
  'mark_entry_title'|
  'add_mark_entry'|
  'no_distribution_found'|
  'delete_mark_entry'|
  'update_mark_entry'|
  'value_title'|
  'value_exceeds_max'|
  'search_student_placeholder'|
  'coursework_avg_title'|
  'final_exam_avg_title'|
  'total_avg_title';

export type StudentParentVisitPhrases =
'severity_title'|
'low_title'|
'middle_title'|
'high_title'|
'confirm_parent_visit'|
'do_you_want_confirm_parent_visit_question'|
'completed_parent_visit_count'|
'pending_parent_visit_count'|
'parent_visit'|
'is_parent_visit'|
'true'|
'false'|
'student_parent_visits'|
'add_parent_visit'|
'update_parent_visit'
;

export type PermissionsPhrases =
  | 'get_student_note_permission'
  | 'add_student_note_permission'
  | 'update_student_note_permission'
  | 'delete_student_note_permission'
  | 'get_point_permission'
  | 'add_point_permission'
  | 'update_point_permission'
  | 'delete_point_permission'
  | 'consume_points_permission'
  | 'release_student_note_to_parent_permission'
  | 'solve_student_note_permission'
  | 'get_student_attendance_permission'
  | 'add_student_attendance_permission'
  | 'update_student_attendance_permission'
  | 'delete_student_attendance_permission'
  | 'release_student_attendance_to_parent_permission'
  | 'solve_student_attendance_permission'
  | 'expel_student_permission'
  | 'get_parent_visit_history_permission'
  | 'add_parent_visit_history_permission'
  | 'update_parent_visit_history_permission'
  | 'delete_parent_visit_history_permission'
  | 'confirm_parent_visit_permission'
  | 'add_assignment_permission'
  | 'update_assignment_permission'
  | 'delete_assignment_permission'
  | 'get_assignment_permission'
  | 'add_mark_entry_permission'
  | 'update_mark_entry_permission'
  | 'delete_mark_entry_permission'
  | 'get_mark_entry_permission'
  | 'add_mark_sheet_permission'
  | 'update_mark_sheet_permission'
  | 'delete_mark_sheet_permission'
  | 'get_mark_sheet_permission'
  | 'confirm_mark_sheet_permission'
  | 'add_student_assignment_evaluation_permission'
  | 'update_student_assignment_evaluation_permission'
  | 'delete_student_assignment_evaluation_permission'
  | 'get_student_assignment_evaluation_permission';


export type StudentAttendancePhrases =
'present_title'|
'excused_absence_title'|
'unexcused_absence_title'|
'excused_late_title'|
'unexcused_late_title'|
'excused_leave_title'|
'unexcused_leave_title'|
'expelled_title'|
'solve_attendance'|
'attendances'|
'add_attendance'|
'update_attendance'|
'date'|
'delete_attendance';


export type StudentPointPhrases = 
'points'|
'add_student_point'|
'update_student_point'|
'points_title'


export type StudentNotePhrases =
'behavioral_title'|
'academic_title'|
'type'|
'recordedAt'|
'releasedAt'|
'isReleased'|
'isSolved'|
'solvedAt'|
'notes'|
'solve'|
'release_to_parent'|
'solve_note'|
'do_you_want_release_to_parent_question'|
'do_you_want_solve_question'|
'problem_in_get_semester_for_currenct_year'|
'out_of_range_date'|
'failed_to_load_semester'|
'to'|
'add_student_note'|
'update_student_note'|
'student_status_new'|
'student_status_transferred'|
'student_status_graduated'|
'student_status_expelled'|
'student_status'|
'is_expelled'|
'is_visit_parent_required'
;

export type ClassPhrases = 
'delete_class_confirm'|
'section_title'|
'add_class'|
'update_class'|
'classes_title'|
'class_title'|
'number_of_students'|
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
'assign_student'|
'student_personal_information'
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
'select_from_here'|
'dashboard'|
'dashboard_overview'|
'quick_access_title'|
'distribution_title'|
'total_title'|
'mark_sheets_status_title'|
'sheets_submitted_title'|
'sheets_confirmed_title'|
'students_by_grade_title'|
'results_status_title'|
'group_academic_title'|
'group_people_title'|
'group_records_title'|
'open_menu'|
'close_menu'|
'toggle_sidebar'|
'school_short_name'|
'admin_panel_title'|
'staff_panel_title'|
'appearance_group_title'|
'student'|
'student_profile_title'|
'no_data'|
'created_by'

export type LoginPhrases =
'name' |
'verification-code'|
'code'|
'validation_password_pattern'|
'validation_phonenumber_pattern'|
'login_control_panel'|
'login_welcome_title'|
'login_welcome_subtitle'|
'login_motto'|
'password_title'

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
'do_you_want_end_question'|
'active'|
'deactive'|
'active_academic_year'|
'deactive_academic_year'|
'active_title'|
'semester_status_start'|
'semester_status_end'|
'semester_status_active'|
'semester_status_deactive'
;

export type ValidationMessagePhrases = 
'field_required'|
'year_greater_than_or_equal_2025'|
'min_length_3'|
'max_length_30'|
'max_length_50'|
'max_length_100'|
'max_length_1000'|
'start_date_must_less_than_end_date'|
'year_less_than_current_year'|
'number_digit_between_7_10'|
'min_number_1'|
'year_must_equal_currenct_year_or_greater_than_one'|
'min_number_0'|
'invalid_time_pattern'|
'max_value_1000'|
'min_value_1'|
'input_date_must_be_less_than_Date'|
'today_or_before'|
'select_at_less_one_date';

export type ButtonPhrases = 
'add' |
'update' |
'delete' |
'cancel' |
'save' |
'add_student_to_class' |
'ok'| 
'close' | 
'of' | 
'login'|
'logout'|
'notifications'|
'no_notifications'|
'load_more'|
'click_here_to_login_screen'|
'copy'|
'generate-code'|
'confirm'|
'shift'|
'insert'|
'update_mode'|
'clear'|
'back';

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
'subjects_age_group'|
'sort_order_title'
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
'delete_study_plan'|
'max_grade_title'|
'min_pass_grade_title'|
'week_title'|
'week_number_title'|
'title_label'|
'titles_label'|
'no_study_plan';

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

export type AssignmentPhrases =
  'assignments_title'|
  'add_assignment'|
  'update_assignment'|
  'delete_assignment'|
  'assignment_at_title'|
  'required_time_title'|
  'no_assignments'|
  'time'|
  'include_time'|
  'class_assignment'|
  'student_evaluations'|
  'evaluation_ratio'|
  'add_evaluation'|
  'value_must_be_positive'|
  'max_100'|
  'unassigned_students'|
  'student_assignments'|
  'completed'|
  'not_completed'|
  'student_class_assignments'
  ;

export type MarkDistributionPhrases =
  'mark_distribution_title'|
  'add_mark_distribution'|
  'update_mark_distribution'|
  'delete_mark_distribution'|
  'coursework_title'|
  'final_exam_title'|
  'percentage_title'|
  'mark_type_title'|
  'percentage_must_be_greater_than_0'|
  'percentage_must_not_exceed_100'|
  'grade_title'|
  'remaining_grade_title'|
  'entered_grade_title';
