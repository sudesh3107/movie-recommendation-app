const movies = [

{
title:"Interstellar",
image:"https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
rating:"8.8"
},

{
title:"Avengers Endgame",
image:"https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
rating:"8.4"
},

{
title:"Batman",
image:"https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
rating:"8.2"
},

{
title:"Joker",
image:"https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
rating:"8.5"
},

{
title:"Spider-Man",
image:"https://image.tmdb.org/t/p/w500/5weKu49pzJCt06OPpjvT80efnQj.jpg",
rating:"8.3"
}

];

function showMovies(id){

const container=document.getElementById(id);

movies.forEach(movie=>{

container.innerHTML+=`

<div class="movie-card">

<img src="${movie.image}">

<h3>${movie.title}</h3>

<p>⭐ ${movie.rating}</p>

<a href="/movie">
<button>View Details</button>
</a>

</div>

`;

});

}

showMovies("trendingMovies");
showMovies("topRatedMovies");
showMovies("latestMovies");