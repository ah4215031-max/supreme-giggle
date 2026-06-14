# 🏗️ معمارية منصة صحتي

## نظرة عامة

منصة صحتي مبنية بناءً على معمارية الطبقات (Layered Architecture) مع فصل واضح بين:
- Frontend (React)
- Backend (Node.js/Express)
- Database (MongoDB)

## 📊 هيكل البيانات

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (React)                    │
│  ├── Pages (الصفحات)                               │
│  ├── Components (المكونات)                         │
│  ├── Services (خدمات API)                          │
│  └── Redux (إدارة الحالة)                          │
└────────────────┬────────────────────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────────────────────┐
│                Backend (Express)                     │
│  ├── Routes (المسارات)                             │
│  ├── Controllers (التحكم)                          │
│  ├── Middleware (الوسيط)                           │
│  ├── Services (الخدمات)                            │
│  └── Models (النماذج)                              │
└────────────────┬────────────────────────────────────┘
                 │ MongoDB Driver
┌────────────────▼────────────────────────────────────┐
│            Database (MongoDB)                        │
│  ├── Users (المستخدمون)                            │
│  ├── Patients (المرضى)                             │
│  ├── Doctors (الأطباء)                             │
│  ├── Appointments (المواعيد)                        │
│  ├── Prescriptions (الوصفات)                        │
│  └── Medical Records (السجلات الطبية)              │
└─────────────────────────────────────────────────────┘
```

## 🔐 نماذج البيانات الرئيسية

### User (المستخدم)
```
{
  _id: ObjectId
  name: String (مطلوب)
  email: String (فريد، مطلوب)
  password: String (مشفر)
  phone: String
  role: 'patient' | 'doctor' | 'admin'
  isActive: Boolean
  profileImage: String
  createdAt: Date
  updatedAt: Date
}
```

### Patient (المريض)
```
{
  _id: ObjectId
  userId: ObjectId (reference to User)
  nationalId: String (فريد)
  dateOfBirth: Date
  gender: 'male' | 'female' | 'other'
  bloodType: String (A+, B-, etc)
  allergies: [String]
  chronicDiseases: [String]
  height: Number
  weight: Number
  emergencyContact: {
    name: String
    phone: String
    relation: String
  }
  createdAt: Date
  updatedAt: Date
}
```

### Doctor (الطبيب)
```
{
  _id: ObjectId
  userId: ObjectId (reference to User)
  specialization: String (Cardiology, Pediatrics, etc)
  medicalLicense: String
  licenseNumber: String (فريد)
  department: String
  yearsOfExperience: Number
  qualifications: [String]
  consultationFee: Number
  rating: Number (0-5)
  availableHours: [{
    day: String
    startTime: String
    endTime: String
  }]
  createdAt: Date
  updatedAt: Date
}
```

### Appointment (الموعد)
```
{
  _id: ObjectId
  patientId: ObjectId (reference to Patient)
  doctorId: ObjectId (reference to Doctor)
  appointmentDate: Date
  startTime: String (HH:mm)
  endTime: String (HH:mm)
  reason: String
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  notes: String
  diagnosis: String
  treatment: String
  createdAt: Date
  updatedAt: Date
}
```

### Prescription (الوصفة الطبية)
```
{
  _id: ObjectId
  patientId: ObjectId (reference to Patient)
  doctorId: ObjectId (reference to Doctor)
  appointmentId: ObjectId (optional)
  medicines: [{
    name: String
    dosage: String
    frequency: String
    duration: String
    instructions: String
  }]
  issueDate: Date
  expiryDate: Date
  status: 'active' | 'expired' | 'completed'
  createdAt: Date
  updatedAt: Date
}
```

## 🔄 سير العمل الرئيسي

### 1️⃣ التسجيل والمصادقة
```
المستخدم → يملأ نموذج التسجيل → POST /api/auth/register
Backend → يشفر كلمة المرور → يعشي مستخدم جديد
Database ← يحفظ المستخدم
```

### 2️⃣ حجز الموعد
```
المريض → يختار طبيب وتاريخ ووقت → POST /api/appointments
Backend → يتحقق من توفر الموعد
Database ← يحفظ الموعد الجديد
الطبيب ← إشعار جديد
```

### 3️⃣ إصدار الوصفة
```
الطبيب → يملأ بيانات الدواء → POST /api/prescriptions
Backend → ينشئ الوصفة
Database ← يحفظ الوصفة
المريض ← يمكنه عرض الوصفة
```

## 🛡️ الأمان

### المصادقة (Authentication)
- **JWT Tokens** - تحويل آمن
- **Access Token** - مدة قصيرة (1 ساعة)
- **Refresh Token** - مدة طويلة (7 أيام)

### التفويض (Authorization)
- **Role-Based Access Control (RBAC)**
- **Middleware للتحقق من الصلاحيات**

### تشفير البيانات
- **bcryptjs** - لتشفير كلمات المرور
- **HTTPS** - للنقل الآمن
- **Environment Variables** - للمفاتيح الحساسة

## 📡 API Endpoints

### Auth Endpoints
```
POST   /api/auth/register        - التسجيل
POST   /api/auth/login           - تسجيل الدخول
POST   /api/auth/logout          - تسجيل الخروج
POST   /api/auth/refresh         - تحديث التوكن
```

### User Endpoints
```
GET    /api/users/:id            - الحصول على بيانات المستخدم
PUT    /api/users/:id            - تحديث البيانات
DELETE /api/users/:id            - حذف الحساب
```

### Patient Endpoints
```
GET    /api/patients/:id         - بيانات المريض
PUT    /api/patients/:id         - تحديث البيانات
GET    /api/patients/:id/records - السجلات الطبية
```

### Doctor Endpoints
```
GET    /api/doctors              - قائمة الأطباء
GET    /api/doctors/:id          - معلومات الطبيب
GET    /api/doctors/:id/schedule - جدول الأطباء
```

### Appointment Endpoints
```
GET    /api/appointments         - المواعيد
POST   /api/appointments         - حجز موعد
GET    /api/appointments/:id     - معلومات الموعد
PUT    /api/appointments/:id     - تحديث الموعد
DELETE /api/appointments/:id     - إلغاء الموعد
```

### Prescription Endpoints
```
GET    /api/prescriptions        - الوصفات
POST   /api/prescriptions        - إنشاء وصفة
GET    /api/prescriptions/:id    - تفاصيل الوصفة
PUT    /api/prescriptions/:id    - تحديث الوصفة
```

## 🎨 Frontend Structure

```
client/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/              # مكونات المصادقة
│   │   ├── common/            # مكونات عامة
│   │   ├── dashboard/         # لوحة التحكم
│   │   └── patient/           # مكونات المريض
│   ├── pages/
│   │   ├── AuthPage
│   │   ├── DashboardPage
│   │   ├── AppointmentsPage
│   │   └── ProfilePage
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── patientService.ts
│   │   └── appointmentService.ts
│   ├── redux/
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── patientSlice.ts
│   │   │   └── appointmentSlice.ts
│   ├── styles/
│   │   ├── theme.ts
│   │   └── global.css
│   └── App.tsx
└── package.json
```

## 📈 خطط التوسع المستقبلية

- ✅ تطبيق موبايل (React Native)
- ✅ نظام الدفع الإلكتروني
- ✅ تحليلات متقدمة
- ✅ تكامل مع الأنظمة الحكومية
- ✅ دعم اللغات المتعددة
- ✅ نظام الفيديو كونفرانس

---

آخر تحديث: 2026-06-14
