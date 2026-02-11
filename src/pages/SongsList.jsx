// src/pages/SongsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "";

const initialForm = { artist: "", track: "", link: "" };

function SongsList() {
  const [songs, setSongs] = useState([]);
  const [amountOfSongs, setAmountOfSongs] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [ajaxStats, setAjaxStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all songs and count
  const fetchSongs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/songs`);
      setSongs(res.data.songs);
      setAmountOfSongs(res.data.amount_of_songs);
    } catch (e) {
      setSongs([]);
      setAmountOfSongs(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  // Add song
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!form.artist.trim() || !form.track.trim()) {
      setFormError("Artist and Track are required.");
      return;
    }
    try {
      await axios.post(`${API_BASE}/songs/addsong`, form);
      setForm(initialForm);
      fetchSongs();
    } catch (e) {
      setFormError("Failed to add song. Try again.");
    }
  };

  // Delete song
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;
    try {
      await axios.get(`${API_BASE}/songs/deletesong/${id}`);
      fetchSongs();
    } catch (e) {
      // Optionally show error
    }
  };

  // AJAX stats
  const handleAjaxStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/songs/ajaxGetStats`);
      setAjaxStats(res.data.amount_of_songs || res.data || 0);
    } catch (e) {
      setAjaxStats("?");
    }
  };

  return (
    <div className="container" role="main">
      <h2>You are in the View: application/view/song/index.php (everything in this box comes from that file)</h2>
      {/* Add Song Form */}
      <div className="box" aria-label="Add Song">
        <h3>Add a song</h3>
        <form onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="artist">Artist</label>
          <input
            id="artist"
            name="artist"
            type="text"
            value={form.artist}
            onChange={handleChange}
            required
            autoFocus
          />
          <label htmlFor="track">Track</label>
          <input
            id="track"
            name="track"
            type="text"
            value={form.track}
            onChange={handleChange}
            required
          />
          <label htmlFor="link">Link</label>
          <input
            id="link"
            name="link"
            type="text"
            value={form.link}
            onChange={handleChange}
          />
          <input type="submit" value="Submit" />
        </form>
        {formError && <div style={{ color: "red", marginTop: 8 }}>{formError}</div>}
      </div>
      {/* Main Content Output */}
      <div className="box">
        <h3>Amount of songs (data from second model)</h3>
        <div>{loading ? "..." : amountOfSongs}</div>
        <h3>Amount of songs (via AJAX)</h3>
        <div>
          <button id="javascript-ajax-button" type="button" onClick={handleAjaxStats}>
            Click here to get the amount of songs via Ajax (will be displayed in #javascript-ajax-result-box)
          </button>
          <div id="javascript-ajax-result-box" style={{ marginTop: 8 }}>
            {ajaxStats !== null && <span>{ajaxStats}</span>}
          </div>
        </div>
        <h3>List of songs (data from first model)</h3>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead style={{ backgroundColor: "#ddd", fontWeight: "bold" }}>
              <tr>
                <td>Id</td>
                <td>Artist</td>
                <td>Track</td>
                <td>Link</td>
                <td>DELETE</td>
                <td>EDIT</td>
              </tr>
            </thead>
            <tbody>
              {songs.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No songs found.
                  </td>
                </tr>
              )}
              {songs.map((song) => (
                <tr key={song.id}>
                  <td>{song.id}</td>
                  <td>{song.artist}</td>
                  <td>{song.track}</td>
                  <td>
                    {song.link ? (
                      <a href={song.link} target="_blank" rel="noopener noreferrer">
                        {song.link}
                      </a>
                    ) : null}
                  </td>
                  <td>
                    <button
                      type="button"
                      aria-label={`Delete song ${song.id}`}
                      onClick={() => handleDelete(song.id)}
                    >
                      delete
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      aria-label={`Edit song ${song.id}`}
                      onClick={() => navigate(`/songs/editsong/${song.id}`)}
                    >
                      edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SongsList;
