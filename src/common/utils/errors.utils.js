
export class ConfligExptions extends Error {

constructor(message){

    super(message,{cause:409});
};
};

export class NotFound extends Error {

constructor(message){

    super(message,{cause:404});
};
};


export class BadRequist extends Error {
details;
constructor(message,details=[]){

    super(message,{cause:400});
this.details=details;
   
};
};


export class UnAouthrize extends Error {

constructor(message){

    super(message,{cause:401});
};
};

