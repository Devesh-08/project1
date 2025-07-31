console.log("let's start");
let currentsong=new Audio();
let songs;

function secondTominute(seconds){
    if(isNaN(seconds)|| seconds <0){
        return "00:00"
    }
    const minutes=Math.floor(seconds/60)
    const remainingSeconds=Math.floor(seconds % 60);

    const formattedminutes=String(minutes).padStart(2,'0');
    const formattedseconds=String(remainingSeconds).padStart(2,'0');

    return `${formattedminutes}:${formattedseconds}`;
}

    async function getsongs() {
    let a = await fetch("/spotify/public/songs/");
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = [];
    
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}
const playmusic=(track,pause=false)=>{
    currentsong.src="public/songs/"+track;
    currentsong.play();
    playbutton.src="svg/pause.svg"
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songTime").innerHTML="00:00/00:00"
}
async function main(){
     songs=await getsongs();
    playmusic(songs[0],true)     

    // console.log(songs);  
    let songUl=document.querySelector(".pList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML=songUl.innerHTML+` <li>
                        <div class="info">
                        <div>${song.replaceAll("%20"," ")}</div>
                        <div>Devesh</div>
                        </div>
                        <div class="playnow">
                        <span>play now</span>
                        <img class="icon" src="svg/play.svg" alt="">
                        </div>
        </li>`;
    }              
    Array.from(document.querySelector(".pList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element =>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });

    playbutton.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            playbutton.src="svg/pause.svg"
        }else{
            currentsong.pause();
            playbutton.src="svg/play.svg"
        }
    })
    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songTime").innerHTML=`${secondTominute(currentsong.currentTime)}/
        ${secondTominute(currentsong.duration)}`
        document.querySelector(".dot").style.left=(currentsong.currentTime/currentsong.duration)*100+"%";
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width*100);
        document.querySelector(".dot").style.left=percent+"%";
        currentsong.currentTime=((currentsong.duration)*percent)/100;
    })
    document.querySelector(".hamB").addEventListener("click",()=>{
        document.querySelector(".left").style.right=0;
    })
    document.querySelector(".cancel").addEventListener("click",()=>{
        document.querySelector(".left").style.right="100%" ;
    })
    previous.addEventListener("click",()=>{
        currentsong.pause();
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playmusic(songs[index-1])
        }
    })
    next.addEventListener("click",()=>{
        console.log(currentsong.src);
        currentsong.pause();
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playmusic(songs[index+1])
        }
    }) 

    document.querySelector(".ra").addEventListener("change",(e)=>{
        console.log(e.target.value);
        currentsong.volume=parseInt(e.target.value)/100
    })
}                                                   
main()
// document.getElementById("playbutton").addEventListener("click", async () => {
//     let songs = await getsongs();'
//     console.log(songs);

//     let songUl=document.querySelector(".pList").getElementsByTagName("ul")[0]
//     for (const song of songs) {
//         songUl.innerHTML=songUl.innerHTML+song;
//     }

//     if (songs.length > 0) {
//         let audio = new Audio(songs[0]);
//         audio.play();
//     } else {
//         console.log("No songs found.");
//     }
// });

