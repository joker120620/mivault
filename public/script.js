
// funcion capyurar items 
function capItem(name) {
    let item = document.getElementById(name);
    return item.value;
}
const btnChangePositionSvgLogin = document.getElementById("btnChangePositionSvgLogin");
const btnChangePositionSvgRegister = document.getElementById("btnChangePositionSvgRegister");

btnChangePositionSvgLogin.addEventListener("click", ()=>{
    document.getElementById("image-svg-slice").classList.add("image-svg-slice-right")
    document.getElementById("image-svg-slice").classList.remove("image-svg-slice-left")
})
btnChangePositionSvgRegister.addEventListener("click", ()=>{
    document.getElementById("image-svg-slice").classList.add("image-svg-slice-left")
    document.getElementById("image-svg-slice").classList.remove("image-svg-slice-right")
})