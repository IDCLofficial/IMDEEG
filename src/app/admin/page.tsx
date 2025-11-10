"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";



export default function Login(){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    useEffect(()=>{
        console.log(email, password)
    }, [email, password])
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = Object.fromEntries(formData.entries());
        
        const response = await fetch("/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log(result);
    }
    return(
        <div className="w-full h-screen flex items-center justify-center">
            <div className="lg:flex items-start gap-4 shadow-md border-1 border-gray-200 h-[70%] w-[70%]">
                <div className="h-full lg:w-[50%] max-lg:hidden w-full flex-1 p-8">
                    <Image src="/images/e-gov.jpg" alt="banner" width={500} height={500} className="object-contain w-full h-full"/>
                </div>
                <div className="lg:w-[50%] w-full p-4 flex-1 h-full p-8 bg-gray-200  flex items-center justify-center">
                    <form className="flex flex-col gap-4 w-full" onSubmit={(e)=>handleSubmit(e)}>
                        <h1 className="text-3xl font">Login</h1>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            className={`p-2 rounded-md outline-0 focus:outline-1 focus:outline-gray-200 bg-white border ${
                                email.length
                                ? emailRegex.test(email) ? "border-green-600" : "border-red-600"
                                : "border-gray-400"
                            }`} 
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                        <input 
                            type="password" 
                            name="password"  
                            placeholder="Password" 
                            className={`p-2 rounded-md outline-0 focus:outline-1 focus:outline-gray-200 bg-white border ${
                                password.length
                                ? passwordRegex.test(password) ? "border-green-600" : "border-red-600 after:content-['Password must contain a capital letter, a small Letter, a number and a special character'] after:block"
                                : "border-gray-400"
                            }`} 
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                        <button type="submit" className="p-2 rounded-md bg-primary-green text-white cursor-pointer text-base">Continue</button>
                    </form>
                </div>
            </div>
        </div>
    )
}