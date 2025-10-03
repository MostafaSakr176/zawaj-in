"use client";

import * as React from "react";
import { Mail, Lock, User, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Label from "@/components/ui/label";
import { FormField } from "@/components/ui/form";
import { TextField } from "@/components/ui/text-field";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Stepper } from "@/components/ui/stepper";

export default function FormsDemoPage() {
  const [login, setLogin] = React.useState({ email: "", password: "" });
  const [register, setRegister] = React.useState({
    username: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    bio: "",
  });
  const [step, setStep] = React.useState(1);

  const genderOptions = [
    { value: "male", label: "ذكر" },
    { value: "female", label: "أنثى" },
  ];

  const loginError =
    login.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login.email)
      ? "صيغة البريد غير صحيحة"
      : undefined;

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 space-y-12">
      {/* Login card example */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>تسجيل الدخول</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label={<Label>البريد الإلكتروني</Label>}
            hint="لا يظهر للمستخدمين"
            error={loginError}
          >
            <TextField
              placeholder="name@example.com"
              startAdornment={<Mail size={16} />}
              value={login.email}
              onChange={(e) =>
                setLogin((s) => ({ ...s, email: e.target.value }))
              }
            />
          </FormField>

          <FormField label={<Label>كلمة المرور</Label>}>
            <PasswordInput
              placeholder="********"
              value={login.password}
              onChange={(e) =>
                setLogin((s) => ({ ...s, password: e.target.value }))
              }
            />
          </FormField>
        </CardContent>
        <CardFooter className="flex items-center gap-4">
          <Button className="flex-1">تسجيل الدخول</Button>
          <Button variant="secondary" className="flex-1">
            تسجيل جديد
          </Button>
        </CardFooter>
      </Card>

      {/* Registration card example (demonstrates reuse) */}
      <Card>
        <CardHeader>
          <CardTitle>تسجيل حساب جديد</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label={<Label>اسم المستخدم</Label>}
            hint="يظهر للأخرين داخل المنصة"
          >
            <TextField
              placeholder="اسم المستخدم"
              startAdornment={<User size={16} />}
              value={register.username}
              onChange={(e) =>
                setRegister((s) => ({ ...s, username: e.target.value }))
              }
            />
          </FormField>

          <FormField label={<Label>الجنس</Label>} required>
            <Select
              options={genderOptions}
              placeholder="اختر الجنس"
              value={register.gender}
              onChange={(e) =>
                setRegister((s) => ({ ...s, gender: e.target.value }))
              }
            />
          </FormField>

          <FormField label={<Label>البريد الإلكتروني</Label>}>
            <TextField
              placeholder="name@example.com"
              startAdornment={<Mail size={16} />}
              value={register.email}
              onChange={(e) =>
                setRegister((s) => ({ ...s, email: e.target.value }))
              }
            />
          </FormField>

          <FormField label={<Label>رقم الجوال</Label>}>
            <PhoneInput
              placeholder="5xxxxxxxx"
              value={register.phone}
              onChange={(e) =>
                setRegister((s) => ({ ...s, phone: e.target.value }))
              }
            />
          </FormField>

          <FormField label={<Label>كلمة المرور</Label>}>
            <PasswordInput
              placeholder="********"
              value={register.password}
              onChange={(e) =>
                setRegister((s) => ({ ...s, password: e.target.value }))
              }
            />
          </FormField>

          <FormField
            label={<Label>إعادة كلمة المرور</Label>}
            error={
              register.confirm && register.confirm !== register.password
                ? "غير متطابقة"
                : undefined
            }
          >
            <PasswordInput
              placeholder="********"
              value={register.confirm}
              onChange={(e) =>
                setRegister((s) => ({ ...s, confirm: e.target.value }))
              }
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label={<Label>نبذة عنك</Label>}
              hint="يرجى الكتابة بطريقة جيدة."
            >
              <Textarea
                placeholder="اكتب هنا"
                value={register.bio}
                onChange={(e) =>
                  setRegister((s) => ({ ...s, bio: e.target.value }))
                }
              />
            </FormField>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">تسجيل</Button>
        </CardFooter>
      </Card>

      {/* Stepper preview demonstrating reuse across steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} /> مثال على خطوات التسجيل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Stepper
            activeIndex={step}
            steps={[
              { id: "s1", label: "الجنسية والإقامة" },
              { id: "s2", label: "مواصفاتك" },
              { id: "s3", label: "مواصفات الطرف الآخر" },
              { id: "s4", label: "أنواع الزواج" },
            ]}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label={<Label>الوزن (كجم)</Label>}>
              <TextField placeholder="60" />
            </FormField>
            <FormField label={<Label>الطول (سم)</Label>}>
              <TextField placeholder="160" />
            </FormField>
            <FormField label={<Label>لون الشعر</Label>}>
              <Select
                placeholder="فضلا اختر"
                options={[
                  { value: "black", label: "أسود" },
                  { value: "brown", label: "بني" },
                  { value: "blonde", label: "أشقر" },
                ]}
              />
            </FormField>
            <FormField label={<Label>لون العيون</Label>}>
              <Select
                placeholder="فضلا اختر"
                options={[
                  { value: "brown", label: "بني" },
                  { value: "hazel", label: "عسلي" },
                  { value: "green", label: "أخضر" },
                ]}
              />
            </FormField>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="flex-1"
          >
            قبل
          </Button>
          <Button
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            className="flex-1"
          >
            التالي
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
