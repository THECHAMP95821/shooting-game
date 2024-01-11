///IMPORT SOUNDS
const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");

introMusic.play();


//BASIC ENV SETUP
const canvas=document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width=innerWidth;
canvas.height=innerHeight;
const context=canvas.getContext("2d");
const lightWeaponDamage=10;
const heavyWeaponDamage=20;
const hugeWeaponDamage=50;
let playerScore=0;

let difficulty=2;
const form=document.querySelector("form");
const scoreBoard=document.querySelector(".scoreBoard");

//BASIC FUNCTIONS
//EV LIST FOR DIFFICULTY FORM
document.querySelector("input").addEventListener("click",(e)=>{
    e.preventDefault();
    introMusic.pause(); 
    //MAKING FORM AND SCOREBOARD INVISIBLE
    form.style.display="none";
    scoreBoard.style.display="block";

    const userValue=document.getElementById("difficulty").value;
    //DIFFIVULTY SELECTION BY USER
    if(userValue=="Easy"){
        setInterval(spawnEnemy,2000);
        return difficulty=1;
    }
    if(userValue=="Medium"){
        setInterval(spawnEnemy,1400);
        return difficulty=3;

    }
    if(userValue=="Hard"){
        setInterval(spawnEnemy,1000);
        return difficulty=5;

    }
    if(userValue=="Insane"){
        setInterval(spawnEnemy,500);
        return difficulty=7;

    }
})

const gameOverLoader=()=>{
    const gameOverBanner=document.createElement("div");
    const gameOverBtn=document.createElement("button");
    const highScore=document.createElement("div");
    highScore.innerHTML = `High Score : ${
        localStorage.getItem("highScore")
          ? localStorage.getItem("highScore")
          : playerScore
      }`;
    
      const oldHighScore =
    localStorage.getItem("highScore") && localStorage.getItem("highScore");

  if (oldHighScore < playerScore) {
    localStorage.setItem("highScore", playerScore);

    // updating high score html
    highScore.innerHTML = `High Score: ${playerScore}`;
  }

    gameOverBtn.innerText="Play Again";

    gameOverBanner.appendChild(highScore);
    gameOverBanner.appendChild(gameOverBtn);

    gameOverBtn.onclick=()=>{
        window.location.reload();
    }

    gameOverBanner.classList.add("gameover");
    document.querySelector("body").appendChild(gameOverBanner);
}

//-----------------------------------CREATING PLAYER ENEMY AND WEAPON CLASSES----------------------------------------
playerPosition={
    x:canvas.width/2,
    y:canvas.height/2
}

class Player{
    constructor(x,y,radius,color){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
    }
    draw(){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle=this.color;
        
        context.fill();
    }
}


class Weapon{
    constructor(x,y,radius,color,velocity,damage){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        this.damage=damage;
    }
    draw(){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle=this.color;
        
        context.fill();
    }
    update(){
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
    }
}

class HugeWeapon{
    constructor(x,y,damage){
        this.x=x;
        this.y=y;
        this.color="rgba(47,255,0,1)";
        this.damage=damage;
    }
    draw(){
        context.beginPath();
        context.fillStyle=this.color;
        context.fillRect(this.x, this.y,200,canvas.height);
        
        
        context.fill();
    }
    update(){
        this.x+=10;
    }
}

class Enemy{
    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=Math.   abs(radius);
        this.color=color;
        this.velocity=velocity;
        
    }
    draw(){
        
        
        
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle=this.color;
        
        context.fill();
        
        
    }
    update(){
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
    }
}

class Particle{
    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        this.alpha=1;
    }
    draw(){
        context.save();
        context.globalAlpha=this.alpha  ;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle=this.color;
        
        context.fill();
        context.restore();
    }
    update(){
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
        this.alpha-=0.01;
    }
}

//------------------------MAIN LOGIC HERE--------------------------
const parv=new Player(
    playerPosition.x,
    playerPosition.y,
    15,
    `white`
);

const weapons=[];
const enemies=[];
const particles=[];
const hugeWeapons=[]

const spawnEnemy=()=>{
    const enemySize=Math.random()*(40-5)+5;
    //console.log("RADIIUS ",enemySize)

    const enemyColor=`hsl(${Math.floor(Math.random()*360)},100%,50%)`;
    let random;
    if(Math.random()<0.5){
        random={
            x:Math.random()<0.5 ? canvas.width+enemySize : 0-enemySize,
            y:Math.random()*canvas.height
        }
    }
    else{
        random={
            y:Math.random()<0.5 ? canvas.height+enemySize : 0-enemySize,
            x:Math.random()*canvas.width 
        }
    }

    const angle=Math.atan2(canvas.height/2-random.y,canvas.width/2-random.x);
    const velocity={
        x:Math.cos(angle)*difficulty,
        y:Math.sin(angle)*difficulty
    }
    enemies.push(new Enemy(random.x,random.y,enemySize,enemyColor,velocity))
}

