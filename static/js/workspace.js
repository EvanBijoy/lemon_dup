var token = localStorage.getItem("token");
var email = localStorage.getItem("email");

var audioTimeline = document.getElementById("timeline-audio-container");

var item = document.getElementById("timeline-image-container");

item.addEventListener("wheel", function (e) {
    console.log("scrolling");
    if (e.deltaY > 0) {
        sideScroll(item, "right", 10, 400, 400);
    } else {
        sideScroll(item, "left", 10, 400, 400);
    }
});

var imageContainer = document.getElementById("image-container");

function sideScroll(element, direction, speed, distance, step) {
    scrollAmount = 0;
    var slideTimer = setInterval(function () {
        if (direction == "left") {
            element.scrollLeft -= step;
        } else {
            element.scrollLeft += step;
        }
        scrollAmount += step;
        if (scrollAmount >= distance) {
            window.clearInterval(slideTimer);
        }
    }, speed);
}

function dropHandler(event) {
    event.preventDefault();

    if (event.dataTransfer.items) {
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === "file") {
                const file = event.dataTransfer.items[i].getAsFile();
                displayImage(file);
            }
        }
    }
}

function dragOverHandler(event) {
    event.preventDefault();
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

function fileInputHandler(event) {
    console.log("imageFrame");

    const files = event.target.files;

    uploadImageFiles(files);

    console.log(files.length);

    for (let i = 0; i < files.length; i++) {
        console.log("imageFrame");
        displayImage(files[i]);
    }
}

function displayImage(file) {
    console.log("imageFrame");

    var reader = new FileReader();
    reader.onload = function (e) {
        var imageFrame = document.createElement("div");
        imageFrame.className = "image-frame";
        imageFrame.setAttribute("draggable", true);
        console.log(imageFrame);
        imageFrame.style.backgroundImage = "url(" + e.target.result + ")";
        imageFrame.id =
            "id-" +
            file.name
                .replaceAll(" ", ":")
                .replaceAll("(", ":-:")
                .replaceAll(")", ":-:");
        console.log("hello" + imageFrame.id);
        createDeleteIcon(imageFrame);
        // imageFrame.addEventListener("click", () =>
        //     confirmDeleteImage(imageFrame),
        // );

        imageFrame.dataset.name = file.name;
        imageFrame.dataset.duration = 1;
        imageFrame.dataset.transition = 4;

        imageFrame.addEventListener("dragstart", () => {
            imageFrame.classList.add("dragging");
        });

        imageFrame.addEventListener("dragend", () => {
            imageFrame.classList.remove("dragging");
        });

        imageFrame.addEventListener("click", () => {
            addToTimeline(imageFrame);
        });

        imageFrame.addEventListener("mouseover", () => showIcons(imageFrame));
        imageFrame.addEventListener("mouseout", () => hideIcons(imageFrame));
        imageContainer.appendChild(imageFrame);
    };
    reader.readAsDataURL(file);
}

function displayWebImage(path) {
    console.log("imageFrame");

    const imageContainer = document.getElementById("image-container");
    var imageFrame = document.createElement("div");
    imageFrame.className = "image-frame";
    imageFrame.setAttribute("draggable", true);
    console.log(imageFrame);
    imageFrame.style.backgroundImage =
        "url(/static/uploads/users/" + email + "/images/" + path + ")";
    imageFrame.id = "id-" + path;

    imageFrame.dataset.name = path;
    imageFrame.dataset.duration = 1;
    imageFrame.dataset.transition = 4;

    createDeleteIcon(imageFrame);
    // imageFrame.addEventListener("click", () =>
    //     confirmDeleteImage(imageFrame),
    // );

    imageFrame.addEventListener("dragstart", () => {
        imageFrame.classList.add("dragging");
    });
    imageFrame.addEventListener("dragend", () => {
        imageFrame.classList.remove("dragging");
    });

    imageFrame.addEventListener("click", () => {
        addToTimeline(imageFrame);
    });

    imageFrame.addEventListener("mouseover", () => showIcons(imageFrame));
    imageFrame.addEventListener("mouseout", () => hideIcons(imageFrame));
    imageContainer.appendChild(imageFrame);
}

function showIcons(img) {
    img.getElementsByClassName("delete-icon")[0].classList.add("visible");
    var settingsIcon = img.getElementsByClassName("settings-icon")[0];

    if (settingsIcon) {
        settingsIcon.classList.add("visible");
    }
}

function hideIcons(img) {
    img.getElementsByClassName("delete-icon")[0].classList.remove("visible");

    var settingsIcon = img.getElementsByClassName("settings-icon")[0];

    if (settingsIcon) {
        settingsIcon.classList.remove("visible");
    }
}

function createDeleteIcon(img) {
    const deleteIcon = document.createElement("span");
    deleteIcon.className = "delete-icon";
    deleteIcon.classList.add("material-icons");
    deleteIcon.innerHTML = "delete";
    img.appendChild(deleteIcon);
    deleteIcon.addEventListener("click", (event) => {
        console.log("hello");

        event.stopPropagation(); // Prevent click on the image when clicking the delete icon
        confirmDeleteImage(event.target.parentNode);
    });
}

function createSettingsIcon(img) {
    const deleteIcon = document.createElement("span");
    deleteIcon.className = "settings-icon";
    deleteIcon.classList.add("material-icons");
    deleteIcon.innerHTML = "settings";
    img.appendChild(deleteIcon);
    deleteIcon.addEventListener("click", (event) => {
        console.log("settings");

        event.stopPropagation(); // Prevent click on the image when clicking the delete icon
        openPopup(img);
    });
}

function confirmDeleteImage(img) {
    const result = window.confirm("Do you want to delete this image?");
    if (result) {
        console.log(img.id);
        if (!img.id.startsWith("id-time")) {
            deleteImage(img.id.substring(3));
            img.remove();
        } else {
            img.remove();
            // updateTimeline();
            sortifyImages();
        }
    }
}

const musicList = document.getElementById("music-list");
const dropArea = document.getElementById("drop-area-audio");
const fileInput = document.getElementById("file-input");
const player = document.getElementById("audio-player");

document.addEventListener("DOMContentLoaded", function () {
    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.classList.add("dragover");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("dragover");
    });

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove("dragover");
        handleDrop(e.dataTransfer.files);
    });

    fileInput.addEventListener("change", (e) => {
        uploadAudioFiles(e.target.files);
        handleDrop(e.target.files);
    });

    function handleDrop(files) {
        for (const file of files) {
            const listItem = createMusicItem(file);
            musicList.appendChild(listItem);
        }
    }

    function createMusicItem(file) {
        console.log(file.name);
        const listItem = document.createElement("li");
        listItem.className = "music-item";
        listItem.style.display = "flex";
        listItem.style.justifyContent = "flex-start";
        listItem.style.alignItems = "center";
        listItem.style.cursor = "pointer";

        const deleteBtn = document.createElement("span");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "❌";
        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            playMusic(null);
            deleteAudio(file.name);
            listItem.remove();
        });
        deleteBtn.style.marginLeft = "auto";

        // const radio = document.createElement("span");
        // radio.className = "material-icons radio-icon-button";
        // radio.innerHTML = "radio_button_unchecked";
        // radio.style.color = "var(--red)";
        // radio.style.marginRight = "20px";

        const addBtn = document.createElement("span");
        addBtn.className = "material-icons";
        addBtn.innerHTML = "add";
        addBtn.style.color = "var(--red)";
        addBtn.style.marginRight = "20px";
        addBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            playWebMusic(null);
            console.log(file.name);
            trimAudioClip(file.name, 10, 20);
        });

        const fileName = document.createElement("span");
        fileName.innerText = file.name;

        listItem.appendChild(addBtn);
        // listItem.appendChild(radio);
        listItem.appendChild(fileName);
        listItem.appendChild(deleteBtn);

        listItem.addEventListener("click", (item) => {
            var radioButtons =
                musicList.getElementsByClassName("radio-icon-button");

            for (icon of radioButtons) {
                icon.innerHTML = "radio_button_unchecked";
            }

            // radio.innerHTML = "radio_button_checked";

            playWebMusic(file.name);
        });

        return listItem;
    }

    function playMusic(file) {
        const url = URL.createObjectURL(file);
        player.src = url;
        player.play();
    }
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "flex";
    evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", (event) => {
    openTab(event, "image");
    document.getElementsByClassName("tablinks")[0].classList.add("active");
});

