import Header from "../components/common/Header";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import InputComponent from "../components/common/InputComponent";
import FileInput from "../components/common/InputComponent/FileInput";
import Button from "../components/common/Button";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
const CreateAnEpisodePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const handleAudioInput = (file) => {
    setAudioFile(file);
  };
  const handleSubmit = async () => {
    if (title && description && audioFile) {
      setLoading(true);
      try {
        const audioRef = ref(
          storage,
          `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(audioRef, audioFile);

        const audioURL = await getDownloadURL(audioRef);
        const episodeData = {
          title,
          description,
          audioFile: audioURL,
        };

        await addDoc(collection(db, "podcasts", id, "episodes"), episodeData );
        toast.success("Episode Created Sucessfully")
        setLoading(false);
        navigate(`/podcast/${id}`)
        setTitle("")
        setDescription("")
        setAudioFile(null)

      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      toast.error("All fields required");
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="input-wrapper">
        <h1>Create an Episode</h1>
        <InputComponent
          state={title}
          setState={setTitle}
          type="text"
          placeholder="Title"
          required={true}
        />
        <InputComponent
          state={description}
          setState={setDescription}
          type="text"
          placeholder="Description"
          required={true}
        />
        <FileInput
          accept="audio"
          id="audio"
          fileHandleFnc={handleAudioInput}
          text="select an Audio"
        />
        <Button
          text={loading ? "Loading..." : "Create an Episode"}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateAnEpisodePage;
