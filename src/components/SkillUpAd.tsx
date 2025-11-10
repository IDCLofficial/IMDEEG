import Link from 'next/link';
import { Button } from './ui/button';

export default function SkillUpAd() {
  return (
    <div className="bg-primary-green p-6 md:p-8 text-white shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-3 flex-1">
            <h3 className="text-2xl md:text-3xl font-bold">SkillUp Imo Cohort 4 Registration Now Open!</h3>
            <p className="text-blue-100">
              The Imo State Ministry of Digital Economy and eGovernment is delighted to announce the commencement of registrations for SkillUp Imo Cohort 4. This initiative continues our commitment to empowering Imo youths with cutting-edge digital skills and creating sustainable employment opportunities in the digital economy.  
            </p>
          </div>
          <div className="block">
            <div className="bg-white p-4 rounded-lg border border-white/20 flex flex-col items-center">
              <img src="/images/myimoapp.svg" alt="myimoapp" />
              <div className="pt-2">
                <Button asChild className=" text-green-700 bg-green-50 font-semibold cursor-pointer">
                  <Link href="https://www.myimoapp.com" target="_blank" rel="noopener noreferrer" className='cursor-pointer'>
                    Register Now in myimoapp
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
