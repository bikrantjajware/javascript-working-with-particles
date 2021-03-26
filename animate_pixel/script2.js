const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



const adjustx = 500;
const adjusty = 10;

let particleArray = [];

const mouse = {
    x : null,
    y : null,
    radius : 150
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    //console.log(mouse.x,mouse.y);
})

ctx.fillStyle= 'white';
ctx.font = '35px verdana';
ctx.fillText('Alpha',0,50);
//ctx.strokeStyle = 'white';
//ctx.strokeRect(0,0,60,60);
const textCoordinates = ctx.getImageData(0,0,100,100);

class Particle{

    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.basex = this.x;
        this.basey = this.y;
        this.density = Math.random()%30+1;
    }

    draw()
    {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }

    update()
    {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt( dx*dx + dy*dy);
        const forceDirectionX = dx/distance;
        const forceDirectionY = dy/distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance-distance)/maxDistance;
        let directionX = forceDirectionX*force*this.density*5;
        let directionY = forceDirectionY*force*this.density*5;
        if(distance <mouse.radius)
        {
            //this.size=5;
            this.x-=directionX;
            this.y-=directionY;
        }
        else
        {
           // this.size=3;
            if(this.x !== this.basex)
            {
                let dx = this.x - this.basex;
                this.x-=dx/5;
            }
            if(this.y !== this.basey)
            {
                let dy = this.y - this.basey;
                this.y-=dy/(5);
            }
           // this.x=this.basex;
            //this.y=this.basey;
           
        }
    }

    
}

function init()
{
    //particleArray = [];
    for(let y=0,y2=textCoordinates.height;y<y2;y++)
    {
        for(let x=0,x2=textCoordinates.width;x<x2;x++)
        {
            if( textCoordinates.data[ (y*textCoordinates.width*4)+(x*4)+3] >128)
            {
                let positionX = x*10+adjustx;
                let  positionY = y*10+adjusty;

                particleArray.push(new Particle(positionX,positionY));
            }
        }
    }
}
console.log(particleArray);
init();

function animate()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //particleArray.forEach( (e) => e.draw() );

    particleArray.forEach( (e) => {
        e.draw();
        e.update();
    })

    connect();
    requestAnimationFrame(animate);
}
animate();

function connect ()
{
    let opacityValue = 1;
    for(let a=0;a<particleArray.length;a++)
    {
        for(let b=a;b<particleArray.length;b++)
        {
            const dx = particleArray[a].x - particleArray[b].x;
            const dy = particleArray[a].y - particleArray[b].y;
            const distance = Math.sqrt( dx*dx + dy*dy);

            if(distance<30)
            {
                opacityValue = 1 - (distance/30);
                ctx.strokeStyle = 'rgba(255,255,255,'+opacityValue+')';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x,particleArray[a].y);
                ctx.lineTo(particleArray[b].x,particleArray[b].y);
                ctx.stroke();
                
            }
        }
    }
}