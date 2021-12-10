
const prom=new Promise((res,rej)=>{
    setTimeout(()=>rej('2'),5000);
})


prom.then(val=>{
    console.log('success 1');
    return 1;
},val=>{
    console.log('error 1')
    throw new Error(1);
})
.then(_=>{
    console.log("returned value:",_,'\n',"IN success 2");
},_=>{
    console.log("returned value:",_,'\n',"IN error 2");
})