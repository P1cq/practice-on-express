
import bcrypt from "bcryptjs";



export const hash = async function (password,num) {
    return await bcrypt.hash(password,num);
}

export const  compare= async function (password,hashPasword) {
    
return await bcrypt.compare(password ,
    hashPasword );
}