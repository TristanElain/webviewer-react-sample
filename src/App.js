import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";

const doc1 = "/files/PDFTRON_about.pdf";
const doc2 = "/files/PDF-4.pdf";

const App = () => {
  const viewer = useRef(null);
  const [docToLoad, setDocToLoad] = useState(doc1);
  const [instance, setInstance] = useState();

  const handleLoadDoc = () => {
    setDocToLoad((actual) => (actual === doc1 ? doc2 : doc1));
  };

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        initialDoc: doc1,
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      setInstance(instance);

      documentViewer.addEventListener("documentLoaded", () => {
        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: 1,
          // values are in page coordinates with (0, 0) in the top left
          X: 100,
          Y: 150,
          Width: 200,
          Height: 50,
          Author: annotationManager.getCurrentUser(),
        });

        annotationManager.addAnnotation(rectangleAnnot);
        // need to draw the annotation otherwise it won't show up until the page is refreshed
        annotationManager.redrawAnnotation(rectangleAnnot);
      });
    });
  }, []);

  useEffect(() => {
    if (!instance) {
      return;
    }
    instance.UI.loadDocument(docToLoad);
  }, [docToLoad]);
  return (
    <div className="App">
      <div className="header">
        React sample
        <button onClick={() => handleLoadDoc()}>Load another doc</button>
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