function exportVideo() {
    const selectedResolution = document.getElementById("options").value;
    const videoResolution = {
        default: 2,
        "1080p": 1,
        "720p": 2,
        "480p": 3,
    };

    var data = new FormData();
    var token = localStorage.getItem("token");
    var res = videoResolution[selectedResolution];

    data.append("token", token);
    data.append("resolution", res);

    fetch("/export_video", {
        method: "POST",
        body: data,
    })
        .then((res) => res.blob())
        .then((blob) => {
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "video.mp4";
            link.click();
            window.URL.revokeObjectURL(link.href);
        });
}

function previewVideo()
{
    var videoPreview = document.querySelector("video");
            var srcPreview = document.querySelector("video source");
            srcPreview.src = "/static/uploads/users/" + email + "/preview.mp4";
            videoPreview.load();

    updateTimeline();
}

function timelineHandler(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        displayImage(files[i]);
    }
    sortifyImages();
}

timeline = document.getElementById("timeline-image-container");

function addToTimeline(frame) {
    console.log(frame);
    let newFrame = frame.cloneNode(true);

    newFrame.id = "id-time-" + newFrame.id.substring(3);

    newFrame.dataset.name = frame.dataset.name;
    newFrame.dataset.duration = 1;
    newFrame.dataset.transition = 4;

    newFrame.getElementsByClassName("delete-icon")[0].remove();

    createDeleteIcon(newFrame);
    createSettingsIcon(newFrame);

    newFrame.addEventListener("mouseover", () => showIcons(newFrame));
    newFrame.addEventListener("mouseout", () => hideIcons(newFrame));

    newFrame.dataset.index = timeline.children.length + 1;

    newFrame.addEventListener("dragstart", drag);

    newFrame.ondragstart = "drag(event)";

    timeline.appendChild(newFrame);

    // updateTimeline();
    sortifyImages();
}

