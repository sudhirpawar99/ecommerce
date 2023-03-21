const { json } = require("express/lib/response");

class ApiFeatures{
    constructor(query,querystr){
        this.query = query,
        this.querystr = querystr
    }
    search(){
        //keyword means the name in query string like if /?name=sudhir then keyword is name
        const keyWord =this.querystr.keyword ?{
            name:{
                $regex :this.querystr.keyword,
                $options : "i",
            },
        }:{};
        console.log(keyWord);
        this.query = this.query.find({...keyWord});
        return this;
    }

    filter(){
        //if directly use this.query then the refernce of this.query object passed and if change querycopy then it 
        //it reflect to query so we use ... spread operator to change only in querycopy.
        const queryCopy = {...this.querystr}
        const removeField = ["keyword","page","limit"];
        removeField.forEach((key)=>delete queryCopy[key]);

        //Bellow filter user to get filterd data using price
        let querystr = JSON.stringify(queryCopy);
        //Bellow filter use to replace gt,gte,lt,lte with $gt,$gte,$lt,$lter using regular expression.bcz mongodb required $
        querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);
        this.query = this.query.find(JSON.parse(querystr)); 
        return this;  
    }
    //This function used to pagination  
    pagination(resultPage){
        const currentPage = Number(this.querystr.page) || 1;
        //skip no of row using current page and resultpage(i.e row per page)
        const skip = resultPage*(currentPage-1);
        //Get Perpage data using resultPage and skip remaining data using 'skip'
   
        this.query =this.query.limit(resultPage).skip(skip)
        return this;
    }
}

module.exports = ApiFeatures;