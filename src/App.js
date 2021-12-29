import React, { useEffect, useState } from "react";
import Listbox from './Listbox';
import Detail from './Detail';
import Player from './Player';
import { Credentials } from './Credentials';
import axios from 'axios';

const App = () => {

  const spotify = Credentials();  

  const data = [
    {value: 1, name: 'A'},
    {value: 2, name: 'B'},
    {value: 3, name: 'C'},
  ]; 

  const [token, setToken] = useState('');  
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []});
  const [trackDetail, setTrackDetail] = useState(null);

  useEffect(() => {

    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      setToken(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })      
    });

  }, [spotify.ClientId, spotify.ClientSecret]); 

  
  const searchArtists = async (e) => {
      e.preventDefault()
      const {data} = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
              Authorization: `Bearer ${token}`
          },
          params: {
              q: searchKey,
              type: "artist"
          }
      })

      setArtists(data.artists.items)
  }

  const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.id}>
                {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                {artist.name}
            </div>
        ))
  }
  
   const searchAlbums = async (e) => {
      e.preventDefault()
      const {data} = await axios.get("  https://api.spotify.com/v1/albums/{id}/tracks", {
          headers: {
              Authorization: `Bearer ${token}`
          },
          params: {
              q: searchKey,
              type: "tracks"
          }
      })

      setTracks(data.tracks.items)
  }

  const renderAlbums = () => {
        return tracks.map(track => (
            <div key={tracks.id}>
                {track.name}
            </div>
        ))
  }
  const buttonClicked = e => {
    e.preventDefault();

    axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`, {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .then(tracksResponse => {
      setTracks({
        selectedTrack: tracks.selectedTrack,
        listOfTracksFromAPI: tracksResponse.data.items
      })
    });
  }

  const listboxClicked = val => {

    const currentTracks = [...tracks.listOfTracksFromAPI];

    const trackInfo = currentTracks.filter(t => t.track.id === val);

    setTrackDetail(trackInfo[0].track);

  }

  return (
    <div className="container">
      <h1>SPOTIFY APP</h1>
      {token ?
        <form onSubmit={searchArtists}>
          <input type="text" onChange={e => setSearchKey(e.target.value)}/>
              <button type={"submit"}>Search</button>
        </form>
        : <h2>Please login</h2>
      }
      <div className="row">
        <Listbox items={tracks.listOfTracksFromAPI} clicked={listboxClicked} />
        {trackDetail && <Detail {...trackDetail} /> }
      </div>        
      {renderArtists()}
      <Player
      />
    </div>
    
  );
}

export default App;