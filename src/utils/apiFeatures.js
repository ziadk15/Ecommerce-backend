export class apiFeatures {

    constructor(mongooseQuery,data){

        this.mongooseQuery = mongooseQuery
        this.data = data
    }

    pagination (){

        const {page,size} = this.data
        if (!page || page <= 0) {
            page = 1
        }
        if (!size || size <= 0) {
            size = 2
        }
        const skip = (page - 1) * size

        this.mongooseQuery.limit(parseInt(size)).skip(parseInt(skip))
        return this;

    }

    filter(){


        let filter = {...this.data}
        let excludeQueryParams = ['page','size','skip','fields','sort','search']
        excludeQueryParams.forEach((element)=>{
            delete filter[element]
        })
        filter = JSON.parse(JSON.stringify(filter).replace(/(gt|lt|eq|gte|lte|ne|nin|in)/g,(match)=>`$${match}`))
        this.mongooseQuery.find(filter)

        return this
    }

    sort(){

        this.mongooseQuery.sort(this.data.sort.replaceAll(',',' '))
        return this
    }

    fields(){
        this.mongooseQuery.select(this.data.fields.replaceAll(',',' '))
        return this
    }

    search(){
        this.mongooseQuery.find({
                name:{$regex: this.data.search}
            })
            return this
    }
}

