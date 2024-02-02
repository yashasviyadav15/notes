import "./styles.css";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
export default function App() {
  const docs = [
    { uri: require("../src/assests/yash.docx") },
  ];

  return (
    <div className="App">
      <h1>Sample react-doc-viewer</h1>
      <DocViewer
        pluginRenderers={DocViewerRenderers}
        documents={docs}
        config={{
          header: {
            disableHeader: false,
            disableFileName: false,
            retainURLParams: false,
          },
        }}
        style={{ height: 1000 }}
      />
    </div>
  );
}
