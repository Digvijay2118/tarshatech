import Swal from "sweetalert2";
const defaultSwal = {
    title: 'Are you sure?',
    text: "",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  };

const checkValidObject = (object) => {
    
    try{
        return Object.prototype.toString.call(object)==="[object Object]";
    }catch(err){
        console.log(err);
        return false;
    }
    
}

export const SwalAlert = (CustomSwal,defaultObj=defaultSwal) =>{
    let obj = defaultObj;
    if(CustomSwal){
       if(checkValidObject(CustomSwal)){
        obj = {...defaultObj,...CustomSwal};
       }
   }

   console.log(obj);

   return new Promise((resolve,reject)=>{
    //result.isConfirmed;
    Swal.fire(obj).then((result)=>{
          resolve(result);
      }).catch((err)=>{
          reject(err);
      })
   })


}