function addToTimelineWeb(path) {
    console.log("imageFrame");
    console.log(path);

    const imageContainer = document.getElementById("image-container");
    var newFrame = document.createElement("div");
    newFrame.className = "image-frame";
    newFrame.setAttribute("draggable", true);
    console.log(newFrame);
    newFrame.style.backgroundImage =
        "url(/static/uploads/users/" + email + "/images/" + path["name"] + ")";
    newFrame.id = "id-time-" + path;

    newFrame.dataset.name = path["name"];
    newFrame.dataset.duration = path["duration"];
    newFrame.dataset.transition = path["transition"];

    createDeleteIcon(newFrame);
    createSettingsIcon(newFrame);
    // imageFrame.addEventListener("click", () =>
    //     confirmDeleteImage(imageFrame),
    // );

    newFrame.addEventListener("mouseover", () => showIcons(newFrame));
    newFrame.addEventListener("mouseout", () => hideIcons(newFrame));

    newFrame.dataset.index = timeline.children.length + 1;

    // newFrame.addEventListener("dragstart", drag);

    // newFrame.ondragstart = "drag(event)";

    timeline.appendChild(newFrame);

    var image = new Image();
    image.src = "/static/uploads/users/" + email + "/images/" + path["name"];
    image.addEventListener("error", function () {
        console.log("asdasd");
        newFrame.remove();
    });
    sortifyImages();
}

var currentUpdateImageFrame = null;

function openPopup(img) {
    const popup = document.getElementById("popup");
    popup.style.visibility = "visible";

    currentUpdateImageFrame = img;
}

function getTransitionIndex(transition)
{

}

function applyChanges() {
    const duration = document.getElementById("duration").value;
    const selectedTransition = document.getElementById("transitions").value;

    console.log(duration);
    console.log(selectedTransition);

    currentUpdateImageFrame.dataset.duration = duration;
    currentUpdateImageFrame.dataset.transition = selectedTransition;
    // updateTimeline();
    sortifyImages();

    // You can handle the selected values as needed (e.g., apply them to animations/transitions).
    // alert(Duration: ${duration}, Transition: ${selectedTransition});

    // Close the popup after applying changes
    const popup = document.getElementById("popup");
    popup.style.visibility = "hidden";
}



////      drag and drop

function allowDrop(event) {
    console.log("dsrop");

    event.preventDefault();
}

function drag(event) {
    console.log("draggg");

    event.dataTransfer.setData("text/plain", event.target.dataset.index);
}

function drop(event) {
    console.log("dropppp");
    event.preventDefault();
    const draggedIndex = event.dataTransfer.getData("text/plain");
    console.log(draggedIndex);
    var st = '[data-index="' + draggedIndex + '"]';
    console.log(st);
    const draggedElement = document.querySelectorAll(st)[0];

    console.log(draggedElement);

    const targetIndex = event.target.dataset.index;
    console.log(targetIndex);

    var bt = '[data-index="' + targetIndex + '"]';

    const targetElement = document.querySelectorAll(bt)[0];

    console.log(targetElement);

    if (draggedElement && targetElement) {
        const elements = Array.from(timeline.children);
        const draggedPosition = elements.indexOf(draggedElement);
        const targetPosition = elements.indexOf(targetElement);

        // Swap the positions in the flex container
        timeline.insertBefore(draggedElement, targetElement);

        // If you need to update the data-index attribute, do so here
        draggedElement.dataset.index = targetIndex;
        targetElement.dataset.index = draggedIndex;
    }

    // updateTimeline();
    sortifyImages();
}

