import date from 'date-and-time';
import classNames from "classnames"
import moment from 'moment';
import { todayDate } from '../services/DateTimeService';

export const displayError = (message="This field is required",classname="invalid-feedback")=>{
    return (<div className={classname}>{message}</div>)
}

export const formclass = (condition,defaultClass="form-control")=>{
    return classNames(`${defaultClass}`,{"is-invalid":condition})
}

export const checkFile = (filename,extension_arr=["jpg","jpeg","png"])=>{
    try{
        const extension = filename.split(".").pop();
        return extension_arr.includes(extension);
    }catch(err){
        return false;
    }
}

export const isDateInBetween = (_main_date=todayDate(),start_date=todayDate(),end_date=todayDate()) =>{
    try{
        return moment(_main_date).isBetween(start_date,end_date) || moment(_main_date).isSame(start_date) || moment(_main_date).isSame(end_date)
    }catch(err){
        console.log(err);
        return false;
    }
}

export const isDateSameOrAfter = (_main_date=todayDate(),start_date=todayDate()) =>{
    try
    {
        return moment(_main_date).isAfter(start_date) || moment(_main_date).isSame(start_date);
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

export const isDateSameOrBefore = (_main_date=todayDate(),end_date=todayDate()) =>{
    try
    {
        return moment(_main_date).isBefore(end_date) || moment(_main_date).isSame(end_date);
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}


//Return true if value is empty
export const isEmpty = (value) =>{
    return !value;
}

//Can be used with first_name,lastName when no space is needed
export const onlyAlphabet = (value) =>{
    const REG_EX = /^[a-zA-Z]+$/;
    return REG_EX.test(value);
}

//Email
export const isEmail = (value) =>{
    const REG_EX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return REG_EX.test(value);
}

//10 digit phone number
export const isPhone = (value) =>{
    const REG_EX = /^\d{10}$/;
    return REG_EX.test(value);    
}

//6 digits zip code
export const isZipCode = (value) =>{
    const REG_EX = /^\d{6}$/;
    return REG_EX.test(value);  
}

//check value is undefined of not
export const isUndefined = (value)=>{
    return typeof value==="undefined"
}

export const validateDate = (_date,_format="MM-DD-YYYY") =>{
    if(_date || _format) return false;
    return date.isValid(_date,_format);
}

export const validationMessage = {
    mobile:"10 digits mobile no. is allowed",
    zipcode:"6 digits zipcode is allowed",
    confirm_password:"Confirm password doesn't match"
}
