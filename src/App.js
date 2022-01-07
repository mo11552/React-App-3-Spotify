import React, { useEffect, useState } from "react";
import { Credentials } from './Credentials';
import { Container, Form } from "react-bootstrap"
import TrackSearchResult from "./TrackSearchResult"
import SpotifyWebApi from "spotify-web-api-js"
import axios from 'axios';


const spotifyApi = new SpotifyWebApi({
  ClientId: "af4766b8499a4af1b5a2f7cefd4ca475",
  ClientSecret: '95f9e874c6ad4c4ea5d1e51c2ccbc6a8'
})

const accessToken = 'BQD7Q7eoZnBaEDN-6zw_QI4PVxlX4eTM3WxXwJGVpbk1tfye0-lSNVyW8MPq1lCpko02TEI1eAx-q1w1a1WvDb6_l_o_4TcJRHLCwCzldIFfKP4nnZqjn2DOsRbRlrysQnYlaYJX6uW1Mr_jYIwMKPdb-IHnA9JNEI5EdtQ'

const App = () => {

  const spotify = Credentials() 

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken]) 

  var Spotify = require('spotify-web-api-js');
  var s = new Spotify();

  const data = [
    {value: 1, name: 'A'},
    {value: 2, name: 'B'},
    {value: 3, name: 'C'},
  ] 

  const [token, setToken] = useState('');  
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [search, setSearch] = useState("")
  const [playingTrack, setPlayingTrack] = useState()

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
      s.setAccessToken(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })      
    });

  }, [spotify.ClientId, spotify.ClientSecret]); 

  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch("")
  }

  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!setToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
        console.log(res.tracks.items[0].external_urls.spotify)
      setSearchResults(
        res.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url
          }
        })
      )
    })

    return () => (cancel = true)
  }, [search, setToken])

  const clickSong = (res) => {
    window.open(res.tracks.items[0].external_urls.spotify)
  };

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <h1>Spotify App</h1>
      <div><button onClick={clickSong}>Play Song</button></div>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map(track => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
      </div>
    </Container>
  )
}

export default App;