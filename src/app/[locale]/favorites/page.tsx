"use client"
import IdCard from '@/components/shared/IdCard'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import React from 'react'

const MyFavorites = () => {
  return (
    <ProtectedRoute>
    <div className='relative pt-32 md:pt-40 pb-6 bg-gradient-to-b from-[#E0DAFF] to-[#fff]'
      style={{
        // background: 'linear-gradient(224.16deg, #E0DAFF -2.22%, #FECDFB 112.2%)',
      }}>
      <Image src="/photos/terms-bg.svg" alt='Terms Background' width={100} height={100} className='absolute w-full inset-x-0 top-0 z-1' />

      <div className='max-w-7xl mx-auto px-4 md:px-0 relative z-2'>
        <Tabs defaultValue="favorites">
          <TabsList className='w-fit mb-6'>
            <TabsTrigger value="favorites">التفضيلات</TabsTrigger>
            <TabsTrigger value="interested">من يهتم بي</TabsTrigger>
          </TabsList>
          <TabsContent value="favorites">
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
          </TabsContent>
          <TabsContent value="interested">
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3'>
              <IdCard isFav={true} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
              <IdCard isFav={false} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
              <IdCard isFav={true} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
              <IdCard isFav={true} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
              <IdCard isFav={false} name='mostafa' avatar='/photos/male-icon.svg' age={20} city="New York" job="Engineer" marriageType="Single" skinColor="Light" status="Active" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  )
}

export default MyFavorites