https://env-yiqteppu-1251120934.tcloudbaseapp.com/day5

````
async function cloudtohttp(app, src) {
    let r = await app.getTempFileURL({
        fileList: [src]
    })

    return r.fileList[0].tempFileURL;
````