let animationID;
function animation(){
    animationID=requestAnimationFrame(animation);

    // Updating Player Score in Score board in html
  scoreBoard.innerHTML = `Score : ${playerScore}`;

    context.fillStyle='rgba(49,49,49,0.2)';
    context.fillRect(0,0,canvas.width,canvas.height);
    
    
    parv.draw();
    //console.log(weapons);

    //generating particles
    particles.forEach((particle,particleIdx)=>{
        if(particle.alpha<=0){
            particles.splice(particleIdx,1);
        }
        particle.draw();
        particle.update();
    })

    hugeWeapons.forEach((hugeweapon,hugeweaponidx)=>{
        if(hugeweapon.x>canvas.width){
            hugeWeapons.splice(hugeweaponidx,1);
        }
        else{
            hugeweapon.draw();
            hugeweapon.update();
        }
        //console.log(hugeWeapons)
        
    })

    weapons.forEach((weapon,weaponIndex)=>{
        weapon.draw();
        weapon.update();
        if(weapon.x-weapon.radius<1 || weapon.y-weapon.radius<1 || weapon.x+weapon.radius>canvas.width || weapon.y+ weapon.radius>canvas.height){
            weapons.splice(1,weaponIndex)
        }
    })
    enemies.forEach((enemy,enemyIndex)=>{
        enemy.draw();
        enemy.update();
        hugeWeapons.forEach((hw,hwi)=>{
            const distance2=hw.x-enemy.x;
            if(distance2<=200 && distance2>=-200){
                setTimeout(()=>{
                    killEnemySound.play();

                    enemies.splice(enemy,1);
                },0);
                playerScore+=10;
            }
        })
        //console.log(playerScore);
        const distance1=Math.hypot(enemy.x-parv.x,enemy.y-parv.y);
        if(distance1-parv.radius-enemy.radius<1){
            //console.log("GAME OVER");
            
            cancelAnimationFrame(animationID);
            //console.log("GAME OVER");
            gameOverSound.play();
            hugeWeaponSound.pause();
            shootingSound.pause();
            heavyWeaponSound.pause();
            killEnemySound.pause();
            introMusic.play();
            return gameOverLoader();;
        }
        weapons.forEach((weapon,weaponIndex)=>{
            const distance=Math.hypot(weapon.x-enemy.x,weapon.y-enemy.y);
            if(distance-weapon.radius-enemy.radius<1){
                //console.log("kill enemy");
                
                if(enemy.radius>=20){
                    gsap.to(enemy,{
                        radius:enemy.radius-weapon.damage
                    })
                    setTimeout(()=>{
                        weapons.splice(weaponIndex,1);
                    },0);

                }
                else{
                    for(let i=0;i<enemy.radius*2;i++){
                        particles.push(
                            new Particle(
                                weapon.x,
                                weapon.y,
                                2,enemy.color,
                                {
                                    x:Math.random()-0.5,
                                    y:Math.random()-0.5
                                }
                            )
                        )
                    }
                    setTimeout(()=>{
                        playerScore+=10;
                        //rendering player score in html element
                        scoreBoard.innerHTML=`Score : ${playerScore}`;
                        killEnemySound.play();
                        enemies.splice(enemyIndex,1);
                        weapons.splice(weaponIndex,1);
                    },0);
                }
            }
        });

    })
}



canvas.addEventListener("click",(e)=>{
    shootingSound.play();
    const angle=Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);
    const velocity={
        x:Math.cos(angle)*6,
        y:Math.sin(angle)*6
    }
    weapons.push(new Weapon(canvas.width/2,canvas.height/2,6,`white`,velocity,lightWeaponDamage)); 
    //console.log(weapons);
})

canvas.addEventListener("contextmenu",(e)=>{
    e.preventDefault();
    if(playerScore<=0){
        return;
    }
    heavyWeaponSound.play();

    playerScore-=2;
    scoreBoard.innerHTML=`Score : ${playerScore}`;
    const angle=Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);
    const velocity={
        x:Math.cos(angle)*2,
        y:Math.sin(angle)*2
    }
    weapons.push(new Weapon(canvas.width/2,canvas.height/2,30,`cyan`,velocity,heavyWeaponDamage)); 
    //console.log(weapons);
})

addEventListener("keypress",(e)=>{
    if(e.key===" "){
        if(playerScore<20){
            return;
        }
        playerScore-=20;
        hugeWeaponSound.play();
        scoreBoard.innerHTML=`Score : ${playerScore}`;
        hugeWeapons.push(new HugeWeapon(0,0,hugeWeaponDamage)); 
    }
})

addEventListener("contextmenu",(e)=>{
    e.preventDefault();
})

addEventListener("resize",(e)=>{
    window.location.reload();
})

animation();

