const movies = [

{
title:"Avengers Endgame",
year:2019,
rating:9.1,
poster:"https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
},

{
title:"Interstellar",
year:2014,
rating:9.0,
poster:"https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"
},

{
title:"Batman",
year:2022,
rating:8.8,
poster:"https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"
},

{
title:"Inception",
year:2010,
rating:9.2,
poster:"https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
}

];

const grid=document.getElementById("movieGrid");

function showMovies(list){

grid.innerHTML="";

list.forEach(movie=>{

grid.innerHTML+=`

<div class="movie-card">

<img src="${movie.poster}">

<div class="movie-info">

<h3>${movie.title}</h3>

<p>⭐ ${movie.rating}</p>

<p>${movie.year}</p>

<a href="/movie">
    <button>View Details</button>
</a>

</div>

</div>

`;

});

}

showMovies(movies);

document.getElementById("searchInput").addEventListener("keyup",function(){

const value=this.value.toLowerCase();

const filtered=movies.filter(movie=>

movie.title.toLowerCase().includes(value)

);

showMovies(filtered);

});