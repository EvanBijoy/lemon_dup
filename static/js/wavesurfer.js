import WaveSurfer from "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";
import RegionsPlugin from "https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js";

// import WaveSurfer from "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";

// const wavesurfer = WaveSurfer.create({
//   container: "#waveform",
//   waveColor: "#4F4A85",
//   progressColor: "#383351",
//   url: "/static/res/audio1.m4a",
// });
//
// wavesurfer.on("interaction", () => {
//   wavesurfer.play();
// });

// Create an instance of WaveSurfer

var currentUpdatingAudioFrame = null;
var isUpdating = false;

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
    sortifyAudio();
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

    isUpdating = true;
    currentUpdatingAudioFrame = img;
    updateTrimAudioClip(img);
  });
}

function addToTimeline(frame) {
  console.log(frame);
  let newFrame = frame.cloneNode(true);

  newFrame.id = "id-time-" + newFrame.id.substring(3);

  newFrame.getElementsByClassName("delete-icon")[0].remove();

  createDeleteIcon(newFrame);
  createSettingsIcon(newFrame);

  newFrame.addEventListener("mouseover", () => showIcons(newFrame));
  newFrame.addEventListener("mouseout", () => hideIcons(newFrame));

  newFrame.dataset.index = timeline.children.length + 1;

  newFrame.addEventListener("dragstart", drag);

  newFrame.ondragstart = "drag(event)";

  timeline.appendChild(newFrame);
  sortifyAudio();
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

function addToAudioTimelineWeb(filename, start, end) {
  console.log("imageFrame");

  console.log(filename);

  var timeline = document.getElementById("timeline-audio-container");

  var newFrame = document.createElement("div");
  newFrame.className = "audio-frame";
  newFrame.setAttribute("draggable", true);
  console.log(newFrame);
  newFrame.style.backgroundImage =
    "url(https://i.ytimg.com/vi/dJ6Thpcfsfg/hqdefault.jpg)";
  newFrame.dataset.name = filename;
  newFrame.dataset.start = start;
  newFrame.dataset.end = end;

  createDeleteIcon(newFrame);
  createSettingsIcon(newFrame);
  // imageFrame.addEventListener("click", () =>
  //     confirmDeleteImage(imageFrame),
  // );

  newFrame.addEventListener("mouseover", () => showIcons(newFrame));
  newFrame.addEventListener("mouseout", () => hideIcons(newFrame));
  //
  newFrame.dataset.index = timeline.children.length + 1;

  //     newFrame.addEventListener("dragstart", drag);
  //
  //     newFrame.ondragstart = "drag(event)";

  console.log(newFrame);

  timeline.appendChild(newFrame);

  // updateTimeline();
  sortifyAudio();

  // var image = new Image();
  // image.src = "/static/uploads/users/" + email + "/images/" + path;
  // image.addEventListener("error", function () {
  //     console.log("asdasd");
  //     newFrame.remove();
  // });
}

function updateToAudioTimeline(filename, start, end) {
  console.log("imageFrame");

  console.log(filename);

  var timeline = document.getElementById("timeline-audio-container");

  var newFrame = document.createElement("div");
  newFrame.className = "audio-frame";
  newFrame.setAttribute("draggable", true);
  newFrame.innerHTML = filename;
  console.log(newFrame);
  newFrame.style.backgroundImage =
    "url(https://i.ytimg.com/vi/dJ6Thpcfsfg/hqdefault.jpg)";
  newFrame.dataset.name = filename;
  newFrame.dataset.start = start;
  newFrame.dataset.end = end;

  createDeleteIcon(newFrame);
  createSettingsIcon(newFrame);
  // imageFrame.addEventListener("click", () =>
  //     confirmDeleteImage(imageFrame),
  // );

  newFrame.addEventListener("mouseover", () => showIcons(newFrame));
  newFrame.addEventListener("mouseout", () => hideIcons(newFrame));
  //
  newFrame.dataset.index = timeline.children.length + 1;

  //     newFrame.addEventListener("dragstart", drag);
  //
  //     newFrame.ondragstart = "drag(event)";

  console.log(newFrame);

  timeline.appendChild(newFrame);
  sortifyAudio();

  // var image = new Image();
  // image.src = "/static/uploads/users/" + email + "/images/" + path;
  // image.addEventListener("error", function () {
  //     console.log("asdasd");
  //     newFrame.remove();
  // });
}

var clipRegion = null;
var selectedAudio = null;

function trimAudioClip(audio, start, end) {
  document.querySelector("#audio-popup").style.visibility = "visible";

  selectedAudio = audio;

  const ws = WaveSurfer.create({
    container: "#waveform",
    // waveColor: 'rgb(200, 255, 200)',
    // progressColor: 'rgb(100, 0, 100)',
    url: "/static/res/" + audio,
    // barWidth: 2,
    // Optionally, specify the spacing between bars
    // barGap: 1,
    // And the bar radius
    // barRadius: 2,

    height: 150,
    barWidth: 3,
    pixelRatio: 1,
    barMinHeight: 1,
    waveColor: "#b32314",
    cursorColor: "#03A9F4",
    progressColor: "#b32314",
  });

  // Initialize the Regions plugin
  const wsRegions = ws.registerPlugin(RegionsPlugin.create());

  // Give regions a random color when they are created
  const random = (min, max) => Math.random() * (max - min) + min;
  const randomColor = () =>
    `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;

  // Create some regions at specific time ranges
  ws.on("decode", () => {
    // Regions
    wsRegions.addRegion({
      start: start,
      end: end,
      color: "#b3231480",
      minLength: 1,
    });
  });

  // wsRegions.enableDragSelection({
  //   color: 'rgba(255, 0, 0, 0.1)',
  // });

  wsRegions.on("region-updated", (region) => {
    console.log("Updated region", region);
    clipRegion = region;
  });

  // Loop a region on click
  let loop = true;
  // Toggle looping with a checkbox
  // document.querySelector('input[type="checkbox"]').onclick = (e) => {
  //   loop = e.target.checked;
  // }

  var activeRegion = null;
  wsRegions.on("region-in", (region) => {
    console.log("region-in", region);
    activeRegion = region;
  });
  wsRegions.on("region-out", (region) => {
    console.log("region-out", region);
    if (activeRegion === region) {
      if (loop) {
        region.play();
      } else {
        activeRegion = null;
        ws.stop();
      }
    }
  });
  wsRegions.on("region-clicked", (region, e) => {
    e.stopPropagation(); // prevent triggering a click on the waveform
    activeRegion = region;
    region.play();
  });
  // Reset the active region when the user clicks anywhere in the waveform
  ws.on("interaction", () => {
    activeRegion = null;
    ws.stop();
  });
}

function updateTrimAudioClip(audioFrame) {
  document.querySelector("#audio-popup").style.visibility = "visible";

  currentUpdatingAudioFrame = audioFrame;

  console.log(audioFrame);

  selectedAudio = audioFrame.dataset.name;

  const ws = WaveSurfer.create({
    container: "#waveform",
    // waveColor: 'rgb(200, 255, 200)',
    // progressColor: 'rgb(100, 0, 100)',
    url: "/static/uploads/users/" + email + "/audios/" + selectedAudio,
    // barWidth: 2,
    // Optionally, specify the spacing between bars
    // barGap: 1,
    // And the bar radius
    // barRadius: 2,

    height: 150,
    barWidth: 3,
    pixelRatio: 1,
    barMinHeight: 1,
    waveColor: "#b32314",
    cursorColor: "#03A9F4",
    progressColor: "#b32314",
  });

  // Initialize the Regions plugin
  const wsRegions = ws.registerPlugin(RegionsPlugin.create());

  // Give regions a random color when they are created
  const random = (min, max) => Math.random() * (max - min) + min;
  const randomColor = () =>
    `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;

  // Create some regions at specific time ranges
  ws.on("decode", () => {
    // Regions
    wsRegions.addRegion({
      start: audioFrame.dataset.start,
      end: audioFrame.dataset.end,
      color: "#b3231480",
      minLength: 1,
    });
  });

  // wsRegions.enableDragSelection({
  //   color: 'rgba(255, 0, 0, 0.1)',
  // });

  wsRegions.on("region-updated", (region) => {
    console.log("Updated region", region);
    clipRegion = region;
  });

  // Loop a region on click
  let loop = true;
  // Toggle looping with a checkbox
  // document.querySelector('input[type="checkbox"]').onclick = (e) => {
  //   loop = e.target.checked;
  // }

  var activeRegion = null;
  wsRegions.on("region-in", (region) => {
    console.log("region-in", region);
    activeRegion = region;
  });
  wsRegions.on("region-out", (region) => {
    console.log("region-out", region);
    if (activeRegion === region) {
      if (loop) {
        region.play();
      } else {
        activeRegion = null;
        ws.stop();
      }
    }
  });
  wsRegions.on("region-clicked", (region, e) => {
    e.stopPropagation(); // prevent triggering a click on the waveform
    activeRegion = region;
    region.play();
  });
  // Reset the active region when the user clicks anywhere in the waveform
  ws.on("interaction", () => {
    activeRegion = null;
    ws.stop();
  });
}

document.querySelector("#trim-clip").addEventListener("click", (item) => {
  console.log(clipRegion.start);
  if (isUpdating) {
    currentUpdatingAudioFrame.dataset.start = clipRegion.start;
    currentUpdatingAudioFrame.dataset.end = clipRegion.end;
    updateTimeline();
    isUpdating = false;
  }
  else {
      addToAudioTimelineWeb(selectedAudio, clipRegion.start, clipRegion.end);
  }
  document.querySelector("#waveform").innerHTML = "";
  document.querySelector("#audio-popup").style.visibility = "hidden";
});

window.trimAudioClip = trimAudioClip;
window.addToAudioTimelineWeb = addToAudioTimelineWeb;

function sortifyAudio(){
  var container = document.querySelector("#timeline-audio-container");
  Sortable.create(container, {ghostClass: 'blue-background-class', animation: 150, swapThreshold: 1, onSort: function (evt) {
    updateTimeline();
  }});
}