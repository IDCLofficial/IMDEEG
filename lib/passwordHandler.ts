import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET

export function generateJWT(){
    return crypto.randomBytes(64).toString('hex');
}

export function hashPassword(password: string){
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword);
    return hashedPassword;
}

export function comparePassword(password: string, hash: string){
    return bcrypt.compareSync(password, hash);
}

export function generateToken(user: {email:string}){
    return jwt.sign({user}, `${JWT_SECRET}`, { expiresIn: '24h' });
}

export function verifyToken(token: string){
    return jwt.verify(token, generateJWT());
}
