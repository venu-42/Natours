class APIFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }
    filter(){
        let queryObj = {...this.queryStr};
        const excludeKeys=['page','sort','limit','fields']
        excludeKeys.forEach(val=>{delete queryObj[val]})

        queryObj=JSON.stringify(queryObj)
        queryObj=queryObj.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)
        queryObj=JSON.parse(queryObj)

        // query can be executed by the below line too whereas for we cannot chain filter, sorts etc when directly called (using await)
        // const tours = await Tour.find(queryObj);

        this.query.find(queryObj); 
        return this;
    }
    sort(){
        if(this.queryStr.sort){
            // console.log(req.query.sort)
            let sortStr = this.queryStr.sort.split(',').join(' ')
            // console.log(sortStr)
            this.query.sort(sortStr)
        }
        else{
            this.query.sort('-createdAt')
        }
        return this
    }
    fields(){
        if(this.queryStr.fields){
            const fieldStr = this.queryStr.fields.split(',').join(' ')
            this.query.select(fieldStr);
        }
        else{
            this.query.select('-__v')
        }
        return this
    }
    pagination(){
        if(this.queryStr.page||this.queryStr.limit){
            const page=this.queryStr.page * 1 || 1;
            const limit = this.queryStr.limit * 1 || 100
            const skip = (page-1)*limit
            this.query.skip(skip).limit(limit)
        }
        return this
    }
}

module.exports=APIFeatures