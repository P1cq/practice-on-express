
import jwt from 'jsonwebtoken';

export const signToken= function(payload,key,options){
return jwt.sign(payload,key,options);
};
export const verifyToken= function(token,key='12344123141241512414141231312'){
  const payload= jwt.verify(token,
      key);
      return payload;
};

export const genarateTokens=function (payload){

  const accesToken= signToken(payload,"12i47281y647d18d823hr1232144kksklslske990921d1",
  {expiresIn:'1h'})

const refreshToken= signToken(payload,"223rryrt56wew28irjdkg019238uriplxasdf01923j312hf",
  {
  expiresIn:'1y'
});

return {refreshToken,accesToken}
};