function createWebMusicItem(path) {
    console.log(path);
    const listItem = document.createElement("li");
    listItem.className = "music-item";
    listItem.style.display = "flex";
    listItem.style.justifyContent = "flex-start";
    listItem.style.alignItems = "center";
    listItem.style.cursor = "pointer";

    const deleteBtn = document.createElement("span");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "❌";
    deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        playWebMusic(null);
        deleteAudio(path);
        listItem.remove();
    });
    deleteBtn.style.marginLeft = "auto";

    // const radio = document.createElement("span");
    // radio.className = "material-icons radio-icon-button";
    // radio.innerHTML = "radio_button_unchecked";
    // radio.style.color = "var(--red)";
    // radio.style.marginRight = "20px";

    const addBtn = document.createElement("span");
    addBtn.className = "material-icons";
    addBtn.innerHTML = "add";
    addBtn.style.color = "var(--red)";
    addBtn.style.marginRight = "20px";
    addBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        playWebMusic(null);
        console.log(path);
        trimAudioClip(path, 10, 20);
    });

    const fileName = document.createElement("span");
    fileName.innerText = path;

    listItem.appendChild(addBtn);
    // listItem.appendChild(radio);
    listItem.appendChild(fileName);
    listItem.appendChild(deleteBtn);

    listItem.addEventListener("click", (item) => {
        var radioButtons =
            musicList.getElementsByClassName("radio-icon-button");

        for (icon of radioButtons) {
            icon.innerHTML = "radio_button_unchecked";
        }

        // radio.innerHTML = "radio_button_checked";

        playWebMusic(path);
    });

    musicList.appendChild(listItem);
}

function playWebMusic(path) {
    player.src = "/static/uploads/users/" + email + "/audios/" + path;
    player.play();
}

function uploadImageFiles(files) {
    var data = new FormData();
    var token = localStorage.getItem("token");

    data.append("token", token);

    for (const file of files) {
        data.append(
            "files",
            file,
            file.name
                .replaceAll(" ", ":-:")
                .replaceAll("(", ":-:")
                .replaceAll(")", ":-:"),
        );
    }

    console.log(data);

    fetch("/upload_images", {
        method: "POST",
        body: data,
    });
}

function uploadAudioFiles(files) {
    var data = new FormData();
    var token = localStorage.getItem("token");

    data.append("token", token);

    for (const file of files) {
        data.append("files", file, file.name);
    }

    fetch("/upload_audios", {
        method: "POST",
        body: data,
    });
}

function deleteImage(file) {
    var data = new FormData();
    var token = localStorage.getItem("token");

    data.append("token", token);
    data.append("file", file);

    fetch("/delete_image", {
        method: "POST",
        body: data,
    }).then((response) => {
        if (response.ok) {
            // updateTimeline();
            sortifyImages();
        }
    });
}

function deleteAudio(file) {
    var data = new FormData();
    var token = localStorage.getItem("token");

    data.append("token", token);
    data.append("file", file);

    fetch("/delete_audio", {
        method: "POST",
        body: data,
    });
}

//Implemenation for log out

function logOut() {
    localStorage.removeItem("token");
    window.location.href = "/";
}

function updateTimeline() {
    console.log("updating");
    const imageElements = Array.from(timeline.children);
    const audioElements = Array.from(audioTimeline.children);

    var images = [];
    var audios = [];

    for (const element of imageElements) {
        var image = {};
        image["name"] = element.dataset.name;
        image["duration"] = element.dataset.duration;
        image["transition"] = element.dataset.transition;
        images.push(image);
    }

    for (const element of audioElements) {
        var audio = {};
        audio["name"] = element.dataset.name;
        audio["start"] = element.dataset.start;
        audio["end"] = element.dataset.end;
        audios.push(audio);
    }

    console.log(audios);

    // videoPreview.play();

    console.log(videoPreview);

    console.log(images);

    var data = new FormData();
    var token = localStorage.getItem("token");

    data.append("token", token);

    data.append("images", JSON.stringify(images));
    data.append("audios", JSON.stringify(audios));

    console.log(data);

    fetch("/workspace/update_timeline", {
        method: "POST",
        body: data,
    })
        .then((data) => {
            var videoPreview = document.querySelector("video");
            var srcPreview = document.querySelector("video source");
            srcPreview.src = "/static/uploads/users/" + email + "/preview.mp4";
            videoPreview.load();
        });
}

