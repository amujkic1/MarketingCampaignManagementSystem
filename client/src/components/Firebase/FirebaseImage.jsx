import "./FirebaseImage.css";
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

function FirebaseImage() {

  const [fileUpload, setFileUpload] = useState(null);
  const [fileUrls, setFileUrls] = useState([]);

  const filesListRef = ref(storage, "videos/");

  const uploadFile = () => {
    if (fileUpload == null) return;
    const fileRef = ref(storage, `videos/${fileUpload.name + v4()}`);
    uploadBytes(fileRef, fileUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {

        fetch('https://marketing-campaign-management-system-server\.vercel\.app/addmediaurl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url, id: 38 })
        })
        .then(async response => {
          if (response.ok) {
            console.log('ok');
          } else {
            return response.json().then(data => {
              throw new Error(data.message);
            });
          }
        })
        .catch(error => {
          setErrorMessage('Failed to upload files.');
        });
          console.log(url);
          //setFileUrls((prev) => [...prev, url]);
        });

      });
  };

  useEffect(() => {
    listAll(filesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setFileUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div className="App">
      <input
        type="file"
        accept="video/*"
        onChange={(event) => {
          setFileUpload(event.target.files[0]);
        }}
      />
      <button onClick={uploadFile}>Upload Video</button>
      {fileUrls.map((url, index) => {
        return (
          <div key={index}>
            <video controls width="250">
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      })}
    </div>
  );
}

export default FirebaseImage;