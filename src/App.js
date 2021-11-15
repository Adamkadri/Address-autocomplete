import "./App.css";
import LocationSearchModal from "./component/location";

// Main Function
function App() {
  // if want to use Complete in your component
  // const get_address=(p)=>{

  //  console.log(p);

  // }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        flexDirection: "column",
      }}
    >
      {/* MAin Location Component */}

      <LocationSearchModal
        style={{ borderRadius: "10px" }}
        // get_data={get_address}
      />
    </div>
  );
}

export default App;
