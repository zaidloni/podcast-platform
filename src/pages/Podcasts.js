import React, { useEffect } from "react";
import Header from "../components/common/Header";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { setPodcasts } from "../slices/podcastSlice";
import PodcastCard from "../components/common/PodcastCard";
import InputComponent from "../components/common/InputComponent";
import { useState } from "react";

const PodcastsPage = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const podcasts = useSelector((state) => state.podcast.podcasts);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts")),
      (querySnapshot) => {
        const podcastsData = [];
        querySnapshot.forEach((doc) => {
          podcastsData.push({ id: doc.id, ...doc.data() });
        });
        dispatch(setPodcasts(podcastsData));
      },
      (error) => {
        console.error("Error fetching podcasts:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  let filteredPodcast = podcasts.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
  return (
    <>
      <Header />
      <div className="input-wrapper" style={{ marginTop: "2rem" }}>
        <h1>Discover Podcasts</h1>
        <InputComponent
          state={search}
          setState={setSearch}
          type="text"
          placeholder="Search by Title"
        />
        {filteredPodcast.length > 0 ? (
          <div className="podcast-flex">
            {filteredPodcast.map((item) => {
              return (
                <PodcastCard
                  title={item.title}
                  id={item.id}
                  key={item.id}
                  displayImage={item.displayImg}
                />
              );
            })}
          </div>
        ) : (
          <>No Podcast Found</>
        )}
      </div>
    </>
  );
};

export default PodcastsPage;
