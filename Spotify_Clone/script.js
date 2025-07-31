
let currentsong= new Audio();
let songs;
let curfolder;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');

  return `${formattedMins}:${formattedSecs}`;
}

const playmusic= (track,pause=false)=>{
  // let audio=new Audio("/web_dev/SIGMA%20WEB%20DEV/(64)Spotify_Clone/songs/"+track)
  currentsong.src =`${curfolder}/${track}`;
  if(!pause){
  currentsong.play()
}
  document.querySelector(".infosong").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"
  // audio.play()
}

async function getsongs(folder){
  curfolder=folder; 

  // fetching the info.json from folder
let response= await fetch(`${folder}/info.json`)
let data=await response.json();
songs=data.tracks;


// show all songs in playlist
  let songul= document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songul.innerHTML=" "
for (const song of songs) {
    songul.innerHTML=songul.innerHTML+`
      <li class="minicard">
                        <img src="assets/music-note-square-02-stroke-rounded.svg" alt="music note">
                        <div class="songinfo">
                        <div>${song.replaceAll("%20"," ")}</div>
                        </div>
                        <img src="assets/play-stroke-rounded.svg" alt="play button">
                  
    </li>`;
}


// attach an event listner to each song 
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
  e.addEventListener("click",element=>{
    // console.log(e.querySelector(".songinfo").firstElementChild.innerHTML)
    playmusic(e.querySelector(".songinfo").firstElementChild.innerHTML)
    play.src="assets/pause-stroke-rounded.svg" }
  )
});


return songs;
}

async function  displayalbum(){
let response = await fetch("songs/albums.json");
let albums= await response.json();

let cardcontainer=document.querySelector(".songs")

albums.forEach( album=>{
   
      // console.log(response)
      cardcontainer.innerHTML=cardcontainer.innerHTML+`
         <div data-folder="${album.folder}" class="card">
            <img src="${album.cover}" alt="song img">
            <button><img src="assets/play.svg" alt="playbutton"></button>
            <div>${album.title}</div>
               <div>${album.description}</div>
           </div>
           `
  
})

//add an event listner to give songs to album(cards)  / loadding the playlist
Array.from(document.getElementsByClassName("card")).forEach(e=>{

  e.addEventListener("click",async item=>{
    // console.log(item.currentTarget.dataset.folder)
    songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
    playmusic(songs[0])
   document.getElementById("play").src="assets/pause-stroke-rounded.svg"
   
})

})
}



 async function main(){

  
   await getsongs("songs/Angry_(mood)") ;
  //  console.log(songs)
   
   // get the list of all songs 
   playmusic(songs[0],true);


displayalbum();
  
 

// Attach an EventListener  to play, next and previous 
 play.addEventListener("click",()=>{
  if(currentsong.paused){
    currentsong.play()
    play.src="assets/pause-stroke-rounded.svg"
  }
  else{
    currentsong.pause()
    play.src="assets/play-stroke-rounded.svg"
  }
 })

// Listen for time update function
 currentsong.addEventListener("timeupdate",()=>{
  // console.log(currentsong.currentTime,currentsong.duration)
  document.querySelector(".songtime").innerHTML=`${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
  
  document.querySelector(".circle").style.left=(currentsong.currentTime)/(currentsong.duration)*100+"%";
 })

 //Add an eventlistner to seekbar
document.querySelector(".seekbar").addEventListener("click",e=>{
  let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
 document.querySelector(".circle").style.left = percent+"%";
 currentsong.currentTime=((currentsong.duration)*percent)/100;
} )

// Add an event listner for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
   document.querySelector(".library").style.left="0";
})

document.querySelector(".close").addEventListener("click",()=>{
   document.querySelector(".library").style.left="-110%";
})

// add an event listner to previous 
 document.querySelector("#previous").addEventListener("click",()=>{
  let currentsongname = currentsong.src.split("/").slice(-1)[0];
  let decodedname = decodeURIComponent(currentsongname)
  let index= songs.indexOf(decodedname)
  if(index>0){
  playmusic(songs[index-1])
  }
  else{

  }
  
 })

 // add an event listner to next 
 document.querySelector("#next").addEventListener("click",()=>{
  let currentsongname = currentsong.src.split("/").slice(-1)[0];
  let decodedname = decodeURIComponent(currentsongname)
  let index= songs.indexOf(decodedname)
  if(index<(songs.length)-1){
  playmusic(songs[index+1])
  }else{

  }
 })

//  add an event listner to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  // console.log("setting volume to"+e,e.target.value)

  currentsong.volume=  parseFloat(e.target.value/100);
})


// add an addEventListener to mute the volume
document.querySelector(".volume>img").addEventListener("click",e=>{
  // console.log(e.target)
  if(e.target.src.includes("assets/volume-high-stroke-rounded.svg")){
    e.target.src=e.target.src.replace("assets/volume-high-stroke-rounded.svg","assets/mute.svg")
    currentsong.volume=0;
     document.querySelector(".range").getElementsByTagName("input")[0].value=0
  }
  else{
    e.target.src=e.target.src.replace("assets/mute.svg","assets/volume-high-stroke-rounded.svg");
    currentsong.volume=.1;
    document.querySelector(".range").getElementsByTagName("input")[0].value=.10
  }

})


}
     
main()