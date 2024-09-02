import Sortable from 'sortablejs/modular/sortable.complete.esm.js';

// new Sortable(example1, {
//     animation: 150,
//     ghostClass: 'blue-background-class'
// });

function add() {
    console.log("add");
    var timelineWrapper = document.getElementById("timeline-wrapper");
    var timelineItem = document.createElement("div");
    timelineItem.classList.add("timeline-item");
    timelineItem.innerText = timelineWrapper.childElementCount;
    timelineWrapper.appendChild(timelineItem);
}

Sortable.create(timeline-wrapper, {
    animation: 150,
    ghostClass: 'blue-background-class',
    swapThreshold: 0.65
});