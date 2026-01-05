const sentencesData = {
  shopping: [
    { 
      german: "Wo ist die Milch?", 
      arabic: "أين الحليب؟", 
      usage: "عند البحث عن منتج", 
      level: "A1",
      examples: [
        "Können Sie mir zeigen, wo die Milch steht?",
        "Ich suche die Milch im Kühlregal.",
        "Entschuldigung, wo finde ich die Milch?"
      ]
    },
    { 
      german: "Wie viel kostet das?", 
      arabic: "كم سعر هذا؟", 
      usage: "عند السؤال عن السعر", 
      level: "A1",
      examples: [
        "Wie viel kostet dieser Apfel?",
        "Können Sie mir den Preis sagen?",
        "Was kostet die Wasserflasche?"
      ]
    },
    { 
      german: "Ich brauche eine Tüte.", 
      arabic: "أحتاج كيسًا", 
      usage: "عند طلب كيس", 
      level: "A1",
      examples: [
        "Haben Sie bitte eine Einkaufstüte?",
        "Ich nehme eine Papiertüte.",
        "Kann ich eine Tüte für das Brot haben?"
      ]
    },
    { 
      german: "Kann ich mit Karte zahlen?", 
      arabic: "هل أستطيع الدفع بالبطاقة؟", 
      usage: "عند الدفع", 
      level: "A1",
      examples: [
        "Akzeptieren Sie Kreditkarten?",
        "Ich möchte mit EC-Karte zahlen.",
        "Kann ich hier kontaktlos bezahlen?"
      ]
    },
    { 
      german: "Haben Sie das?", 
      arabic: "هل لديكم هذا؟", 
      usage: "عند البحث", 
      level: "A1",
      examples: [
        "Haben Sie diese Schuhe in Größe 42?",
        "Gibt es das auch in blau?",
        "Haben Sie diesen Artikel noch auf Lager?"
      ]
    },
    { 
      german: "Das ist zu teuer.", 
      arabic: "هذا غالٍ جداً", 
      usage: "عند رفض السعر", 
      level: "A1",
      examples: [
        "Das ist mir zu teuer.",
        "Können Sie den Preis senken?",
        "Ich finde das zu teuer für die Qualität."
      ]
    },
    { 
      german: "Ich nehme das.", 
      arabic: "سآخذ هذا", 
      usage: "عند الشراء", 
      level: "A1",
      examples: [
        "Ich kaufe das.",
        "Das nehme ich mit.",
        "Ich möchte das hier kaufen."
      ]
    },
    { 
      german: "Wo ist die Kasse?", 
      arabic: "أين الصندوق؟", 
      usage: "عند الدفع", 
      level: "A1",
      examples: [
        "Wo kann ich bezahlen?",
        "An welcher Kasse muss ich zahlen?",
        "Ist die Kasse noch geöffnet?"
      ]
    },
    { 
      german: "Das ist alles.", 
      arabic: "هذا كل شيء", 
      usage: "بعد الانتهاء", 
      level: "A1",
      examples: [
        "Das war alles, danke.",
        "Mehr brauche ich nicht.",
        "Ich bin fertig mit dem Einkaufen."
      ]
    },
    { 
      german: "Noch etwas?", 
      arabic: "شيء آخر؟", 
      usage: "سؤال البائع", 
      level: "A1",
      examples: [
        "Möchten Sie noch etwas dazu?",
        "Brauchen Sie sonst noch etwas?",
        "Kann ich Ihnen noch etwas anbieten?"
      ]
    },
    { 
      german: "Gibt es einen Rabatt?", 
      arabic: "هل يوجد تخفيض؟", 
      usage: "عند السؤال عن التخفيض", 
      level: "A2",
      examples: [
        "Haben Sie Studentenrabatt?",
        "Gibt es einen Mengenrabatt?",
        "Kann ich einen Rabatt bekommen, wenn ich bar zahle?"
      ]
    },
    { 
      german: "Haben Sie das größer?", 
      arabic: "هل لديكم أكبر؟", 
      usage: "عند طلب مقاس أكبر", 
      level: "A2",
      examples: [
        "Haben Sie diese Hose in Größe 34?",
        "Gibt es das auch in einer größeren Größe?",
        "Ich bräuchte eine größere Portion."
      ]
    },
    { 
      german: "Ich suche ein Geschenk.", 
      arabic: "أبحث عن هدية", 
      usage: "عند التسوق", 
      level: "A2",
      examples: [
        "Ich brauche ein Geschenk für meine Mutter.",
        "Suchen Sie etwas Bestimmtes?",
        "Können Sie mir bei der Geschenkauswahl helfen?"
      ]
    },
    { 
      german: "Kann ich das umtauschen?", 
      arabic: "هل يمكنني استبدال هذا؟", 
      usage: "عند الاستبدال", 
      level: "A2",
      examples: [
        "Ich möchte diese Schuhe umtauschen.",
        "Kann ich das gegen eine andere Farbe tauschen?",
        "Haben Sie eine Umtauschfrist?"
      ]
    },
    { 
      german: "Haben Sie eine andere Farbe?", 
      arabic: "هل لديكم لون آخر؟", 
      usage: "عند السؤال عن الألوان", 
      level: "A2",
      examples: [
        "Gibt es das auch in schwarz?",
        "Haben Sie diesen Pullover in rot?",
        "Ich würde lieber die blaue Version nehmen."
      ]
    },
    { 
      german: "Kann ich eine Quittung haben?", 
      arabic: "هل يمكنني الحصول على فاتورة؟", 
      usage: "بعد الدفع", 
      level: "A2",
      examples: [
        "Ich bräuchte gerne eine Quittung.",
        "Könnten Sie mir eine Rechnung ausstellen?",
        "Bekomme ich auch eine Quittung für das Ticket?"
      ]
    },
    { 
      german: "Ich möchte dies zurückgeben.", 
      arabic: "أريد إرجاع هذا.", 
      usage: "عند الإرجاع", 
      level: "A2",
      examples: [
        "Ich möchte dieses Produkt zurückschicken.",
        "Kann ich das Geld zurückbekommen?",
        "Ich habe das Geschenk bereits ausgepackt."
      ]
    },
    { 
      german: "Dieser Artikel ist beschädigt.", 
      arabic: "هذا المنتج تالف.", 
      usage: "للتذمر عن منتج", 
      level: "A2",
      examples: [
        "Die Verpackung ist aufgerissen.",
        "Der Bildschirm hat einen Riss.",
        "Dieser Artikel war schon beim Kauf kaputt."
      ]
    }
  ],
  transport: [
    { 
      german: "Wo ist der Bahnhof?", 
      arabic: "أين المحطة؟", 
      usage: "عند البحث", 
      level: "A1",
      examples: [
        "Können Sie mir den Weg zum Bahnhof zeigen?",
        "Gibt es hier in der Nähe einen Bahnhof?",
        "Wie komme ich am besten zum Hauptbahnhof?"
      ]
    },
    { 
      german: "Wo ist die U-Bahn?", 
      arabic: "أين المترو؟", 
      usage: "عند البحث", 
      level: "A1",
      examples: [
        "Wo ist der nächste U-Bahn-Eingang?",
        "Wie kommt man zur U-Bahn-Linie 5?",
        "Ist die U-Bahn-Station weit von hier?"
      ]
    },
    { 
      german: "Wie komme ich zum Bahnhof?", 
      arabic: "كيف أصل إلى المحطة؟", 
      usage: "طلب المساعدة", 
      level: "A1",
      examples: [
        "Können Sie mir den Weg beschreiben?",
        "Fährt der Bus zum Bahnhof?",
        "Ist es zu Fuß zu erreichen?"
      ]
    },
    { 
      german: "Wann fährt der Zug?", 
      arabic: "متى يغادر القطار؟", 
      usage: "عند الانتظار", 
      level: "A1",
      examples: [
        "Um wie viel Uhr fährt der Zug nach Berlin?",
        "Verspätet sich der Zug?",
        "Wann kommt der nächste Zug an?"
      ]
    },
    { 
      german: "Wo muss ich aussteigen?", 
      arabic: "أين أنزل؟", 
      usage: "في المواصلات", 
      level: "A1",
      examples: [
        "An welcher Haltestelle steige ich aus?",
        "Muss ich an der nächsten Station aussteigen?",
        "Können Sie mich warnen, wenn wir da sind?"
      ]
    },
    { 
      german: "Gibt es eine Tageskarte?", 
      arabic: "هل يوجد تذكرة يومية؟", 
      usage: "للتوفير المالي", 
      level: "A2",
      examples: [
        "Wie viel kostet eine Tageskarte?",
        "Gibt es eine Familien-Tageskarte?",
        "Wo kann ich eine Wochenkarte kaufen?"
      ]
    },
    { 
      german: "Muss ich hier umsteigen?", 
      arabic: "هل أغير هنا؟", 
      usage: "في المواصلات", 
      level: "A2",
      examples: [
        "Muss ich in München umsteigen?",
        "Wo ist der Umstiegspunkt?",
        "Wie lange habe ich für den Umstieg Zeit?"
      ]
    },
    { 
      german: "Hat der Zug Verspätung?", 
      arabic: "هل القطار متأخر؟", 
      usage: "في المحطة", 
      level: "A2",
      examples: [
        "Um wie viele Minuten hat der Zug Verspätung?",
        "Woran erkenne ich, ob der Zug verspätet ist?",
        "Wird der Anschlusszug auf mich warten?"
      ]
    },
    { 
      german: "Ich habe mich verlaufen.", 
      arabic: "لقد ضللت الطريق", 
      usage: "طلب المساعدة", 
      level: "A2",
      examples: [
        "Ich weiß nicht mehr, wo ich bin.",
        "Können Sie mir helfen? Ich habe mich verlaufen.",
        "Ich kann den Rückweg nicht finden."
      ]
    },
    { 
      german: "Darf ich Fahrrad mitnehmen?", 
      arabic: "هل يُسمح بحمل الدراجة؟", 
      usage: "للمسافرين بالدراجات", 
      level: "B1",
      examples: [
        "Gibt es einen Fahrradwagen im Zug?",
        "Muss ich extra für das Fahrrad bezahlen?",
        "Ist das Fahrradmitnahmegutschein erforderlich?"
      ]
    }
  ],
  restaurant: [
    { 
      german: "Haben Sie einen Tisch frei?", 
      arabic: "هل لديكم طاولة فارغة؟", 
      usage: "عند الدخول", 
      level: "A1",
      examples: [
        "Ich hätte gerne einen Tisch für zwei Personen.",
        "Ist dieser Tisch noch frei?",
        "Können Sie uns einen Tisch am Fenster geben?"
      ]
    },
    { 
      german: "Die Speisekarte, bitte.", 
      arabic: "قائمة الطعام من فضلك", 
      usage: "طلب القائمة", 
      level: "A1",
      examples: [
        "Darf ich die Speisekarte sehen?",
        "Haben Sie eine englische Speisekarte?",
        "Können Sie mir die Tagesgerichte empfehlen?"
      ]
    },
    { 
      german: "Die Rechnung, bitte.", 
      arabic: "الحساب من فضلك", 
      usage: "طلب الدفع", 
      level: "A1",
      examples: [
        "Zusammen oder getrennt bezahlen?",
        "Können wir die Rechnung haben?",
        "Ich möchte bar zahlen."
      ]
    },
    { 
      german: "Was können Sie empfehlen?", 
      arabic: "ماذا توصون؟", 
      usage: "طلب اقتراح", 
      level: "A2",
      examples: [
        "Was ist das beliebteste Gericht hier?",
        "Haben Sie vegetarische Empfehlungen?",
        "Was nehmen die meisten Gäste?"
      ]
    },
    { 
      german: "Ich bin Vegetarier.", 
      arabic: "أنا نباتي", 
      usage: "تحديد النظام الغذائي", 
      level: "A2",
      examples: [
        "Ich esse kein Fleisch.",
        "Gibt es vegetarische Optionen auf der Karte?",
        "Enthält dieses Gericht Fleisch?"
      ]
    },
    { 
      german: "Ich bin allergisch gegen Nüsse.", 
      arabic: "لدي حساسية من المكسرات", 
      usage: "تجنب الخطر", 
      level: "A2",
      examples: [
        "Ich darf keine Erdnüsse essen.",
        "Vorsicht, ich habe eine Nussallergie.",
        "Enthält dieses Gericht Nüsse?"
      ]
    }
  ],
  daily: [
    { 
      german: "Guten Morgen/Tag/Abend!", 
      arabic: "صباح/يوم/مساء الخير!", 
      usage: "تحية حسب الوقت", 
      level: "A1",
      examples: [
        "Guten Morgen, wie kann ich helfen?",
        "Guten Tag, schön Sie zu sehen!",
        "Guten Abend, haben Sie gut geschlafen?"
      ]
    },
    { 
      german: "Wie geht's?", 
      arabic: "كيف حالك؟", 
      usage: "تحية غير رسمية", 
      level: "A1",
      examples: [
        "Hallo, wie geht es dir heute?",
        "Wie war dein Tag?",
        "Alles gut bei dir?"
      ]
    },
    { 
      german: "Danke / Vielen Dank!", 
      arabic: "شكرًا / شكرًا جزيلًا!", 
      usage: "الشكر", 
      level: "A1",
      examples: [
        "Danke für Ihre Hilfe!",
        "Vielen Dank für das Geschenk!",
        "Ich danke Ihnen sehr!"
      ]
    },
    { 
      german: "Bitte / Kein Problem!", 
      arabic: "تفضل / لا مشكلة!", 
      usage: "رد على الشكر", 
      level: "A1",
      examples: [
        "Gern geschehen!",
        "Nichts zu danken!",
        "Das war doch selbstverständlich."
      ]
    },
    { 
      german: "Entschuldigung!", 
      arabic: "عذرًا!", 
      usage: "طلب الانتباه/الاعتذار", 
      level: "A1",
      examples: [
        "Entschuldigung, wo ist die Toilette?",
        "Entschuldigen Sie die Störung.",
        "Verzeihung, ich habe mich verlaufen."
      ]
    },
    { 
      german: "Sprechen Sie Englisch?", 
      arabic: "هل تتحدث الإنجليزية؟", 
      usage: "الإنقاذ في المواقف الصعبة", 
      level: "A1",
      examples: [
        "Können wir auf Englisch sprechen?",
        "Verstehen Sie auch Englisch?",
        "Ich spreche kein Deutsch, nur Englisch."
      ]
    },
    { 
      german: "Wo ist...?", 
      arabic: "أين...؟", 
      usage: "البحث عن أماكن", 
      level: "A1",
      examples: [
        "Wo ist die nächste Apotheke?",
        "Wo finde ich einen Geldautomaten?",
        "Wo ist die Bushaltestelle?"
      ]
    },
    { 
      german: "Wie viel kostet das?", 
      arabic: "كم سعر هذا؟", 
      usage: "التسوق", 
      level: "A1",
      examples: [
        "Wie viel kostet das Ticket?",
        "Was kostet der Kaffee?",
        "Können Sie mir den Preis nennen?"
      ]
    },
    { 
      german: "Ich verstehe nicht.", 
      arabic: "لا أفهم", 
      usage: "طلب التوضيح", 
      level: "A1",
      examples: [
        "Können Sie das wiederholen?",
        "Ich verstehe kein Deutsch.",
        "Das ist mir nicht klar."
      ]
    },
    { 
      german: "Können Sie langsamer sprechen?", 
      arabic: "هل يمكنك التحدث ببطء؟", 
      usage: "تحسين التواصل", 
      level: "A2",
      examples: [
        "Bitte sprechen Sie etwas langsamer.",
        "Können Sie das noch einmal langsam sagen?",
        "Ich verstehe Sie besser, wenn Sie langsamer sprechen."
      ]
    },
    { 
      german: "Spricht jemand Englisch?", 
      arabic: "هل يتحدث أحد الإنجليزية؟", 
      usage: "التواصل مع المنقذين", 
      level: "A1",
      examples: [
        "Gibt es hier jemanden, der Englisch spricht?",
        "Kann mir bitte jemand auf Englisch helfen?",
        "Ich brauche dringend jemanden, der Englisch kann."
      ]
    },
    { 
      german: "Auf Wiedersehen! / Tschüss!", 
      arabic: "مع السلامة! / وداعًا!", 
      usage: "وداع", 
      level: "A1",
      examples: [
        "Bis bald!",
        "Tschüss, bis morgen!",
        "Auf Wiedersehen und danke!"
      ]
    }
  ],
  doctor: [
    { 
      german: "Mir geht's nicht gut.", 
      arabic: "لا أشعر بحال جيدة", 
      usage: "وصف الحالة", 
      level: "A1",
      examples: [
        "Mir ist heute schlecht.",
        "Ich fühle mich nicht wohl.",
        "Mir geht es sehr schlecht."
      ]
    },
    { 
      german: "Ich habe starke Schmerzen.", 
      arabic: "لدي آلام شديدة", 
      usage: "عند الألم", 
      level: "A2",
      examples: [
        "Die Schmerzen sind unerträglich.",
        "Ich habe seit gestern starke Kopfschmerzen.",
        "Wo genau haben Sie die Schmerzen?"
      ]
    },
    { 
      german: "Mir tut der Kopf/Rücken/Bauch weh.", 
      arabic: "رأسي/ظهري/بطني يؤلمني", 
      usage: "تحديد مكان الألم", 
      level: "A1",
      examples: [
        "Mein Kopf schmerzt sehr.",
        "Der Rücken tut mir weh seit gestern.",
        "Ich habe Bauchschmerzen nach dem Essen."
      ]
    },
    { 
      german: "Ich habe hohes Fieber.", 
      arabic: "لدي حمى عالية", 
      usage: "عند المرض", 
      level: "A1",
      examples: [
        "Meine Temperatur ist 39 Grad.",
        "Ich fühle mich heiß und schwach.",
        "Seit wann haben Sie Fieber?"
      ]
    },
    { 
      german: "Ich habe starken Husten.", 
      arabic: "لدي سعال شديد", 
      usage: "أعراض تنفسية", 
      level: "A2",
      examples: [
        "Ich huste seit drei Tagen.",
        "Der Husten ist trocken und schmerzhaft.",
        "Haben Sie auch Halsschmerzen?"
      ]
    },
    { 
      german: "Mir ist sehr schlecht/schwindlig.", 
      arabic: "أشعر بغثيان/دوار شديد", 
      usage: "أعراض خطيرة", 
      level: "B1",
      examples: [
        "Ich muss mich hinlegen, mir ist schwindlig.",
        "Mir wird schwarz vor Augen.",
        "Ich fühle mich, als würde ich ohnmächtig werden."
      ]
    },
    { 
      german: "Ich habe Probleme beim Atmen.", 
      arabic: "لدي مشاكل في التنفس", 
      usage: "طوارئ", 
      level: "B1",
      examples: [
        "Ich kann kaum Luft holen.",
        "Mein Atem ist sehr flach.",
        "Beim Treppensteigen wird es schlimmer."
      ]
    },
    { 
      german: "Ich bin allergisch gegen Penicillin/Nüsse.", 
      arabic: "لدي حساسية من البنسلين/المكسرات", 
      usage: "تجنب الخطر", 
      level: "A2",
      examples: [
        "Ich darf kein Penicillin nehmen.",
        "Bei Nüssen bekomme ich Hautausschlag.",
        "Haben Sie Medikamente ohne Penicillin?"
      ]
    },
    { 
      german: "Wo ist die nächste Apotheke?", 
      arabic: "أين أقرب صيدلية؟", 
      usage: "طلب المساعدة", 
      level: "A1",
      examples: [
        "Gibt es eine Apotheke in der Nähe?",
        "Wo finde ich nachts eine Notapotheke?",
        "Ist die Apotheke noch geöffnet?"
      ]
    },
    { 
      german: "Ich habe einen Termin um 10.", 
      arabic: "لدي موعد الساعة 10", 
      usage: "تأكيد الموعد", 
      level: "A1",
      examples: [
        "Ich habe um 10 Uhr einen Arzttermin.",
        "Mein Termin ist für heute Morgen.",
        "Ich komme zu meinem vereinbarten Termin."
      ]
    },
    { 
      german: "Ich habe meine Versicherungskarte vergessen.", 
      arabic: "نسيت بطاقة التأمين", 
      usage: "إبلاغ عن مشكلة", 
      level: "A2",
      examples: [
        "Ich habe meine Versicherungskarte zu Hause gelassen.",
        "Kann ich die Karte später nachreichen?",
        "Ich habe die Versicherungsnummer im Handy."
      ]
    },
    { 
      german: "Können Sie mir etwas verschreiben?", 
      arabic: "هل يمكنك وصف دواء؟", 
      usage: "طلب العلاج", 
      level: "A2",
      examples: [
        "Haben Sie ein Medikament gegen Kopfschmerzen?",
        "Können Sie mir Antibiotika verschreiben?",
        "Was empfehlen Sie gegen den Husten?"
      ]
    },
    { 
      german: "Muss ich ins Krankenhaus?", 
      arabic: "هل يجب أن أذهب للمستشفى؟", 
      usage: "تقييم الخطورة", 
      level: "B1",
      examples: [
        "Ist mein Zustand ernst genug fürs Krankenhaus?",
        "Soll ich direkt ins Krankenhaus fahren?",
        "Muss ich stationär behandelt werden?"
      ]
    },
    { 
      german: "Ich bin seit gestern krank.", 
      arabic: "أنا مريض منذ البارحة", 
      usage: "وصف المدة", 
      level: "A2",
      examples: [
        "Seit Montag fühle ich mich krank.",
        "Ich habe seit drei Tagen Fieber.",
        "Meine Erkältung dauert schon seit letzter Woche."
      ]
    },
    { 
      german: "Ich brauche ein Rezept.", 
      arabic: "أحتاج وصفة طبية", 
      usage: "طلب الدواء", 
      level: "A2",
      examples: [
        "Können Sie mir ein Rezept für Antibiotika schreiben?",
        "Ich brauche ein neues Rezept für meine Medikamente.",
        "Wo kann ich das Rezept einlösen?"
      ]
    }
  ],
  work: [
    { 
      german: "Haben Sie einen Moment Zeit?", 
      arabic: "هل لديك دقيقة من الوقت؟", 
      usage: "طلب الانتباه", 
      level: "A1",
      examples: [
        "Kann ich Sie kurz stören?",
        "Haben Sie eine Minute für mich?",
        "Darf ich Ihnen etwas zeigen?"
      ]
    },
    { 
      german: "Ich brauche dringend Hilfe.", 
      arabic: "أحتاج مساعدة عاجلة", 
      usage: "طلب الدعم", 
      level: "A2",
      examples: [
        "Können Sie mir bitte sofort helfen?",
        "Ich brauche Unterstützung bei diesem Projekt.",
        "Ohne Ihre Hilfe schaffe ich das nicht rechtzeitig."
      ]
    },
    { 
      german: "Wann ist die Mittagspause?", 
      arabic: "متى استراحة الغداء؟", 
      usage: "جدولة الوقت", 
      level: "A1",
      examples: [
        "Von wann bis wann ist die Mittagspause?",
        "Darf ich um 12 Uhr in die Pause gehen?",
        "Wie lange dauert die Mittagspause?"
      ]
    },
    { 
      german: "Wann beginnt die Arbeit heute?", 
      arabic: "متى يبدأ العمل اليوم؟", 
      usage: "تنظيم اليوم", 
      level: "A1",
      examples: [
        "Um wie viel Uhr fängt die Arbeit an?",
        "Beginnt die Schicht pünktlich um 8?",
        "Ist heute eine Versammlung vor Arbeitsbeginn?"
      ]
    },
    { 
      german: "Ich bin gerade sehr beschäftigt.", 
      arabic: "أنا مشغول جدًا الآن", 
      usage: "شرح الانشغال", 
      level: "A2",
      examples: [
        "Ich kann jetzt nicht sprechen, ich bin im Meeting.",
        "Entschuldigung, ich habe gerade viel zu tun.",
        "Ich bin bis 15 Uhr mit einer Aufgabe beschäftigt."
      ]
    },
    { 
      german: "Das ist schon erledigt.", 
      arabic: "تم إنجاز هذا", 
      usage: "إبلاغ الإنجاز", 
      level: "A2",
      examples: [
        "Die Arbeit ist bereits fertig.",
        "Ich habe das gestern abgeschlossen.",
        "Das Projekt ist so gut wie erledigt."
      ]
    },
    { 
      german: "Ich muss jetzt gehen.", 
      arabic: "يجب أن أذهب الآن", 
      usage: "مغادرة مهنية", 
      level: "A1",
      examples: [
        "Ich muss zum nächsten Termin.",
        "Entschuldigung, ich habe einen dringenden Termin.",
        "Ich gehe jetzt nach Hause."
      ]
    },
    { 
      german: "Wann ist der Abgabetermin?", 
      arabic: "متى موعد التسليم؟", 
      usage: "إدارة المشاريع", 
      level: "A2",
      examples: [
        "Bis wann muss ich den Bericht abgeben?",
        "Wann ist die Deadline für das Projekt?",
        "Können wir den Termin verschieben?"
      ]
    },
    { 
      german: "Ich brauche noch mehr Zeit.", 
      arabic: "أحتاج مزيدًا من الوقت", 
      usage: "طلب التمديد", 
      level: "A2",
      examples: [
        "Ich schaffe das bis morgen nicht.",
        "Können Sie mir eine Fristverlängerung geben?",
        "Ich brauche zwei weitere Tage dafür."
      ]
    },
    { 
      german: "Können Sie mir dabei helfen?", 
      arabic: "هل يمكنك مساعدتي في هذا؟", 
      usage: "طلب التعاون", 
      level: "A2",
      examples: [
        "Können Sie mir bei der Präsentation helfen?",
        "Brauchen Sie Unterstützung bei der Aufgabe?",
        "Ich komme mit diesem Problem nicht weiter."
      ]
    },
    { 
      german: "Ich schicke Ihnen eine E-Mail.", 
      arabic: "سأرسل لك بريدًا إلكترونيًا", 
      usage: "التواصل الرسمي", 
      level: "A1",
      examples: [
        "Ich werde Ihnen die Details per E-Mail senden.",
        "Schauen Sie bitte in Ihr Postfach.",
        "Ich schicke Ihnen die Dateien gleich."
      ]
    },
    { 
      german: "Ist alles in Ordnung?", 
      arabic: "هل كل شيء بخير؟", 
      usage: "الاطمئنان على الفريق", 
      level: "A1",
      examples: [
        "Alles okay bei Ihnen?",
        "Gibt es Probleme mit dem Projekt?",
        "Brauchen Sie Hilfe bei etwas?"
      ]
    }
  ],
  home: [
    { 
      german: "Ich bin endlich zu Hause.", 
      arabic: "أنا في البيت أخيراً", 
      usage: "عند الوصول", 
      level: "A1",
      examples: [
        "Es ist gut, wieder zu Hause zu sein.",
        "Ich bin müde, aber froh, zu Hause zu sein.",
        "Nach der Arbeit bin ich immer froh, zu Hause zu sein."
      ]
    },
    { 
      german: "Die Tür ist zu.", 
      arabic: "الباب مغلق", 
      usage: "التحقق من السلامة", 
      level: "A1",
      examples: [
        "Hast du die Haustür abgeschlossen?",
        "Die Tür ist fest verschlossen.",
        "Ich habe die Tür zweimal kontrolliert."
      ]
    },
    { 
      german: "Mach bitte die Tür zu!", 
      arabic: "أغلق الباب من فضلك!", 
      usage: "طلب إغلاق الباب", 
      level: "A1",
      examples: [
        "Könntest du bitte die Tür schließen?",
        "Die Tür steht offen, mach sie bitte zu!",
        "Vergiss nicht, die Tür zu verschließen."
      ]
    },
    { 
      german: "Das Fenster ist offen.", 
      arabic: "النافذة مفتوحة", 
      usage: "تنبيه السلامة", 
      level: "A1",
      examples: [
        "Hast du das Fenster offen gelassen?",
        "Das Fenster im Wohnzimmer ist noch offen.",
        "Im Winter sollten wir die Fenster schließen."
      ]
    },
    { 
      german: "Die Heizung funktioniert nicht.", 
      arabic: "التدفئة لا تعمل", 
      usage: "إبلاغ عن عطل", 
      level: "A2",
      examples: [
        "In der Wohnung ist es sehr kalt.",
        "Die Heizung macht komische Geräusche.",
        "Können Sie den Heizungsingenieur rufen?"
      ]
    },
    { 
      german: "Was gibt es heute zu essen?", 
      arabic: "ما الذي سنأكله اليوم؟", 
      usage: "تسيير المنزل", 
      level: "A1",
      examples: [
        "Hast du schon etwas zum Abendessen geplant?",
        "Was kochen wir heute?",
        "Gibt es Reste vom Vortag?"
      ]
    },
    { 
      german: "Das Essen ist gleich fertig.", 
      arabic: "الطعام سيكون جاهزاً حالاً", 
      usage: "إعلام العائلة", 
      level: "A1",
      examples: [
        "Noch fünf Minuten, dann ist das Essen fertig.",
        "Das Essen ist fast fertig, bitte deckt den Tisch.",
        "In zehn Minuten können wir essen."
      ]
    },
    { 
      german: "Kannst du bitte den Tisch decken?", 
      arabic: "هل يمكنك إعداد الطاولة من فضلك؟", 
      usage: "طلب المساعدة", 
      level: "A1",
      examples: [
        "Könntest du den Tisch für das Abendessen decken?",
        "Vergiss nicht, Besteck und Gläser hinzulegen.",
        "Ich decke den Tisch, während du das Essen holst."
      ]
    },
    { 
      german: "Hast du schon gegessen?", 
      arabic: "هل أكلت بالفعل؟", 
      usage: "الاهتمام بالعائلة", 
      level: "A1",
      examples: [
        "Hast du zu Mittag gegessen?",
        "Möchtest du noch etwas essen?",
        "Ich habe schon gegessen, danke."
      ]
    },
    { 
      german: "Ich habe großen Hunger.", 
      arabic: "أنا جائع جداً", 
      usage: "التعبير عن الحاجة", 
      level: "A1",
      examples: [
        "Ich könnte ein ganzes Brot essen.",
        "Wann gibt es endlich Essen?",
        "Mein Magen knurrt vor Hunger."
      ]
    },
    { 
      german: "Kannst du mir helfen?", 
      arabic: "هل يمكنك مساعدتي؟", 
      usage: "طلب الدعم", 
      level: "A2",
      examples: [
        "Kannst du mir bei den Hausaufgaben helfen?",
        "Ich brauche Hilfe beim Aufräumen.",
        "Könntest du mir kurz zur Hand gehen?"
      ]
    },
    { 
      german: "Vergiss nicht, Milch zu kaufen!", 
      arabic: "لا تنسَ شراء الحليب!", 
      usage: "تذكير يومي", 
      level: "A1",
      examples: [
        "Denk daran, Milch mitzubringen!",
        "Kauf bitte Milch auf dem Heimweg.",
        "Wir brauchen unbedingt noch Milch im Kühlschrank."
      ]
    },
    { 
      german: "Wann kommst du nach Hause?", 
      arabic: "متى ستأتي إلى البيت؟", 
      usage: "التواصل العائلي", 
      level: "A1",
      examples: [
        "Um wie viel Uhr bist du zu Hause?",
        "Kommst du vor dem Abendessen?",
        "Ich warte auf dich zu Hause."
      ]
    },
    { 
      german: "Ich bin in zehn Minuten da.", 
      arabic: "سأكون هناك خلال 10 دقائق", 
      usage: "الرد على السؤال", 
      level: "A1",
      examples: [
        "Ich bin bald zu Hause.",
        "Noch fünf Minuten, dann bin ich da.",
        "Ich stehe schon im Aufzug."
      ]
    },
    { 
      german: "Ich bin sehr müde.", 
      arabic: "أنا متعب جداً", 
      usage: "التعبير عن الحالة", 
      level: "A1",
      examples: [
        "Ich könnte sofort schlafen gehen.",
        "Die Arbeit war heute sehr anstrengend.",
        "Meine Augen fallen vor Müdigkeit zu."
      ]
    },
    { 
      german: "Ich gehe jetzt schlafen.", 
      arabic: "سأذهب للنوم الآن", 
      usage: "إعلام قبل النوم", 
      level: "A1",
      examples: [
        "Gute Nacht, ich gehe schlafen.",
        "Ich bin todmüde und gehe ins Bett.",
        "Schlaf gut, ich bin schon im Bett."
      ]
    }
  ],
  phone: [
    { 
      german: "Hallo, wer spricht da?", 
      arabic: "ألو، من يتحدث؟", 
      usage: "فتح المكالمة", 
      level: "A1",
      examples: [
        "Guten Tag, mit wem spreche ich?",
        "Hallo, ist dort Familie Müller?",
        "Wer ist am Apparat?"
      ]
    },
    { 
      german: "Einen Moment, bitte.", 
      arabic: "لحظة من فضلك", 
      usage: "طلب الانتظار", 
      level: "A1",
      examples: [
        "Warten Sie kurz, bitte.",
        "Einen Augenblick, ich hole ihn.",
        "Bleiben Sie bitte dran."
      ]
    },
    { 
      german: "Er ist nicht da.", 
      arabic: "هو ليس موجوداً", 
      usage: "إبلاغ عن الغياب", 
      level: "A1",
      examples: [
        "Herr Schmidt ist im Moment nicht erreichbar.",
        "Er ist gerade nicht im Büro.",
        "Leider ist er heute den ganzen Tag unterwegs."
      ]
    },
    { 
      german: "Kann ich eine Nachricht hinterlassen?", 
      arabic: "هل يمكنني ترك رسالة؟", 
      usage: "طلب ترك رسالة", 
      level: "A1",
      examples: [
        "Darf ich ihm eine Nachricht geben?",
        "Können Sie ihm ausrichten, dass ich angerufen habe?",
        "Ich hinterlasse ihm eine Sprachnachricht."
      ]
    },
    { 
      german: "Ich rufe später wieder zurück.", 
      arabic: "سأتصل مجدداً لاحقاً", 
      usage: "إنهاء المكالمة", 
      level: "A1",
      examples: [
        "Ich versuche es später noch einmal.",
        "Ich melde mich in einer Stunde wieder.",
        "Dann rufe ich morgen früh nochmal an."
      ]
    },
    { 
      german: "Die Leitung ist besetzt.", 
      arabic: "الخط مشغول", 
      usage: "إبلاغ عن المشكلة", 
      level: "A1",
      examples: [
        "Es tut mir leid, die Leitung ist besetzt.",
        "Ich bekomme nur ein Besetztzeichen.",
        "Versuchen Sie es später noch einmal."
      ]
    },
    { 
      german: "Ich verstehe Sie nicht gut.", 
      arabic: "لا أفهمك جيداً", 
      usage: "طلب التوضيح", 
      level: "A2",
      examples: [
        "Die Verbindung ist schlecht, ich verstehe Sie kaum.",
        "Können Sie das bitte wiederholen?",
        "Ich höre Sie nicht deutlich."
      ]
    },
    { 
      german: "Können Sie das wiederholen?", 
      arabic: "هل يمكنك التكرار؟", 
      usage: "طلب التكرار", 
      level: "A2",
      examples: [
        "Entschuldigung, was haben Sie gesagt?",
        "Können Sie das noch einmal sagen?",
        "Ich habe das letzte Wort nicht verstanden."
      ]
    },
    { 
      german: "Können Sie lauter sprechen?", 
      arabic: "هل يمكنك رفع الصوت؟", 
      usage: "تحسين الصوت", 
      level: "A2",
      examples: [
        "Ich kann Sie kaum hören.",
        "Sprechen Sie bitte etwas lauter.",
        "Mein Handy hat schlechten Empfang."
      ]
    },
    { 
      german: "Die Verbindung ist schlecht.", 
      arabic: "الاتصال سيء", 
      usage: "إبلاغ عن مشكلة", 
      level: "A2",
      examples: [
        "Ich höre Sie kaum, die Leitung ist schlecht.",
        "Können Sie lauter sprechen? Die Verbindung ist schlecht.",
        "Wir haben ständige Unterbrechungen in der Leitung."
      ]
    },
    { 
      german: "Können Sie mich zurückrufen?", 
      arabic: "هل يمكنك الاتصال بي لاحقاً؟", 
      usage: "طلب إعادة الاتصال", 
      level: "A2",
      examples: [
        "Rufen Sie mich bitte in einer Stunde zurück.",
        "Mein Akku ist fast leer, rufen Sie mich zurück?",
        "Ich habe schlechten Empfang, bitte rufen Sie mich später an."
      ]
    },
    { 
      german: "Wann kann ich Sie erreichen?", 
      arabic: "متى يمكنني الاتصال بك؟", 
      usage: "ترتيب الموعد", 
      level: "A1",
      examples: [
        "Zu welcher Uhrzeit sind Sie erreichbar?",
        "Wann haben Sie Zeit für einen Anruf?",
        "Können wir einen festen Termin vereinbaren?"
      ]
    },
    { 
      german: "Wie ist Ihre Nummer?", 
      arabic: "ما هو رقم هاتفك؟", 
      usage: "طلب الرقم", 
      level: "A1",
      examples: [
        "Können Sie mir Ihre Handynummer geben?",
        "Wie kann ich Sie erreichen?",
        "Schicken Sie mir bitte Ihre Nummer per SMS."
      ]
    },
    { 
      german: "Ich gebe Ihnen meine Nummer.", 
      arabic: "سأعطيك رقمي", 
      usage: "إعطاء الرقم", 
      level: "A1",
      examples: [
        "Meine Nummer ist 0176 12345678.",
        "Ich schicke Ihnen meine Nummer per WhatsApp.",
        "Schreiben Sie bitte meine Nummer auf."
      ]
    },
    { 
      german: "Es tut mir leid, ich muss auflegen.", 
      arabic: "آسف، يجب أن أغلق", 
      usage: "إنهاء عاجل", 
      level: "A1",
      examples: [
        "Entschuldigung, ich muss das Gespräch beenden.",
        "Ich habe einen wichtigen Anruf, ich muss auflegen.",
        "Leider muss ich jetzt Schluss machen."
      ]
    }
  ],
  emergency: [
    { 
      german: "HILFE! Notfall!", 
      arabic: "نَجدَة! حالة طارئَة!", 
      usage: "نداء استغاثة أولي", 
      level: "A1",
      examples: [
        "HILFE! Jemand ist verletzt!",
        "Notfall im dritten Stock!",
        "HILFE! Schnell, ein Arzt!"
      ]
    },
    { 
      german: "Rufen Sie 112 an!", 
      arabic: "اتصلوا برقم 112!", 
      usage: "رقم الطوارئ الأوروبي", 
      level: "A1",
      examples: [
        "Sofort die 112 anrufen!",
        "Notruf! Wählen Sie bitte 112!",
        "Rufen Sie schnell die Feuerwehr unter 112!"
      ]
    },
    { 
      german: "Feuer! Sofort löschen!", 
      arabic: "حريق! أطفئوه فوراً!", 
      usage: "حريق في مكان مغلق", 
      level: "A1",
      examples: [
        "Feuer im Küchenbereich!",
        "Alarm! Es brennt im zweiten Stock!",
        "Sofort den Feuerlöscher benutzen!"
      ]
    },
    { 
      german: "Ich kann nicht atmen!", 
      arabic: "لا أستطيع التنفس!", 
      usage: "طوارئ تنفسية", 
      level: "A1",
      examples: [
        "Ich bekomme keine Luft!",
        "Mir bleibt die Luft weg!",
        "Hilfe, ich ersticke!"
      ]
    },
    { 
      german: "Starke Brustschmerzen!", 
      arabic: "آلام صدر شديدة!", 
      usage: "اشتباه نوبة قلبية", 
      level: "A1",
      examples: [
        "Meine Brust tut sehr weh!",
        "Ich habe plötzlich Schmerzen in der Brust.",
        "Mir ist schwindlig und die Brust schmerzt."
      ]
    },
    { 
      german: "Ich bin allergisch gegen [Penicillin]!", 
      arabic: "لدي حساسية من [البنسلين]!", 
      usage: "تجنب الخطر", 
      level: "A1",
      examples: [
        "Ich darf kein Penicillin nehmen!",
        "Bei Penicillin bekomme ich Atemnot!",
        "Vorsicht! Ich bin allergisch gegen Antibiotika!"
      ]
    },
    { 
      german: "Wo ist die Notaufnahme?", 
      arabic: "أين قسم الطوارئ؟", 
      usage: "في المستشفى", 
      level: "A1",
      examples: [
        "Wo ist hier die Notfallstation?",
        "Gibt es eine Notaufnahme in diesem Krankenhaus?",
        "Ich brauche sofort die Notaufnahme!"
      ]
    },
    { 
      german: "Mein Kind ist verloren!", 
      arabic: "طفلي مفقود!", 
      usage: "فقدان طفل", 
      level: "A1",
      examples: [
        "Mein Sohn ist seit einer Stunde verschwunden!",
        "Haben Sie ein kleines Mädchen gesehen?",
        "Mein Kind trägt eine rote Jacke!"
      ]
    },
    { 
      german: "Ich wurde überfallen!", 
      arabic: "تم الاعتداء عليّ!", 
      usage: "اعتداء جسدي", 
      level: "A1",
      examples: [
        "Jemand hat mich bestohlen!",
        "Ich wurde vor fünf Minuten angegriffen!",
        "Hilfe! Ich wurde beraubt!"
      ]
    },
    { 
      german: "Mein Pass/Handy wurde gestohlen!", 
      arabic: "جوازي/هاتفي سُرق!", 
      usage: "سرقة وثائق", 
      level: "A1",
      examples: [
        "Meine Brieftasche ist weg!",
        "Jemand hat mein Handy aus der Tasche gestohlen!",
        "Mein Reisepass wurde gestohlen, was soll ich tun?"
      ]
    },
    { 
      german: "Unfall! Hier ist ein Unfall passiert!", 
      arabic: "حادث! حصل حادث هنا!", 
      usage: "إبلاغ عن حادث", 
      level: "A1",
      examples: [
        "Hilfe! Ein Verkehrsunfall am Kreuzung!",
        "Es gab einen Unfall auf der Autobahn!",
        "Schnell, hier ist ein Unfall passiert!"
      ]
    },
    { 
      german: "Wo ist der nächste Ausgang?", 
      arabic: "أين أقرب مخرج؟", 
      usage: "حالات الإخلاء", 
      level: "A1",
      examples: [
        "Zeigen Sie mir bitte den Notausgang.",
        "Wo ist hier der schnellste Ausgang?",
        "Im Notfall müssen wir den Ausgang finden."
      ]
    },
    { 
      german: "Bleiben Sie bei mir! Hilfe kommt!", 
      arabic: "ابقوا معي! المساعدة قادمة!", 
      usage: "تهدئة المصاب", 
      level: "A1",
      examples: [
        "Halten Sie durch, der Rettungswagen kommt!",
        "Bleiben Sie wach, Hilfe ist unterwegs!",
        "Atmen Sie ruhig, wir helfen Ihnen gleich."
      ]
    },
    { 
      german: "Wo ist die nächste Polizeistation?", 
      arabic: "أين أقرب مركز شرطة؟", 
      usage: "جرائم غير عاجلة", 
      level: "A1",
      examples: [
        "Gibt es eine Polizeistation in der Nähe?",
        "Wo finde ich die nächste Wache?",
        "Ich muss zur Polizei, um eine Anzeige zu erstatten."
      ]
    },
    { 
      german: "Spricht jemand Englisch?", 
      arabic: "هل يتحدث أحد الإنجليزية؟", 
      usage: "التواصل مع المنقذين", 
      level: "A1",
      examples: [
        "Gibt es hier jemanden, der Englisch spricht?",
        "Kann mir bitte jemand auf Englisch helfen?",
        "Ich brauche dringend jemanden, der Englisch kann."
      ]
    }
  ]
};
