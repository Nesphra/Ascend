import Image from 'next/image'
import Phone from "@/components/img/Shot.png"

export default function Header() {
  return (
    <div className="flex justify-between items-center">
      <div className='flex flex-col gap-6 max-w-[300px]'>
        <div className='flex flex-col gap-3'>
          <h1 className='text-5xl font-bold'>Level Up — Every Damn Day.</h1>
          <p className='opacity-80 font-light'>Analyze your habits. Compete with friends. Meet the new you.</p>
        </div>
        <div className='flex flex-col w-auto gap-1'>
          <a href='/sign-up' className='text-[14px] font-semibold bg-red-500 rounded px-4 py-2 w-fit'>Unlock my potential →</a>
          <p className='text-xs font-light opacity-50'>Free to use. Put your credit card away.</p>
        </div>
      </div>
      <div className='hidden lg:block w-[300px] overflow-visible -translate-x-[50px]'>
        <Image
          src={Phone}
          width={550}
          alt="iphone image"
          style={{ maxWidth: "none" }}
        />
      </div>
    </div>
  );
}
