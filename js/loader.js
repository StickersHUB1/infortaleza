function hideLoader(){

  const loader = document.getElementById("loader");

  if(!loader) return;

  loader.style.opacity = "0";
  loader.style.transition = "opacity .4s";

  setTimeout(()=>{
    loader.remove();
  },400);

}