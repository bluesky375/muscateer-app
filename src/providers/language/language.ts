import { Injectable } from "@angular/core";

/*
  Generated class for the LanguageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LanguageProvider {
  arabic_language = {};
  constructor() {
    console.log("Hello LanguageProvider Provider");
    this.add_value();
  }
  add_value() {
    this.arabic_language = {
      "Username (Email / Mobile Number)": "اسم المستخدم (البريد / الجوال)",
      Password: "كلمه السر",
      "forgot password?": "هل نسيت كلمة المرور؟",
      Login: "تسجيل الدخول",
      "Don't have an account? Sign Up": "ليس لديك حساب؟ سجل",
      "Skip & enter as a guest": "تخطي وأدخل كضيف",
      "Invalid username or password": "خطأ في اسم المستخدم أو كلمة مرور",
      "Forgot password?": "هل نسيت كلمة المرور؟",
      "Registered Phone number": "رقم الهاتف المسجل",
      Cancel: "إلغاء",
      CANCEL: "إلغاء",
      Submit: "خضع",
      "Enter OTP": "أدخل OTP",
      Resend: "إعادة إرسال",
      "RESEND OTP": "إعادة إرسال OTP",
      "resend OTP": "إعادة إرسال OTP",
      "Resend OTP": "إعادة إرسال OTP",
      "New Password": "كلمة السر الجديدة",
      "Confirm Password": "تأكيد كلمة المرور",
      Classifieds: "للإعلانات",
      Forums: "المنتديات",
      Events: "أحداث",
      "Browse Popular Categories": "تصفح الفئات الشعبية",
      "Reviews & Recommendations": "التعليقات والتوصيات",
      Reviews: "إعادة النظر",
      reviews: "إعادة النظر",
      HOTELS: "الفنادق",
      RESTAURANTS: "المطاعم",
      "THINGS TO DO": "عوامل الجذب",
      MOVIES: "أفلام",
      "View all": "عرض الكل",
      Promotions: "الترقيات",
      promotions: "الترقيات",
      PROMOTIONS: "الترقيات",
      "Popular Ads": "إعلانات شعبية",
      "Recently Viewed": "شوهدت مؤخرا",
      "RECENTLY SEARCHED": "البحث مؤخرا",
      "Recently Searched": "البحث مؤخرا",
      "New Items": "عناصر جديدة",
      "Newly Added": "مضاف حديثا",
      "POPULAR SEARCH": "بحث شائع",
      "Popular search": "بحث شائع",
      "Popular Search": "بحث شائع",
      "popular search": "بحث شائع",
      Premium: "علاوة",
      HOME: "الرئيسية",
      "POST AND AD": "نشر إعلان",
      ACCOUNT: "تقرير",
      ABOUT: "حول",
      "CONTACT FORM": "اتصل بنا",
      "Contact Form": "اتصل بنا",
      LEGAL: "قانوني",
      "VERIFIED USERS": "حسابات التحقق",
      LOGOUT: "الخروج",
      LOGIN: "تسجيل الدخول",
      "Please fill in this form to create an account":
        "املأ هذا النموذج لإنشاء حساب",
      Name: "اسم",
      "Full name": "الاسم الكامل",
      Email: "البريد الإلكتروني",
      "Mobile no(oman)": "رقم الجوال (عمان)",
      Location: "موقعك",
      "I accept all terms & conditions": "أوافق على جميع الشروط والأحكام",
      "What do you wish to post today": "ماذا تريد أن تنشر اليوم",
      Jobs: "وظائف",
      "Disclaimer:By posting your classified ad here, you agree that it is in compliance with our terms and conditions":
        " إخلاء المسؤولية: عن طريق نشر الإعلان الخاص بك هنا ، فإنك توافق على أنه يتوافق مع شروطنا وشروطنا.",
      "Complete the steps below to submit your ad":
        "أكمل الخطوات أدناه لنشر الإعلان الخاص بك",
      "Choose Category": "اختر فئة",
      Images: "صور",
      "This will be the display image": "هذه ستكون صورة العرض",
      "Error while uploading image": "حدث خطأ أثناء تحميل الصورة",
      "Your ad title": "عنوان الإعلان الخاص بك",
      "Enter your advertisement title": "أدخل عنوان الإعلان الخاص بك",
      "Price (in Oman Riyals)": "السعر (بالريال العماني)",
      Price: "السعر",
      "Salary (in Oman Riyals)": "الراتب (الريال العماني)",
      Salary: "راتب",
      salary: "راتب",
      Description: "وصف الإعلان",
      description: "وصف الإعلان",
      "Enter your ad description": "أدخل وصف الإعلان الخاص بك",
      Region: "منطقة",
      "Choose Region": "اختر المنطقة",
      Address: "عنوان",
      "Your address (optional)": "أدخل عنوانك (اختياري",
      "Show contact": "إظهار الاتصال",
      "Show chat option": "عرض خيار الدردشة",
      POST: "بريد",
      Post: "بريد",
      post: "بريد",
      "ADD FORUMS": "أضف منتديات",
      "choose Category": "اختر الفئة",
      Title: "عنوان",
      title: "عنوان",

      "Something Went Wrong": "يرجى ملء جميع",
      "Something went wrong": "يرجى ملء جميع",
      "something went wrong": "يرجى ملء جميع",
      "SOMETHING WENT WRONG": "يرجى ملء جميع",

      "ADD EVENTS": "إضافة أحداث",
      Venue: "مكان",
      Date: "تاريخ",
      "Pick a date": "اختيار موعد",

      "Complete the steps below to submit your job":
        "أكمل الخطوات أدناه لإرسال مشاركتك",
      "Select Subcategory": "اختر الفئة الفرعية",
      "Select category": "اختر الفئة",
      "Select Category": "اختر الفئة",
      "select category": "اختر الفئة",
      "Your Job title": "المسمى الوظيفي",
      "Enter your job title": "يرجى إدخال عنوان وظيفتك",
      "Enter your job description": "أدخل وصف وظيفتك",
      Ok: "خضع",
      OK: "خضع",
      "Your address": "عنوانك",

      Timeline: "الجدول الزمني",
      Favourites: "المفضلة",
      "Profile Settings": "إعدادات الملف الشخصي",
      "Saved Events": "الأحداث المحفوظة",
      "Notification History": "إخطارات",

      "News & Feeds": "الأخبار والأعلاف",
      "Advice & Help": "المشورة والمساعدة",
      "Muscat Foodies": "عشاق مسقط",
      "Muscateer Pets": "الحيوانات الأليفة",
      "Relax Lounge": "إطلاق الاسترخاء",
      Tourism: "السياحة",

      "News and current Muscat affairs": "الاخبار وشؤون مسقط الحالية",
      "No Items In This Category": "لا يوجد شيء في هذه المجموعة",
      "nothing found": "لا شيء وجد",
      "Nothing found": "لا شيء وجد",

      "What? When? Where? And how? A place for people to help each other":
        "ماذا؟ متي؟ أين؟ وكيف؟ مكان للناس لمساعدة بعضهم البعض.",
      "Are you a foodie? Or found something interesting related to food? Share it here":
        "هل أنت أكول؟ أو وجدت شيئا للاهتمام المتعلقة بالطعام؟ شاركه هنا.",
      "Get answers to your questions and help out other pet lovers":
        "الحصول على إجابات لأسئلتك ومساعدة محبي الحيوانات الأليفة الأخرى.",
      "Laugh, smile, share and relax Muscateers":
        "اضحك ، ابتسمي ، شارك واسترخ.",
      "Recent comments": "احدث التعليقات",
      comments: "تعليقات",
      Comments: "تعليقات",
      Todays: "اليوم",
      Upcoming: "القادمة",
      "Bug reported": "ذكرت علة",

      "Phone number": "رقم هاتف",
      Message: "رسالة",
      Send: "إرسال",
      SUBCATEGORIES: "الفئات الفرعية",
      Search: "بحث",
      "Search results": "نتائج البحث",
      "SEARCH RESULTS": "نتائج البحث",
      "search results": "نتائج البحث",
      "Some Search text": "سحب لتحديث",
      "About us": "حذف",
      "About Us": "حذف",
      "ABOUT US": "حذف",
      required: "مطلوب",
      Required: "مطلوب",
      "CHANGE LANGUAGE": "غير اللغة",
      "change language": "غير اللغة",
      "Back to Classifieds": "الى الخلف",
      "BACK TO CLASSIFIEDS": "الى الخلف",
      "back to classifieds": "الى الخلف",
      "Back to Events": "الى الخلف",
      "BACK TO EVENTS": "الى الخلف",
      "back to events": "الى الخلف",
      "BACK TO FORUMS": "الى الخلف",
      "Back To Forums": "الى الخلف",
      "back to forums": "الى الخلف",
      "Back to Forums": "الى الخلف",
      "Back to Services": "العودة إلى الخدمات",
      "Write your review": "اكتب مراجعتك",
      "Your rating": "تقييمك",
      "Total rating": "المعدل الإجمالي",

      "Average Prices": "متوسط الأسعار",
      Cuisine: "أطباق",
      "Working hours": "ساعات العمل",
      "Restaurant Features": "ميزات المطعم",
      "Good For": "جيدة ل",
      "Contact Information": "معلومات للتواصل",
      "View On Map": "عرض على الخريطة",
      Disclaimer: "تنصل",
      "Ads near by": "الإعلانات القريبة",
      "Ads nearby": "الإعلانات القريبة",
      "ADS NEAR BY": "الإعلانات القريبة",
      "Ads Near By": "الإعلانات القريبة",
      date: "تاريخ",
      "Item has been posted successfully": "تم نشر العنصر بنجاح",
      "Item has been posted Successfully": "تم نشر العنصر بنجاح",
      success: "نجاح",
      Success: "نجاح",
      "Please Accept Terms And Conditions": "يرجى قبول الشروط والأحكام",
      "please accept terms and conditions": "يرجى قبول الشروط والأحكام",
      "PLEASE ACCEPT TERMS AND CONDITIONS": "يرجى قبول الشروط والأحكام",
      "minimum 10 characters required": "الحد الأدنى 10 أحرف المطلوبة",
      "Minimum 10 characters required": "الحد الأدنى 10 أحرف المطلوبة",
      "VIEW ON MAP": "عرض على الخريطة",
      "View on map": "عرض على الخريطة",
      "view on map": "عرض على الخريطة",
      "Please wait...": "ارجوك انتظر…",
      "Please Wait...": "ارجوك انتظر…",
      "please wait...": "ارجوك انتظر…",
      "Please wait": "ارجوك انتظر…",
      "Please Wait": "ارجوك انتظر…",
      "please wait": "ارجوك انتظر…",
      OMR: "ريال",
      Omr: "ريال",
      omr: "ريال",
      Edit: "تصحيح",
      edit: "تصحيح",
      EDIT: "تصحيح",
      delete: "حذف",
      Delete: "حذف",
      DELETE: "حذف",
      "Otp resending...": "إعادة إرسال OTP ..",
      "OTP RESENDING...": "إعادة إرسال OTP ..",
      "Resending OTP": "إعادة إرسال OTP",
      Saved: "تم الحفظ",
      saved: "تم الحفظ",
      SAVED: "تم الحفظ",
      UNSAVED: "غير منقذ",
      Unsaved: "غير منقذ",
      unsaved: "غير منقذ",
      "DOWNLOAD FAILED": "التحميل فشل",
      "download failed": "التحميل فشل",
      "Download failed": "التحميل فشل",
      "Tap on 'heading' and pull to refresh": "اضغط على 'عنوان' وسحب للتحديث",
      "No results found": "لا توجد نتائج",
      "no results found": "لا توجد نتائج",
      "NO RESULTS FOUND": "لا توجد نتائج",
      "Sorry no contact details found": "آسف لم يتم العثور على تفاصيل الاتصال",
      "Invalid Phone number": "رقم الهاتف غير صحيح",
      "Invalid OTP": "غير صالح OTP",
      "Please Try again": "حاول مرة اخرى",
      "Please enter a password": "يرجى إدخال كلمة مرور",
      "Check your mobile data or wifi": "تحقق من بيانات هاتفك المحمول أو wifi",
      "This is static notification": "هذا هو إعلام ثابت",

      "Please accept terms and conditions": "يرجى قبول الشروط والأحكام",
      "Please fill all": "عادة المحاولة",
      "Please fill all fields": "املأ جميع الحقول",
      "Please accept the agreement": "رجى قبول الاتفاقية",
      "please login first": "الرجاء تسجيل الدخول أولا",
      "Please login first": "الرجاء تسجيل الدخول أولا",
      "Login first": "سجل الدخول أول",
      "Upload atlest one photo": "تحميل صورة واحدة على الأقل",
      "upload atlest one photo": "تحميل صورة واحدة على الأقل",
      "Fill all fields": "املأ جميع الحقول",
      "no categories found": "لا توجد فئات",
      "Successfully Suggested": "اقترح بنجاح",
      "Please wait for Admin Approval":
        "يرجى الانتظار للحصول على موافقة المسؤول",
      "please wait for dmin approval":
        "يرجى الانتظار للحصول على موافقة المسؤول",
      "Please Wait For Admin Approval":
        "يرجى الانتظار للحصول على موافقة المسؤول",
      "Please wait for Admin approval":
        "يرجى الانتظار للحصول على موافقة المسؤول",
      "Carefully fill all fields": "ملء جميع الحقول بعناية",
      "Successfully suggested": "اقترح بنجاح",
      suggest: "يقترحون",
      SUGGEST: "يقترحون",
      Suggest: "يقترحون",
      "view offer": "عرض",
      "View Offer": "عرض",
      "VIEW OFFER": "عرض",
      FAILED: "فشل",
      Failed: "فشل",
      failed: "فشل",
      Submitted: "قدمت",
      Done: "فعله",
      DONE: "فعله",
      Oops: "وجه الفتاة",
      OOPS: "وجه الفتاة",
      oops: "وجه الفتاة",
      done: "فعله",
      "Top RESTAURANTS": "المطاعم",
      "Top HOTELS": "الفنادق",
      ALL: "الكل",
      All: "الكل",
      all: "الكل",
      "Contact Info": "معلومات للتواصل",
      Refreshing: "منعش",
      refreshing: "منعش",
      "Pull to refresh": "سحب لتحديث",
      "pull to refresh": "سحب لتحديث",

      Share: "شارك",
      share: "شارك",
      "Posted On": "نشر على",
      "posted on": "نشر على",
      "Posted on": "نشر على",

      "Comment here": "التعليق هنا",
      "Comment Here": "التعليق هنا",
      "COMMENT HERE": "التعليق هنا",
      "comment here": "التعليق هنا",

      "Average Price": "متوسط الأسعا",
      "Average price": "متوسط الأسعا",
      "average price": "متوسط الأسعا",
      next: "التالى",
      Next: "التالى",
      NEXT: "التالى",
      "Report or Spam This": "أبلغ عن أذى",
      "report or spam this": "أبلغ عن أذى",

      "Confirm Exit": "تأكيد الخروج",
      "Do you want to exit?": "هل تريد الخروج؟",
      yes: "نعم",
      YES: "نعم",
      Yes: "نعم",
      No: "لا",
      no: "لا",
      NO: "لا",

      "Sexually inappropriate": "جنسيا غير لائق'",
      "Misleading or a scam": "مضللة أو خدعة",
      "False news story": "قصة إخبارية كاذبة",
      Spam: "بريد مؤذي",
      "Violent or prohibited content": "محتوى عنيف أو محظور",
      Offensive: "هجومي",

      "Loging in...": "تسجيل الدخول..",
      "loging in...": "تسجيل الدخول..",
      "Your report has been submitted": "وقد قدم التقرير الخاص بك",
      "upload photo (Max 5)": "(تحميل الصوره (ماكس 5",
      "Upload photo (Max 5)": "(تحميل الصوره (ماكس 5",
      "Upload Photo (Max 5)": "(تحميل الصوره (ماكس 5",
      "Title of Movie": "عنوان الفيلم",
      "Interesting Details": "تفاصيل مثيرة للاهتمام",
      "interesting details": "تفاصيل مثيرة للاهتمام",
      "Visit for": "زيارة ل",
      "visit for": "زيارة ل",
      "Minimum Price for Room": "أدنى سعر للغرفة",
      "Complimentary Breakfast": "إفطار مجاني",
      Features: "المميزات",
      features: "المميزات",
      "A Must Try": "يجب أن تجرب",
      Category: "الفئة",
      category: "الفئة",
      CATEGORY: "الفئة",

      "suggest movies": "اقتراح الأفلام",
      "Suggest movies": "اقتراح الأفلام",
      "Suggest Movies": "اقتراح الأفلام",
      "SUGGEST MOVIES": "اقتراح الأفلام",

      "suggest todo": "أقترح جاذبية",
      "Suggest Todo": "أقترح جاذبية",
      "Suggest todo": "أقترح جاذبية",
      "SUGGEST TODO": "أقترح جاذبية",

      "suggest restaurants": "اقتراح المطاعم",
      "Suggest Restaurants": "اقتراح المطاعم",
      "Suggest restaurants": "اقتراح المطاعم",
      "SUGGEST RESTAURANTS": "اقتراح المطاعم",

      "suggest hotels": "اقتراح الفنادق",
      "Suggest Hotels": "اقتراح الفنادق",
      "Suggest hotels": "اقتراح الفنادق",
      "SUGGEST HOTELS": "اقتراح الفنادق",
      "Page Not Found": "اقتراح الفنادق",

      "SUGGEST SERVICE": "الخدمة المقترحة",
      retry: "حاول مرة أخري",
      Retry: "حاول مرة أخري",
      RETRY: "حاول مرة أخري",
      "Try again later": "حاول مرة اخرى",
      "OTP has been send to registered mobile number":
        "تم إرسال otp جديد إلى رقم الهاتف المحمول المسجل",
      "Related Ads": "إعلانات ذات صلة",
      "related ads": "إعلانات ذات صلة",
      "Related ads": "إعلانات ذات صلة",
      VERIFY: "التحقق",
      "Please enter the OTP": "يرجى إدخال OTP",
      "Event added": "وأضاف الحدث",
      Show: "عرض",
      SHOW: "عرض",
      show: "عرض",
      "View more": "أظهر المزيد",
      "View less": "عرض أقل",
      "Add to calendar": "إضافة إلى التقويم",
      "My Listings": "قوائمي",
      "Do you want to delete?": "هل تريد أن تحذف؟",
      Services: "خدمات",
      Service: "خدمات",
      "Mobile number": "رقم الهاتف المحمول",
      Recommendations: "توصيات",
      "Jobs Available": "المهن متوفرة",
      "Jobs available": "المهن متوفرة",
      "Jobs wanted": "مطلوب عمل",
      "Jobs Wanted": "مطلوب عمل",
      "Monthly Salary": "راتب شهري",
      "Career Level": "المستوى الوظيفي",
      "Employment Type": "نوع الوظيفة",
      "LIVE CHAT": "دردشة مباشرة",
      "Type Here....": "أكتب هنا....",

      "Search in Classifieds": "البحث في الإعلانات المبوبة",
      "Search in Forums": "البحث في المنتديات",
      "Search in Events": "بحث الأحداث",
      "Search in Recommendations": "توصية البحث",
      "Search in Services": "خدمات البحوث",
      //from google translator
      experience: "تجربة",
      "Education Level": "مستوى التعليم",
      Company: "شركة",
      Apply: "تطبيق",
      "This is your post": "هذا هو مشاركتك",
      "You applied for this job": "هل تقدمت لهذا المنصب",
      "Invalid Address": "عنوان خاطئ",
      "Update Location": "تحديث الموقع",
      "Please Grant Permissions for better performance":
        "يرجى منح أذونات لتحسين الأداء",
      "Location disabled": "تم تعطيل الموقع",
      "Search in Jobs": "البحث في وظائف",
      "End Date": "تاريخ الانتهاء",
      "Set it as a Premium?": "تعيينها كقسط؟",
      "Place an Ad": "ضع إعلانا",
      "Ad has been added": "تمت إضافة الإعلان",
      "Feature your ad and get up to 10x more views":
        "اعرض إعلانك واحصل على أكثر من 10x مشاهدة",
      "Select CV": "اختر السيرة الذاتية",
      "No file chosen": "لم تقم باختيار ملف",
      "Back to Jobs Available": "العودة إلى الوظائف المتاحة",
      "Back to Jobs wanted": "العودة إلى الوظائف المطلوبة",
      "Invalid Url": "URL غير صالح",
      Language: "لغة",
      "Show Times": "أوقات العرض",
      Theatre: "مسرح",
      Genre: "نوع أدبي",
      "Watch Trailer": "مشاهدة اعلان",
      "Please select document file (pdf,doc or docx)":
        "يرجى تحديد ملف المستند (pdf أو doc أو docx)",
      Website: "موقع الكتروني",
      "Start date": "تاريخ البدء",
      "End date": "تاريخ الانتهاء",
      "Write your reply": "اكتب ردك",
      "Rate first": "معدل أولا",
      "Load more": "تحميل المزيد",
      Confirm: "تؤكد",
      "Book tickets": "حجز التذاكر"
    };
  }
}