 const movie = {

title:"Interstellar",

rating:"⭐ 9.0",

year:"2014",

genre:"Sci-Fi / Adventure",

description:"A team of astronauts travel through a wormhole in search of a new home for humanity.",

poster:"https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"

};

document.getElementById("title").innerHTML = movie.title;

document.getElementById("rating").innerHTML = movie.rating;

document.getElementById("year").innerHTML = "Year : " + movie.year;

document.getElementById("genre").innerHTML = "Genre : " + movie.genre;

document.getElementById("description").innerHTML = movie.description;

document.getElementById("poster").src = movie.poster;