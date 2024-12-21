import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import "react-quill/dist/quill.snow.css";
import { throttle } from "lodash";
import "../App.css";

export const TextEditor = () => {
  const quillRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Track if a change was made by the local user
  const isLocalChange = useRef(false);

  const documentRef = doc(db, "documents", "example-doc");
  const saveContent = throttle(() => {
    if (quillRef.current && isLocalChange.current) {
      const content = quillRef.current.getEditor().getContents();
      console.log(`saving content to db: `, content);

      setDoc(documentRef, { content: content.ops }, { merge: true })
        .then(() => console.log("content saved"))
        .catch(console.error);
      isLocalChange.current = false;
    }
  }, 1000);

  useEffect(() => {
    if (quillRef.current) {
      // load initial content from firestore DB
      getDoc(documentRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const savedContent = docSnap.data().content;
            if (savedContent) {
              quillRef.current.getEditor().setContents(savedContent);
            }
          } else {
            console.log("no doc found, starting with an empty editor");
          }
        })
        .then(console.error);

      // listen to firestore for any updates and update locally in real-time
      const unsubscribe = onSnapshot(documentRef, (snapshot) => {
        if (snapshot.exists()) {
          const newContent = snapshot.data().content;

          if (!isEditing) {
            const editor = quillRef.current.getEditor();
            const currentCursorPosition = editor.getSelection()?.index || 0;

            editor.setContents(newContent, "silent");
            editor.setSelection(currentCursorPosition);
          }
        }
      });

      // listen for local text changes and save it to firestore
      const editor = quillRef.current.getEditor();
      editor.on("text-change", (a: any, b: any, source: any) => {
        //remove error to firebase deploy
        if (a === b){
          return a
        }
        if (source === "user") {
          isLocalChange.current = true;
          setIsEditing(true);
          saveContent();

          setTimeout(() => setIsEditing(false), 5000);
        }
      });

      return () => {
        unsubscribe();
        editor.off("text-change");
      };
    }
  }, []);

  return (
    <div className="google-docs-editor">
      <ReactQuill ref={quillRef} />
    </div>
  );
};
