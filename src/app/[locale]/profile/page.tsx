"use client"
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Label from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BadgeCheck, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'


type FieldProps = { label: string; value: string };
const Field = ({ label, value }: FieldProps) => (
  <div className="flex flex-col gap-1 px-3">
    <span className="text-base text-[#727272]">{label}</span>
    <span className="text-[#301B69]">{value}</span>
  </div>
);

const PartnerProfile = () => {
  return (
    <ProtectedRoute>
    <div className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff] space-y-4'
      style={{
        // background: 'linear-gradient(224.16deg, #E0DAFF -2.22%, #FECDFB 112.2%)',
      }}>
      <Image src="/photos/terms-bg.svg" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />

      <div className='max-w-7xl mx-auto px-4 relative z-2 rounded-3xl py-6 shadow-lg space-y-6 bg-white border border-[#301B6929]'>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-3">

          {/* Profile summary (right in RTL) */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/photos/male-icon.svg"
                alt="avatar"
                width={72}
                height={72}
                className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full ring-4 ring-white shadow"
              />
              <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-[#28C76F] ring-2 ring-white" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-end gap-1">
                  <h4 className="text-2xl font-semibold text-[#301B69] leading-none">
                    الحازمي عبدلله
                  </h4>
                  {true && <Image src={"/icons/virify.svg"} alt="virify" width={16} height={16} />}
                </div>
              </div>
              <div className="text-[#8A97AB] text-base ">رقم العضوية 1123444</div>
            </div>
          </div>
          {/* Actions (left in RTL) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode" className='mb-0'>متصل</Label>
            </div>
            <button className="flex items-center gap-2 rounded-full border border-[#E9E6FF] bg-[#301B6914] px-4 py-2 text-[#2D1F55] font-semibold hover:bg-white transition focus:outline-none">
              <Image src="/icons/foots.svg" alt="favorite" width={24} height={24} />
              من زار بياناتي
              <span className='text-lg w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center leading-1'>5</span>
            </button>
            <button className="flex items-center gap-2 rounded-full border border-[#E9E6FF] bg-[#301B6914] px-4 py-2 text-[#2D1F55] font-semibold hover:bg-white transition focus:outline-none">
              <Image src="/icons/edit-user.svg" alt="favorite" width={24} height={24} />
              تعديل بياناتي
            </button>
          </div>
        </div>

        <hr className="border-[#ECEBFF]" />

        {/* Section: السكن و الحالة الإجتماعية */}
        <div className="px-2 md:px-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[#2D1F55] font-semibold text-base">السكن و الحالة الإجتماعية</h4>
          </div>
          <div className="flex items center gap-4">
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="الجنسية" value="السعودية غير قبلية" />
            </div>
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="مكان الإقامة" value="السعودية - جدة" />
            </div>
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="العمر" value="30 سنة" />
            </div>
            <div>
              <Field label="الحالة العائلية" value="عزب" />
            </div>
          </div>
        </div>

        <hr className="border-[#ECEBFF]" />

        {/* Section: المظهر و الصحة */}
        <div className="px-2 md:px-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[#2D1F55] font-semibold text-base">المظهر و الصحة</h4>
          </div>
          <div className="flex items center gap-4">
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="لون البشرة" value="قمحي غامق" />
            </div>
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="الطول و الوزن" value="154 سم , 80 كج" />
            </div>
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="لون العين" value="أسود" />
            </div>
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="نوع الشعر" value="ناعم" />
            </div>
            <div>
              <Field label="لون الشعر" value="أسود" />
            </div>
          </div>
        </div>

        <hr className="border-[#ECEBFF]" />

        {/* Section: الدراسة و العمل */}
        <div className="px-2 md:px-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[#2D1F55] font-semibold text-base">الدراسة و العمل</h4>
          </div>
          <div className="flex items center gap-4">
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="المؤهل التعليمي" value="جامعي" />
            </div>
            <div>
              <Field label="الوظيفة" value="معلم" />
            </div>
          </div>
        </div>

        <hr className="border-[#ECEBFF]" />

        {/* Section: مواصفاتي أنا */}
        <div className="px-2 md:px-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[#2D1F55] font-semibold text-base">مواصفاتي أنا</h4>
          </div>
          <div className="flex items center gap-4">
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="المؤهل التعليمي" value="جامعي" />
            </div>
            <div>
              <Field label="الوظيفة" value="معلم" />
            </div>
          </div>
        </div>

      </div>
      <div className='max-w-7xl mx-auto px-4 relative z-2 rounded-3xl py-6 shadow-lg space-y-6 bg-white border border-[#301B6929]'>
        <h3 className='text-3xl font-semibold text-[#301B69]'>مواصفات شريك حياتي</h3>

        {/* Section: السكن و الحالة الإجتماعية */}
        <div className="px-2 md:px-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[#2D1F55] font-semibold text-base">السكن و الحالة الإجتماعية</h4>
          </div>
          <div className="flex items center gap-4">
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="الجنسية" value="السعودية غير قبلية" />
            </div>
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="مكان الإقامة" value="السعودية - جدة" />
            </div>
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="العمر" value="30 سنة" />
            </div>
            <div>
              <Field label="الحالة العائلية" value="عزب" />
            </div>
          </div>
        </div>

        <hr className="border-[#ECEBFF]" />

        {/* Section: المظهر و الصحة */}
        <div className="px-2 md:px-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[#2D1F55] font-semibold text-base">المظهر و الصحة</h4>
          </div>
          <div className="flex items center gap-4">
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="لون البشرة" value="قمحي غامق" />
            </div>
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="الطول و الوزن" value="154 سم , 80 كج" />
            </div>
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="لون العين" value="أسود" />
            </div>
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="نوع الشعر" value="ناعم" />
            </div>
            <div>
              <Field label="لون الشعر" value="أسود" />
            </div>
          </div>
        </div>

        <hr className="border-[#ECEBFF]" />

        {/* Section: الدراسة و العمل */}
        <div className="px-2 md:px-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[#2D1F55] font-semibold text-base">الدراسة و العمل</h4>
          </div>
          <div className="flex items center gap-4">
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="المؤهل التعليمي" value="جامعي" />
            </div>
            <div>
              <Field label="الوظيفة" value="معلم" />
            </div>
          </div>
        </div>

        <hr className="border-[#ECEBFF]" />

        {/* Section: مواصفاتي أنا */}
        <div className="px-2 md:px-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[#2D1F55] font-semibold text-base">مواصفاتي أنا</h4>
          </div>
          <div className="flex items center gap-4">
            <div className="rtl:border-l ltr:border-r border-[#ECEBFF]">
              <Field label="المؤهل التعليمي" value="جامعي" />
            </div>
            <div>
              <Field label="الوظيفة" value="معلم" />
            </div>
          </div>
        </div>

      </div>
    </div>
    </ProtectedRoute>
  )
}

export default PartnerProfile