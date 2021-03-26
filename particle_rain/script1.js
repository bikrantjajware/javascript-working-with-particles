const myImage = new Image();
myImage.src = '../shiva.jpg'




myImage.addEventListener('load',() => {
    const canvas = document.getElementById('canvas1');
    canvas.width = 640;
    canvas.height = 920;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(myImage,0,0);
    const gradient1 = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    gradient1.addColorStop(0.2,'violet');
    gradient1.addColorStop(0.4,'indigo');
    gradient1.addColorStop(0.6,'blue');
    gradient1.addColorStop(0.7,'green');
    gradient1.addColorStop(0.8,'yellow');
    gradient1.addColorStop(0.9,'red');

    let switcher = 1;
    let counter =0;

    setInterval(() => {
        counter++;
        if(counter%12===0)
            {
                switcher *=-1;
            }
    },500)

    const pixels = ctx.getImageData(0,0,canvas.width,canvas.height);

    let mappedImage = [];
    for(let y=0;y<canvas.height;y++)
    {
        let row = [];
        for(let x=0;x<canvas.width;x++)
        {
            const red = pixels.data[(y*4*pixels.width) + (x*4)];
            const blue = pixels.data[(y*4*pixels.width) + (x*4)+1];
            const green = pixels.data[(y*4*pixels.width) + (x*4)+2];
            const brightness = calculateRelativeBrightness(red,blue,green);
            const cellColor = 'rgb(' + red + ','+blue + ','+green + ')';

            const cell = [ brightness,cellColor];

            row.push(cell);
        }
        mappedImage.push(row);
    }
    //console.log(mappedImage);
    function calculateRelativeBrightness(red,blue,green){
        return Math.sqrt(
            (red*red)*0.299 +
            (green*green) *0.587 +
            (blue*blue) *0.114
        )/100;
    }

    let particleArray = [];
    const numberOfParticles = 5000;

    class Particle {
        constructor(){
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speed = 0;
            this.velocity = Math.random() * 0.5;
            this.size = Math.random()*2.5 + 0.2;

            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
            this.angle=0;

        }

        update(){
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
            this.speed = mappedImage[this.position1][this.position2][0];
            let movement = (  this.speed-0.5) + this.velocity;
            this.angle+=this.speed/10;
            this.y += movement + Math.sin(this.angle)*5;
            this.x +=movement + Math.cos(this.angle)*2;
            this.size=this.speed;

            

            if(switcher===-1)
            {
                ctx.globalCompositeOperation = 'luminousity';
            }
            else
            {
                ctx.globalCompositeOperation = '';
            }



            if(this.y >= canvas.height || this.y<0)
            {
                this.y=0;
                this.x=Math.random() * canvas.width;
            }
            if(this.x >= canvas.width || this.x<0)
            {
                this.x=0;
                this.y=Math.random() * canvas.height;
            }
        }

        draw(){

            ctx.beginPath();
           ctx.fillStyle = mappedImage[this.position1][this.position2][1];
           //ctx.fillStyle =gradient1;
            ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
           // ctx.strokeRect(this.x,this.y,this.size*0.5,this.size*0.5);
            //ctx.strokeStyle = mappedImage[this.position1][this.position2][1];
            //ctx.fillText('*',this.x,this.y);
            ctx.fill();
        }
    }

    function init(){

        for(let i=0;i<numberOfParticles;i++)
        {
            particleArray.push(new Particle);
        }
    }
    init();

    function animate()
    {
        ctx.drawImage(myImage,0,0);
        ctx.globalAlpha = this.speed;
        ctx.fillStyle = 'rgb(0, 0, 0)';
//      ctx.fillStyle = mappedImage[this.position1][this.position2][1];
        ctx.fillRect(0,0,canvas.width,canvas.height);

        for(let i=0;i<particleArray.length;i++)
        {
            particleArray[i].update();
            particleArray[i].draw();
        }

        requestAnimationFrame(animate);
    }
    animate();
    
})
