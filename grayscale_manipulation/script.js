const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 920;


const image1 = new Image();
image1.setAttribute('crossOrigin', '');
image1.src='../shiva.jpg';


image1.addEventListener('load',() => {
    ctx.drawImage(image1,0,0);
    const scannedImage = ctx.getImageData(0,0,canvas.width,canvas.height);
    const scannedData = scannedImage.data;

    for(let i=0;i<scannedData.length;i+=4)
    {
        const total = scannedData[i]+scannedData[i+1]+scannedData[i+2];
        const averageColorValue = total/3;
        scannedData[i]=averageColorValue+10;
        scannedData[i+1]=averageColorValue;
        scannedData[i+2]=averageColorValue;
    }
    scannedImage.data = scannedData;
    ctx.putImageData(scannedImage,0,0);
})
