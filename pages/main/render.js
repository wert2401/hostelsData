function clickFileBtn() {
    data.openFile().then(async c => {
        let p = await data.file();
        if (p != "")
            window.location.href = "../settings/settings.html";
    });
}