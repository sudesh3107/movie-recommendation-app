const watchlist=[

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
}

];

const container=document.getElementById("watchlistContainer");

watchlist.forEach(movie=>{

container.innerHTML+=`

<div class="card">

<img src="${movie.poster}">

<div class="card-content">

<h3>${movie.title}</h3>

<p>⭐ ${movie.rating}</p>

<p>${movie.year}</p>

<button class="remove-btn">Remove</button>

</div>

</div>

`;

});