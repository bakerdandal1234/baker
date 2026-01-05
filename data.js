const sentencesData = {
            shopping: [
  { german: "Wo ist die Milch?", arabic: "أين الحليب؟", usage: "عند البحث عن منتج", level: "A1" },
  { german: "Wie viel kostet das?", arabic: "كم سعر هذا؟", usage: "عند السؤال عن السعر", level: "A1" },
  { german: "Ich brauche eine Tüte.", arabic: "أحتاج كيسًا", usage: "عند طلب كيس", level: "A1" },
  { german: "Kann ich mit Karte zahlen?", arabic: "هل أستطيع الدفع بالبطاقة؟", usage: "عند الدفع", level: "A1" },
  { german: "Haben Sie das?", arabic: "هل لديكم هذا؟", usage: "عند البحث", level: "A1" },

  { german: "Das ist zu teuer.", arabic: "هذا غالٍ جداً", usage: "عند رفض السعر", level: "A1" },
  { german: "Ich nehme das.", arabic: "سآخذ هذا", usage: "عند الشراء", level: "A1" },
  { german: "Wo ist die Kasse?", arabic: "أين الصندوق؟", usage: "عند الدفع", level: "A1" },
  { german: "Das ist alles.", arabic: "هذا كل شيء", usage: "بعد الانتهاء", level: "A1" },
  { german: "Noch etwas?", arabic: "شيء آخر؟", usage: "سؤال البائع", level: "A1" },

  { german: "Gibt es einen Rabatt?", arabic: "هل يوجد تخفيض؟", usage: "عند السؤال عن التخفيض", level: "A2" },
  { german: "Haben Sie das größer?", arabic: "هل لديكم أكبر؟", usage: "عند طلب مقاس أكبر", level: "A2" },
  { german: "Ich suche ein Geschenk.", arabic: "أبحث عن هدية", usage: "عند التسوق", level: "A2" },
  { german: "Kann ich das umtauschen?", arabic: "هل يمكنني استبدال هذا؟", usage: "عند الاستبدال", level: "A2" },
  { german: "Haben Sie eine andere Farbe?", arabic: "هل لديكم لون آخر؟", usage: "عند السؤال عن الألوان", level: "A2" },

  { german: "Kann ich eine Quittung haben?", arabic: "هل يمكنني الحصول على فاتورة؟", usage: "بعد الدفع", level: "B1" },
  { german: "Ich möchte dies zurückgeben.", arabic: "أريد إرجاع هذا.", usage: "عند الإرجاع", level: "B1" },
  { german: "Dieser Artikel ist beschädigt.", arabic: "هذا المنتج تالف.", usage: "للتذمر عن منتج", level: "B1" }
],
transport: [
  { german: "Wo ist der Bahnhof?", arabic: "أين المحطة؟", usage: "عند البحث", level: "A1" },
  { german: "Wo ist die U-Bahn?", arabic: "أين المترو؟", usage: "عند البحث", level: "A1" },
  { german: "Wie komme ich zum Bahnhof?", arabic: "كيف أصل إلى المحطة؟", usage: "طلب المساعدة", level: "A1" },

  { german: "Wann fährt der Zug?", arabic: "متى يغادر القطار؟", usage: "عند الانتظار", level: "A1" },
  { german: "Wo muss ich aussteigen?", arabic: "أين أنزل؟", usage: "في المواصلات", level: "A1" },

  { german: "Gibt es eine Tageskarte?", arabic: "هل يوجد تذكرة يومية؟", usage: "للتوفير المالي", level: "A2" },
  { german: "Muss ich hier umsteigen?", arabic: "هل أغير هنا؟", usage: "في المواصلات", level: "A2" },
  { german: "Hat der Zug Verspätung?", arabic: "هل القطار متأخر؟", usage: "في المحطة", level: "A2" },

  { german: "Ich habe mich verlaufen.", arabic: "لقد ضللت الطريق", usage: "طلب المساعدة", level: "B1" },
  { german: "Darf ich Fahrrad mitnehmen?", arabic: "هل يُسمح بحمل الدراجة؟", usage: "للمسافرين بالدراجات", level: "B1" }
],

restaurant: [
  { german: "Haben Sie einen Tisch frei?", arabic: "هل لديكم طاولة فارغة؟", usage: "عند الدخول", level: "A1" },
  { german: "Die Speisekarte, bitte.", arabic: "قائمة الطعام من فضلك", usage: "طلب القائمة", level: "A1" },
  { german: "Die Rechnung, bitte.", arabic: "الحساب من فضلك", usage: "طلب الدفع", level: "A1" },

  { german: "Was können Sie empfehlen?", arabic: "ماذا توصون؟", usage: "طلب اقتراح", level: "A2" },
  { german: "Ich bin Vegetarier.", arabic: "أنا نباتي", usage: "تحديد النظام الغذائي", level: "A2" },

  { german: "Ich bin allergisch gegen Nüsse.", arabic: "لدي حساسية من المكسرات", usage: "تجنب الخطر", level: "B1" }
],
daily: [
  { german: "Guten Morgen/Tag/Abend!", arabic: "صباح/يوم/مساء الخير!", usage: "تحية حسب الوقت", level: "A1" },
  { german: "Wie geht's?", arabic: "كيف حالك؟", usage: "تحية غير رسمية", level: "A1" },
  { german: "Danke / Vielen Dank!", arabic: "شكرًا / شكرًا جزيلًا!", usage: "الشكر", level: "A1" },
  { german: "Bitte / Kein Problem!", arabic: "تفضل / لا مشكلة!", usage: "رد على الشكر", level: "A1" },
  { german: "Entschuldigung!", arabic: "عذرًا!", usage: "طلب الانتباه/الاعتذار", level: "A1" },
  { german: "Sprechen Sie Englisch?", arabic: "هل تتحدث الإنجليزية؟", usage: "الإنقاذ في المواقف الصعبة", level: "A1" },
  { german: "Wo ist...?", arabic: "أين...؟", usage: "البحث عن أماكن", level: "A1" },
  { german: "Wie viel kostet das?", arabic: "كم سعر هذا؟", usage: "التسوق", level: "A1" },
  { german: "Ich verstehe nicht.", arabic: "لا أفهم", usage: "طلب التوضيح", level: "A1" },
  { german: "Können Sie langsamer sprechen?", arabic: "هل يمكنك التحدث ببطء؟", usage: "تحسين التواصل", level: "A2" },
  { german: "Auf Wiedersehen! / Tschüss!", arabic: "مع السلامة! / وداعًا!", usage: "وداع", level: "A1" }
],

           doctor: [
  { german: "Mir geht's nicht gut.", arabic: "لا أشعر بحال جيدة", usage: "وصف الحالة", level: "A1" },
  { german: "Ich habe starke Schmerzen.", arabic: "لدي آلام شديدة", usage: "عند الألم", level: "A2" },
  { german: "Mir tut der Kopf/Rücken/Bauch weh.", arabic: "رأسي/ظهري/بطني يؤلمني", usage: "تحديد مكان الألم", level: "A2" },
  { german: "Ich habe hohes Fieber.", arabic: "لدي حمى عالية", usage: "عند المرض", level: "A1" },
  { german: "Ich habe starken Husten.", arabic: "لدي سعال شديد", usage: "أعراض تنفسية", level: "A2" },
  { german: "Mir ist sehr schlecht/schwindlig.", arabic: "أشعر بغثيان/دوار شديد", usage: "أعراض خطيرة", level: "B1" },
  { german: "Ich habe Probleme beim Atmen.", arabic: "لدي مشاكل في التنفس", usage: "طوارئ", level: "B1" },
  { german: "Ich bin allergisch gegen Penicillin/Nüsse.", arabic: "لدي حساسية من البنسلين/المكسرات", usage: "تجنب الخطر", level: "A2" },
  // ✅ حذفت التكرار السابق
  { german: "Wo ist die nächste Apotheke?", arabic: "أين أقرب صيدلية؟", usage: "طلب المساعدة", level: "A1" },
  { german: "Ich habe einen Termin um 10.", arabic: "لدي موعد الساعة 10", usage: "تأكيد الموعد", level: "A1" },
  { german: "Ich habe meine Versicherungskarte vergessen.", arabic: "نسيت بطاقة التأمين", usage: "إبلاغ عن مشكلة", level: "A2" },
  { german: "Können Sie mir etwas verschreiben?", arabic: "هل يمكنك وصف دواء؟", usage: "طلب العلاج", level: "A2" },
  { german: "Muss ich ins Krankenhaus?", arabic: "هل يجب أن أذهب للمستشفى؟", usage: "تقييم الخطورة", level: "B1" },
  { german: "Ich bin seit gestern krank.", arabic: "أنا مريض منذ البارحة", usage: "وصف المدة", level: "A1" },
  { german: "Ich brauche ein Rezept.", arabic: "أحتاج وصفة طبية", usage: "طلب الدواء", level: "A1" }
],

           work: [
  { german: "Haben Sie einen Moment Zeit?", arabic: "هل لديك دقيقة من الوقت؟", usage: "طلب الانتباه", level: "A1" },
  { german: "Ich brauche dringend Hilfe.", arabic: "أحتاج مساعدة عاجلة", usage: "طلب الدعم", level: "B1" },
  { german: "Wann ist die Mittagspause?", arabic: "متى استراحة الغداء؟", usage: "جدولة الوقت", level: "A1" },
  { german: "Wann beginnt die Arbeit heute?", arabic: "متى يبدأ العمل اليوم؟", usage: "تنظيم اليوم", level: "A1" },
  { german: "Ich bin gerade sehr beschäftigt.", arabic: "أنا مشغول جدًا الآن", usage: "شرح الانشغال", level: "A2" },
  { german: "Das ist schon erledigt.", arabic: "تم إنجاز هذا", usage: "إبلاغ الإنجاز", level: "A2" },
  { german: "Ich muss jetzt gehen.", arabic: "يجب أن أذهب الآن", usage: "مغادرة مهنية", level: "A1" },
  { german: "Wann ist der Abgabetermin?", arabic: "متى موعد التسليم؟", usage: "إدارة المشاريع", level: "A2" },
  { german: "Ich brauche noch mehr Zeit.", arabic: "أحتاج مزيدًا من الوقت", usage: "طلب التمديد", level: "A2" },
  { german: "Können Sie mir dabei helfen?", arabic: "هل يمكنك مساعدتي في هذا؟", usage: "طلب التعاون", level: "A2" },
  { german: "Ich schicke Ihnen eine E-Mail.", arabic: "سأرسل لك بريدًا إلكترونيًا", usage: "التواصل الرسمي", level: "A1" },
  { german: "Ist alles in Ordnung?", arabic: "هل كل شيء بخير؟", usage: "الاطمئنان على الفريق", level: "A1" }
],

home: [
  { german: "Ich bin endlich zu Hause.", arabic: "أنا في البيت أخيراً", usage: "عند الوصول", level: "A1" },
  { german: "Die Tür ist zu.", arabic: "الباب مغلق", usage: "التحقق من السلامة", level: "A1" },
  { german: "Mach bitte die Tür zu!", arabic: "أغلق الباب من فضلك!", usage: "طلب إغلاق الباب", level: "A1" },
  { german: "Das Fenster ist offen.", arabic: "النافذة مفتوحة", usage: "تنبيه السلامة", level: "A1" },
  { german: "Die Heizung funktioniert nicht.", arabic: "التدفئة لا تعمل", usage: "إبلاغ عن عطل", level: "A2" },
  { german: "Was gibt es heute zu essen?", arabic: "ما الذي سنأكله اليوم؟", usage: "تسيير المنزل", level: "A1" },
  { german: "Das Essen ist gleich fertig.", arabic: "الطعام سيكون جاهزاً حالاً", usage: "إعلام العائلة", level: "A1" },
  { german: "Kannst du bitte den Tisch decken?", arabic: "هل يمكنك إعداد الطاولة من فضلك؟", usage: "طلب المساعدة", level: "A1" },
  { german: "Hast du schon gegessen?", arabic: "هل أكلت بالفعل؟", usage: "الاهتمام بالعائلة", level: "A1" },
  { german: "Ich habe großen Hunger.", arabic: "أنا جائع جداً", usage: "التعبير عن الحاجة", level: "A1" },
  { german: "Kannst du mir helfen?", arabic: "هل يمكنك مساعدتي؟", usage: "طلب الدعم", level: "A2" },
  { german: "Vergiss nicht, Milch zu kaufen!", arabic: "لا تنسَ شراء الحليب!", usage: "تذكير يومي", level: "A1" },
  { german: "Wann kommst du nach Hause?", arabic: "متى ستأتي إلى البيت؟", usage: "التواصل العائلي", level: "A1" },
  { german: "Ich bin in zehn Minuten da.", arabic: "سأكون هناك خلال 10 دقائق", usage: "الرد على السؤال", level: "A1" },
  { german: "Ich bin sehr müde.", arabic: "أنا متعب جداً", usage: "التعبير عن الحالة", level: "A1" },
  { german: "Ich gehe jetzt schlafen.", arabic: "سأذهب للنوم الآن", usage: "إعلام قبل النوم", level: "A1" }
],

phone: [
  { german: "Hallo, wer spricht da?", arabic: "ألو، من يتحدث؟", usage: "فتح المكالمة", level: "A1" },
  { german: "Einen Moment, bitte.", arabic: "لحظة من فضلك", usage: "طلب الانتظار", level: "A1" },
  { german: "Er ist nicht da.", arabic: "هو ليس موجوداً", usage: "إبلاغ عن الغياب", level: "A1" },
  { german: "Kann ich eine Nachricht hinterlassen?", arabic: "هل يمكنني ترك رسالة؟", usage: "طلب ترك رسالة", level: "A1" },
  { german: "Ich rufe später wieder zurück.", arabic: "سأتصل مجدداً لاحقاً", usage: "إنهاء المكالمة", level: "A1" },
  { german: "Die Leitung ist besetzt.", arabic: "الخط مشغول", usage: "إبلاغ عن المشكلة", level: "A1" },
  { german: "Ich verstehe Sie nicht gut.", arabic: "لا أفهمك جيداً", usage: "طلب التوضيح", level: "A2" },
  { german: "Können Sie das wiederholen?", arabic: "هل يمكنك التكرار؟", usage: "طلب التكرار", level: "A2" },
  { german: "Können Sie lauter sprechen?", arabic: "هل يمكنك رفع الصوت؟", usage: "تحسين الصوت", level: "A2" },
  { german: "Die Verbindung ist schlecht.", arabic: "الاتصال سيء", usage: "إبلاغ عن مشكلة", level: "A2" },
  { german: "Können Sie mich zurückrufen?", arabic: "هل يمكنك الاتصال بي لاحقاً؟", usage: "طلب إعادة الاتصال", level: "A2" },
  { german: "Wann kann ich Sie erreichen?", arabic: "متى يمكنني الاتصال بك؟", usage: "ترتيب الموعد", level: "A1" },
  { german: "Wie ist Ihre Nummer?", arabic: "ما هو رقم هاتفك؟", usage: "طلب الرقم", level: "A1" },
  { german: "Ich gebe Ihnen meine Nummer.", arabic: "سأعطيك رقمي", usage: "إعطاء الرقم", level: "A1" },
  { german: "Es tut mir leid, ich muss auflegen.", arabic: "آسف، يجب أن أغلق", usage: "إنهاء عاجل", level: "A1" }
],

emergency: [
  { german: "HILFE! Notfall!", arabic: "نَجدَة! حالة طارئَة!", usage: "نداء استغاثة أولي", level: "B1" },
  { german: "Rufen Sie 112 an!", arabic: "اتصلوا برقم 112!", usage: "رقم الطوارئ الأوروبي", level: "B1" },
  { german: "Feuer! Sofort löschen!", arabic: "حريق! أطفئوه فوراً!", usage: "حريق في مكان مغلق", level: "B1" },
  { german: "Ich kann nicht atmen!", arabic: "لا أستطيع التنفس!", usage: "طوارئ تنفسية", level: "B1" },
  { german: "Starke Brustschmerzen!", arabic: "آلام صدر شديدة!", usage: "اشتباه نوبة قلبية", level: "B1" },
  { german: "Ich bin allergisch gegen [Penicillin]!", arabic: "لدي حساسية من [البنسلين]!", usage: "تجنب الخطر", level: "B1" },
  { german: "Wo ist die Notaufnahme?", arabic: "أين قسم الطوارئ؟", usage: "في المستشفى", level: "A2" },
  { german: "Mein Kind ist verloren!", arabic: "طفلي مفقود!", usage: "فقدان طفل", level: "B1" },
  { german: "Ich wurde überfallen!", arabic: "تم الاعتداء عليّ!", usage: "اعتداء جسدي", level: "B1" },
  { german: "Mein Pass/Handy wurde gestohlen!", arabic: "جوازي/هاتفي سُرق!", usage: "سرقة وثائق", level: "B1" },
  { german: "Unfall! Hier ist ein Unfall passiert!", arabic: "حادث! حصل حادث هنا!", usage: "إبلاغ عن حادث", level: "B1" },
  { german: "Wo ist der nächste Ausgang?", arabic: "أين أقرب مخرج؟", usage: "حالات الإخلاء", level: "A2" },
  { german: "Bleiben Sie bei mir! Hilfe kommt!", arabic: "ابقوا معي! المساعدة قادمة!", usage: "تهدئة المصاب", level: "B1" },
  { german: "Wo ist die nächste Polizeistation?", arabic: "أين أقرب مركز شرطة؟", usage: "جرائم غير عاجلة", level: "A2" },
  { german: "Spricht jemand Englisch?", arabic: "هل يتحدث أحد الإنجليزية؟", usage: "التواصل مع المنقذين", level: "A2" }
],


           
        };




