import Header from "../components/common/Header";
import { useNavigate, useParams } from "react-router";
import {
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import EpisodeDetails from "../components/common/EpisodeDetails";
import AudioPlayer from "../components/AudioPlayer";

const PodcastDetails = () => {
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState();
  const [episodes, setEpisodes] = useState();
  const [playingFile, setPlayingFile] = useState("");
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getData();
      getEpisodes();
    }
  }, [id]);

  const getData = async () => {
    try {
      const docRef = doc(db, "podcasts", id);
      const docSnap = await getDoc(docRef);
      setPodcast({ id: id, ...docSnap.data() });
    } catch (e) {
      toast.error(e.message);
      navigate("/podcasts");
    }
  };

  const getEpisodes = () => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts", id, "episodes")),
      (querySnapshot) => {
        const episodeData = [];
        querySnapshot.forEach((doc) => {
          episodeData.push({ id: id, ...doc.data() });
        });
        setEpisodes(episodeData);
        console.log(episodes);
      }
    );
    return () => unsubscribe();
  };

  if (!podcast) return;

  return (
    <>
      <Header />
      <div className="input-wrapper" style={{ marginTop: "0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h1 style={{ textAlign: "left", marginBottom: "1rem" }}>
            {podcast.title}
          </h1>
          {podcast.createdBy == auth.currentUser.uid && (
            <Link to={`/podcast/${podcast.id}/create-episode`}>
              <h1
                style={{
                  marginBottom: "1rem",
                  textAlign: "right",
                  color: "var(--white)",
                  border: "1px solid var(--white)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "1.2rem",
                }}
              >
                Create Episode
              </h1>
            </Link>
          )}
        </div>
        <img
          src={podcast.bannerImg}
          style={{
            width: "100%",
            height: "400px",
            marginTop: "1rem",
            borderRadius: "0.4rem",
          }}
        />
        <p style={{ color: "#8f8297", marginTop: "1rem" }}>
          {podcast.description}
        </p>
        <h1 style={{ textAlign: "start", width: "100%" }}>Episodes</h1>
        {episodes.length > 0 ? (
          <div style={{ width: "100%" }}>
            {episodes.map((item, index) => (
              <EpisodeDetails
                index={index + 1}
                title={item.title}
                description={item.description}
                audioFile={item.audioFile}
                onClick={(file) => setPlayingFile(file)}
              />
            ))}
          </div>
        ) : (
          <p>No Episodes Found</p>
        )}
      </div>
      {playingFile && <AudioPlayer audioSrc={playingFile} image={podcast.displayImg} />}
    </>
  );
};

export default PodcastDetails;
