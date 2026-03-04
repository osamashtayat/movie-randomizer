import { useState } from "react";
import "./index.css";
const tmdbKey = process.env.REACT_APP_TMDB_KEY;
const omdbKey = process.env.REACT_APP_OMDB_KEY;
function App() {
 
  const [isSelected, setIsSelected] = useState(false);
  const [movie, setSelectedMovie] = useState(null);
  const [OMDPinfo,setOMDPinfo]=useState({});
  const [isLoading,setIsLoading]=useState(false);
  return (
    <div className="page-wrapper">
      
      {(isSelected) && <Movie movie={movie} OMDPinfo={OMDPinfo} isLoading={isLoading}/>}
      <SelectMovie
        isSelected={isSelected}
        setIsSelected={setIsSelected}
        setOMDPinfo={setOMDPinfo}
        setSelectedMovie={setSelectedMovie}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
// movie card
function Movie({ movie,OMDPinfo,isLoading }) {
 
  return (
    <div className="movie-card">
      {isLoading ? (<p>Loading...</p>) :
    (   <> <h3>{movie?.title}</h3>
     { movie.poster_path ?
       <img src={`https://image.tmdb.org/t/p/w185${movie?.poster_path}`} alt={movie?.title}/> : <p>No Poster Attached</p>
    }
      
      <p>release Date : {movie?.release_date}</p>
        <p> {movie?.overview}</p>
       <p> IMDB Rating : {OMDPinfo.imdbRating}</p>
       <p>IMDB Votes : {OMDPinfo.imdbVotes}</p>
       <p> Actors : {OMDPinfo.Actors}</p> 
       <p> Director : {OMDPinfo.Director}</p> 
       </>)}
    
    </div>
  );
}
// preferences and select

function SelectMovie({ setIsSelected, setselectAnotherMovie,setSelectedMovie,setOMDPinfo,setIsLoading }) {
    const [genre,setGenre]=useState("");
 
   async function getMovie() {
   
        try {
          setIsLoading(true);
          const firstRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_genres=${genre}&page=1`);
          if(!firstRes.ok) throw new Error("Please try again")
          const firstData = await firstRes.json();
const totalPages = Math.min(firstData.total_pages, 500); // TMDB caps at 500
const randomPage = Math.floor(Math.random() * totalPages) + 1;
const randomIndex = Math.floor(Math.random() * 20);
        
       
          const res=await fetch( `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_genres=${genre}&page=${randomPage}`);
           const data = await res.json();
const selectedMovie = data.results[randomIndex];
setSelectedMovie(selectedMovie);
 const externalRes = await fetch(`https://api.themoviedb.org/3/movie/${selectedMovie.id}/external_ids?api_key=${tmdbKey}`);
    if (!externalRes.ok) throw new Error("Could not fetch external IDs");
    const externalData = await externalRes.json();
          const resOMDB = await fetch(`https://www.omdbapi.com/?apikey=${omdbKey}&i=${externalData.imdb_id}`);
    if (!resOMDB.ok) throw new Error("Could not fetch OMDB data");
    const dataOMDB = await resOMDB.json();
         
         
       setOMDPinfo(dataOMDB);
      
          
        } catch (err) {
          alert(err.message);
        }
        finally{
          setIsLoading(false);
        }
      }
    
  function handleSelected() {
   setIsSelected(true);
    
      getMovie();
  }
  return (
    <div className="preferences ">
      <select value={genre} onChange={function(e)
        {
          e.preventDefault();
          setGenre(e.target.value);
        }
      }  >
      <option value={"28"} > Action </option>
      <option value={"12"} > Romance </option>
      <option value={"16"} > Animation </option>
      <option value={"35"} > Comedy </option>
      <option value={"80"} > Crime </option>
      <option value={"18"} > Drama </option>
      <option value={"10751"} > Family </option>
      <option value={"14"} > Fantasy </option>
      <option value={"27"} > Horror </option>
      <option value={"10749"} > Romance </option>
      <option value={"878"} > Science Fiction </option>
      <option value={"53"} > Thiriller </option>
      <option value={"10752"} > War </option>
      <option value={"37"} > Western </option>
      <option value={"10402"} > Music </option>
      <option value={"9648"} > Mystery </option>
      <option value={"36"} > History </option>
      </select>
      
      <button className="chip" onClick={handleSelected}>
        {" "}
        Generate Random Movie
      </button>
    </div>
  );
}
export default App;
