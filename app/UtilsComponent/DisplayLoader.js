import Loader from 'react-js-loader';
{/* <Loader type="spinner-default" bgColor={"#000000"} title={"Please wait"} color={'#000000'} size={50}/> */}
const defaultLoaderProps = {
    type:"spinner-default",
    bgColor:"#000000",
    title:"Please wait",
    color:"#000000",
    size:50
}

const checkValidObject = (object) => {
    
    try{
        return Object.prototype.toString.call(object)==="[object Object]";
    }catch(err){
        console.log(err);
        return false;
    }
    
}

export const displayLoader = (customLoader,defaultLoader=defaultLoaderProps) =>{
    let obj = defaultLoader;
    if(customLoader){
        if(checkValidObject(customLoader)){
         obj = {...defaultLoader,...customLoader};
        }
    }

    return <><Loader type={obj?.type} bgColor={`${obj?.bgColor}`} title={obj?.title} color={obj?.color} size={obj?.size}/></>
}