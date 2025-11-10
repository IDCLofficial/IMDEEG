import crypto from "crypto"

function generateToken(){

    const random = crypto.randomBytes(64).toString('hex');
    console.log(random)
}

generateToken()

// function generateHash(){
//     const password = "Mdeeg121_";
//     const hash = bcrypt.hashSync(password, 10);
//     console.log(hash);
// }

// generateHash();
