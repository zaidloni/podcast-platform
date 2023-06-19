import Header from "../components/common/Header";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import InputComponent from "../components/common/InputComponent";
import Button from "../components/common/Button";
import FileInput from "../components/common/InputComponent/FileInput";
import { toast } from "react-toastify";
import { auth, db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const CreateAPodcast = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImg, setBannerImg] = useState();
  const [displayImg, setDisplayImg] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (title && description && bannerImg && displayImg) {
      setLoading(true);
      try {
        const bannerImgRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(bannerImgRef, bannerImg);
        const bannerImgURL = await getDownloadURL(bannerImgRef);

        const displayImgRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(displayImgRef, displayImg);
        const displayImgURL = await getDownloadURL(displayImgRef);

        toast.success("File Upload Successful");

        const podcastData = {
          title,
          description,
          bannerImg: bannerImgURL,
          displayImg: displayImgURL,
          createdBy: auth.currentUser.uid,
        };
        const docRef = await addDoc(collection(db, "podcasts"), podcastData);
        setTitle("");
        setDescription("");
        setBannerImg(null);
        setDisplayImg(null);
        toast.success("Podcast Created Successfully");
        setLoading(false);

        console.log(bannerImgURL, displayImgURL);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
        setLoading(false);

      }
    } else {
      toast.error("Please Enter All Values");
        setLoading(false);

    }
  };

  const bannerImgHandle = (file) => {
    setBannerImg(file);
  };
  const displayImgHanlde = (file) => {
    setDisplayImg(file);
  };
  return (
    <>
      <Header />
      <div className="input-wrapper">
        <h1>Create A Podcast</h1>

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
        {/* <InputComponent
          state={bannerImg}
          setState={setBannerImg}
          type="file"
          placeholder="Banner Img"
          required={true}
        />
        <InputComponent
          state={displayImg}
          setState={setDisplayImg}
          type="file"
          placeholder="Display Img"
          required={true}
        /> */}

        <FileInput accept="img" id="banner" fileHandleFnc={bannerImgHandle} text="Select an Img"/>
        <FileInput accept="img" id="display" fileHandleFnc={displayImgHanlde} text= "Select an Img"/>

        <Button
          text={loading ? "Loading..." : "Create Podcast"}
          onClick={handleSubmit}
        />
      </div>
    </>
  );
};

export default CreateAPodcast;
