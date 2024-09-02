var mini = true;

function toggleSidebar() 
{
    if (mini) 
    {
        console.log("opening sidebar");
        document.getElementById("mySidebar").style.width = "fit-content";
        Array.from(document.getElementsByClassName("icon-text")).forEach((item) => {
            console.log(item);
            item.style.width = "15vw";
        });
        this.mini = false;
    } 
    else 
    {
        console.log("closing sidebar");
        Array.from(document.getElementsByClassName("icon-text")).forEach((item) => {
            item.style.width = "0";
        });
        this.mini = true;
    }
}