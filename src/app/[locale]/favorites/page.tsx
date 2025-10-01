import IdCard from '@/components/shared/IdCard'
import Image from 'next/image'
import React from 'react'

const MyFavorites = () => {
  return (
    <div className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'
      style={{
        // background: 'linear-gradient(224.16deg, #E0DAFF -2.22%, #FECDFB 112.2%)',
      }}>
      <Image src="/photos/terms-bg.svg" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />

      <div className='max-w-7xl mx-auto px-4 relative z-2 rounded-3xl p-3 shadow-lg'
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.54) 0%, rgba(255, 255, 255, 0.256) 100%)',
        }}
      >
        <div className='p-2 mb-4 flex items-center justify-between rounded-3xl border border-[#EAECF0]'
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.24) 100%)"
          }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src={"/photos/male-icon.svg"}
                alt={"avatar"}
                width={80}
                height={80}
                className="rounded-full"
              />
              {true && (
                <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[#2DC653] ring-3 ring-white" />
              )}
            </div>
            <div>
              <div className="text-[#301B69] text-2xl">اهلا بك</div>
              <div className="flex items-center justify-end gap-1">
                <h4 className="text-3xl font-semibold text-[#301B69] leading-none">
                  الحازمي عبدلله
                </h4>
                {true && <Image src={"/icons/virify.svg"} alt="virify" width={16} height={16} />}
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3'>
          <IdCard isFav={true} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
          <IdCard isFav={false} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
          <IdCard isFav={true} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
          <IdCard isFav={true} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
          <IdCard isFav={false} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
          <IdCard isFav={true} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
          <IdCard isFav={false} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
          <IdCard isFav={true} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
          <IdCard isFav={true} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
          <IdCard isFav={false} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
          <IdCard isFav={true} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
          <IdCard isFav={false} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
        </div>
      </div>
    </div>
  )
}

export default MyFavorites