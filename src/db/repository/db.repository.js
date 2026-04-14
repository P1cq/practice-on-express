
export class DBRepository {

    model;


    constructor(model){
        this.model=model;
    };

    async create(iteems){

       return await this.model.create(iteems);
    };

    async updateOne(filter,update,option={}){

        return await this.model.updateOne(filter,update,option);
    };
     async updateMany(filter,update,option={}){

        return await this.model.updateMany(filter,update,option);
    };

     async getOne(filter,projection,options={}){
        return await this.model.findOne(filter,projection,options);
    };

     async getAll(filter){
        return await this.model.find(filter,projection,options);
    };

     async deleteOne(filter,options={}){
        return await this.model.deleteOne(filter,options);
    };

      async deleteMany(filter){
        return await this.model.deleteMany(filter);
    };
       async aggregate(pipline,options={}){
        return await this.model.aggregate(pipline,options);
    };
};
