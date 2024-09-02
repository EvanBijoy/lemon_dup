var panel1 = document.querySelector("#panel-1");
var panel2 = document.querySelector("#panel-2");
var panel3 = document.querySelector("#panel-3");

document.querySelector("#new-workspace-popup").style.visibility = "hidden";

document
    .querySelector("#workspace-icon")
    .addEventListener("click", function (e) {
        console.log("hello");
        panel2.style.display = "unset";
        panel3.style.display = "none";
        document.querySelector("#workspace-icon i").style.color = "#f1f1f1";
        document.querySelector("#profile-icon i").style.color = "#818181";
    });

document.querySelector("#profile-icon").addEventListener("click", function (e) {
    console.log("hello");
    panel2.style.display = "none";
    panel3.style.display = "flex";
    document.querySelector("#workspace-icon i").style.color = "#818181";
    document.querySelector("#profile-icon i").style.color = "#f1f1f1";
});

function logOut() {
    localStorage.removeItem("token");
    window.location.href = "/";
}

document.querySelector("#close-icon").addEventListener("click", function (e) {
    document.querySelector("#new-workspace-popup").style.visibility = "hidden";
});

document
    .querySelector("#add-workspace-button")
    .addEventListener("click", function (e) {
        console.log("hello");
        if (
            document.querySelector("#new-workspace-popup").style.visibility ==
            "hidden"
        ) {
            document.querySelector("#new-workspace-popup").style.visibility =
                "visible";
        }
    });

document.querySelector("#workspace-icon").click();

var workspaces = document.querySelector("#workspaces");
var newWorkspaceTextBox = document.querySelector("#namebox");

var card = `
                        <a class="card"> 
                            <div
                                class="thumb"
                                style="
                                    background-image: url(https://www.pixelstalk.net/wp-content/uploads/2016/06/Black-And-Red-HD-Photos.jpg);
                                "
                            ></div>
                            <article>
                                <h1></h1>
                                <span></span>
                            </article>
                        </a>
`;

document
    .querySelector("#create-workspace")
    .addEventListener("click", function (e) {
        console.log("hello");

        var newWorkspace = document.createElement("div");
        newWorkspace.className = "item";
        newWorkspace.innerHTML = card;

        newWorkspace.dataset.workspace = newWorkspaceTextBox.value;
        newWorkspaceTextBox.value = "";

        workspaces.appendChild(newWorkspace);

        newWorkspace.querySelector("span").innerHTML = newWorkspace.dataset.workspace;

        newWorkspace.addEventListener("click", (event) => {
            
        });

        document.querySelector("#new-workspace-popup").style.visibility = "hidden";
    });
