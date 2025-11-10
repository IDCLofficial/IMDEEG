import { NextResponse } from "next/server";
import { comparePassword, generateToken} from "../../../../lib/passwordHandler";

export async function POST(request: Request) {
    const body = await request.json();
    const {email, password} = body;

    //check if email and password was reieved from the front end
    if(!email || !password){
        return NextResponse.json({
            message:"No input from login"
        }, {status:401})
    }

    //compare the email
    if(email !== process.env.ADMIN_EMAIL){
        return NextResponse.json({
            message:"Invalid email"
        }, {status:401})
    }

    //compare the password
    const result = comparePassword(password, `${process.env.ADMIN_HASH}`);
    if(!result){
        return NextResponse.json({
            message:"Invalid Password"
        },{status: 401})
    }

    // generate a jwt token
    const token = generateToken(email)

    return NextResponse.json({
        message: "Login successfull",
        token: token
    }, {status: 200})
}
