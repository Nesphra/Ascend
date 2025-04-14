import Image from 'next/image'
import Phone from "@/components/img/Shot.png"
import { Button } from "@radix-ui/themes";
import Link from 'next/link';
import { SparklesCore } from './sparkles';

export default function Header() {
  return (
    <div className="flex items-center justify-center w-screen h-screen absolute top-0 left-0 bg-background z-10">
      <div className="absolute h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.8}
          maxSize={1.6}
          particleDensity={20}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div>
        <div className='flex flex-col gap-6 max-w-[300px] relative z-20'>
          <div className='flex flex-col gap-3'>
            <h1 className='text-5xl font-bold'>Level Up — Every Damn Day</h1>
            <p className='opacity-80 font-light'>Analyze your habits. Compete with friends. Meet the new you.</p>
          </div>
          <div className='flex flex-col w-auto gap-1'>
          <Button asChild type="button">
            <Link href="/sign-up">Unlock my potential</Link> 
          </Button>
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
    </div>
  );
}
