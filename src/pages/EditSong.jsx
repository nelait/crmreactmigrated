// src/pages/EditSong.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "";

function EditSong() {
  const { song_id } = useParams();
  const [song, setSong] = useState(null);
  const [form, setForm] = useState({ artist: "", track: "", link: "" });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSong = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/songs/editsong/${song_id}`);
        setSong(res.data.song);
        setForm({
          artist: res.data.song.artist || "",
          track: res.data.song.track || "",
          link: res.data.song.link || ""
        });
      } catch (e) {
        setSong(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [song_id]);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  // Update song
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.artist.trim() || !form.track.trim()) {
      setFormError("Artist and Track are required.");
      return;
    }
    try {
      await axios.post(`${API_BASE}/songs/updatesong`, {
        ...form,
        song_id
      });
      navigate("/songs");
    } catch (e) {
      setFormError("Failed to update song. Try again.");
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!song) return <div className="container">Song not found.</div>;

  return (
    <div className="container" role="main">
      <h2>You are in the View: application/view/song/edit.php (everything in this box comes from that file)</h2>
      <div>
        <h3>Edit a song</h3>
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
          <input type="hidden" name="song_id" value={song_id} />
          <input type="submit" value="Update" />
        </form>
        {formError && <div style={{ color: "red", marginTop: 8 }}>{formError}</div>}
      </div>
    </div>
  );
}

export default EditSong;
