module.exports ={
    mailPattern:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    phonePattern:/^\d{10}$/,
    alphabetSpace:/^[a-zA-Z ]*$/,
    alphabetSpaceWithDot:/^[a-zA-Z. ]*$/,
    alphabets:/^[a-zA-Z]*$/,
    numericPattern:/^([0-9]*[.])?[0-9]+$/,
    floatPattern:/^[0-9]*(\.[0-9]+)?$/,
    pureNumbers:/^\d+$/,
    urlPatterns:/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/,
    urlPatterns2:/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/g,
}