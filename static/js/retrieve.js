function retrieveAll() {
    var data = new FormData();

    data.append("token", token);

    fetch("/get_files", {
        method: "POST",
        body: data,
    })
        .then((response) => response.json())
        .then((data) => {
            data["audios"].forEach((file) => {
                createWebMusicItem(file);
            });
            data["images"].forEach((file) => {
                displayWebImage(file);
            });
            if (data["timeline"] != null) {
                console.log(data["timeline"]);
                data["timeline"]["images"].forEach((file) => {
                    addToTimelineWeb(file);
                });
                data["timeline"]["audios"].forEach((file) => {
                    addToAudioTimelineWeb(
                        file["name"],
                        file["start"],
                        file["end"],
                    );
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching files:", error);
        });
}

retrieveAll();
