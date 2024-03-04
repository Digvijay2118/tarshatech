import  Loader from "react-js-loader";
{/* <Loader type="spinner-default" bgColor={"#000000"} title={"Please wait"} color={'#000000'} size={50}/> */}
const defaultLoaderProps = {
    type:"bubble-ping",
    bgColor:"#887549",
    title:"Loading...",
    color:"#887549",
    size:100
}


export const MyLoader = ({value,defaultLoader=defaultLoaderProps}) =>{
    let obj = defaultLoader;
    if(value){
       
            obj = {...defaultLoader,...value};
       
    }

    console.log(obj)

    return  (<><Loader type={obj?.type} bgColor={`${obj?.bgColor}`} title={obj?.title} color={obj?.color} size={obj?.size} /></>)
}