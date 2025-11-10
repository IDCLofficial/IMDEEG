import Link from 'next/link';
import { Button } from './ui/button';

export default function SkillUpAd() {
  return (
    <div className="bg-blue-600 p-6 md:p-8 text-white shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <h3 className="text-2xl md:text-3xl font-bold">SkillUp Imo Cohort 4 Registration Now Open!</h3>
            <p className="text-blue-100">
              The Imo State Ministry of Digital Economy and eGovernment is delighted to announce the commencement of registrations for SkillUp Imo Cohort 4. This initiative continues our commitment to empowering Imo youths with cutting-edge digital skills and creating sustainable employment opportunities in the digital economy.  
            </p>
            <div className="pt-2">
              <Button asChild className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                <Link href="https://myimoapp.com" target="_blank" rel="noopener noreferrer">
                  Register Now in myimoapp
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 p-4 rounded-lg border border-white/20">
              <div className="text-center">
                <div className="">
                  <img src="/images/myimoapp.svg" alt="myimoapp" />
                </div>
                <p className="text-sm font-medium">Visit</p>
                <p className="text-sm">myimoapp.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