function searchImage() {
    var data = new FormData();
    var token = localStorage.getItem("token");
    var term = document.getElementById("search-image").value.trim();

    data.append("token", token);
    data.append("search", term);

    fetch("/search_image", {
        method: "POST",
        body: data,
    })
        .then((response) => response.json())
        .then((data) => {
            const imageContainer = document.getElementById("image-container");
            imageContainer.innerHTML = "";
            data["images"].forEach((file) => {
                displayWebImage(file);
            });
        })
        .catch((error) => {
            console.error("Error fetching files:", error);
        });
}

function searchAudio() {
    var data = new FormData();
    var token = localStorage.getItem("token");
    var term = document.getElementById("search-audio").value.trim();

    data.append("token", token);
    data.append("search", term);

    fetch("/search_audio", {
        method: "POST",
        body: data,
    })
        .then((response) => response.json())
        .then((data) => {
            musicList.innerHTML = "";
            data["audios"].forEach((file) => {
                createWebMusicItem(file);
            });
        })
        .catch((error) => {
            console.error("Error fetching files:", error);
        });
}

document.getElementById("search-audio").addEventListener("input", (item) => {
    clearIcon = item.currentTarget.parentElement.children[1].children[0];
    var term = item.currentTarget.value.trim();

    if (term != "") {
        clearIcon.style.visibility = "visible";
    } else {
        clearIcon.style.visibility = "hidden";
    }
});

document.getElementById("search-image").addEventListener("input", (item) => {
    console.log(item.currentTarget.parentElement.children[1].children[0]);
    clearIcon = item.currentTarget.parentElement.children[1].children[0];
    var term = item.currentTarget.value.trim();

    if (term != "") {
        clearIcon.style.visibility = "visible";
    } else {
        clearIcon.style.visibility = "hidden";
    }
});

function clearSearch() {
    musicList.innerHTML = "";
    timeline.innerHTML = "";
    imageContainer.innerHTML = "";

    document.getElementById("search-image").value = "";
    document.getElementById("search-audio").value = "";

    retrieveAll();
}

var video = document.getElementsByTagName("video")[0];

video.addEventListener("wheel", function (e) {
    console.log("scrolling");
    if (e.deltaY > 0) {
        video.currentTime += 1;
    } else {
        video.currentTime -= 1;
    }
});

function setImageCachingAttributes(imageElement) {
    imageElement.setAttribute("crossorigin", "anonymous");
    imageElement.setAttribute("referrerpolicy", "no-referrer");
    imageElement.setAttribute("loading", "lazy");
}

// Function to set caching attributes for loaded audio elements
function setAudioCachingAttributes(audioElement) {
    audioElement.setAttribute("crossorigin", "anonymous");
    audioElement.setAttribute("preload", "auto");
}

// Add event listener for load event on all img elements
document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("load", function () {
        setImageCachingAttributes(this);
    });
});

// Add event listener for load event on all audio elements
document.querySelectorAll("audio").forEach(function (audio) {
    audio.addEventListener("loadedmetadata", function () {
        setAudioCachingAttributes(this);
    });
});

document.querySelectorAll(".image-frame").forEach(function (div) {
    var image = new Image();
    image.onload = function () {
        setBackgroundCachingAttributes(div);
    };
    image.src = div.style.backgroundImage
        .replace('url("', "")
        .replace('")', "");
});

document.querySelector("#audio-popup").addEventListener("click", (item) => {
    console.log(this);
    console.log(item.target.id);
    if (item.target.id != "audio-popup") return;
    document.querySelector("#waveform").innerHTML = "";
    document.querySelector("#audio-popup").style.visibility = "hidden";
});

var videoPreview = document.querySelector("video");
var srcPreview = document.querySelector("video source");
srcPreview.src = "/static/uploads/users/" + email + "/preview.mp4";
videoPreview.load();

function sortifyImages(){
    var container = document.querySelector("#timeline-image-container");
    Sortable.create(container, {ghostClass: 'blue-background-class', animation: 150, swapThreshold: 1, onSort: function (evt) {
        updateTimeline();
    }});
}
