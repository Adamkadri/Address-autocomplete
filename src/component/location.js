import React from "react";
import { withGoogleMap, GoogleMap, withScriptjs } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from "react-google-autocomplete";
import "./css/marker.css";
import { BiCurrentLocation } from "react-icons/bi";
Geocode.setApiKey("AIzaSyDR3E0Ko3uYrfQaqX9964woDyJ8NoDn4tg");
Geocode.enableDebug();

class LocationSearchModal extends React.Component {
  // Local State

  state = {
    time: true,
    form: false,
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 15,
    height: 400,
    mapPosition: {
      lat: 0,
      lng: 0,
    },
    markerPosition: {
      lat: 0,
      lng: 0,
    },
  };

  // Function for get My Current Location

  getCurrent = () => {
    if (navigator.geolocation && this.state.time === true) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState(
          {
            time: false,
            mapPosition: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            markerPosition: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },

          () => {
            Geocode.fromLatLng(
              position.coords.latitude,
              position.coords.longitude
            ).then(
              (response) => {
                console.log(response);
                const address = response.results[0].formatted_address,
                  addressArray = response.results[0].address_components,
                  city = this.getCity(addressArray),
                  area = this.getArea(addressArray),
                  state = this.getState(addressArray);
                console.log("city", city, area, state);
                this.setState({
                  address: address ? address : "",
                  area: area ? area : "",
                  city: city ? city : "",
                  state: state ? state : "",
                });
              },
              (error) => {
                console.error(error);
              }
            );
          }
        );
        document.getElementById("map").id = "topToBottom";

        document.getElementById(
          "topToBottom"
        ).innerHTML = `<iframe width="100%" height="240" frameborder="0" className='mapof' src="https://www.google.com/maps/embed/v1/place?q=${position.coords.latitude},${position.coords.longitude}&amp;key=AIzaSyDR3E0Ko3uYrfQaqX9964woDyJ8NoDn4tg"></iframe>`;

        document.getElementById("mainBox").style.display = "block";

        setTimeout(() => {
          document.getElementById("topToBottom").id = "map";

          this.setState({
            time: true,
          });
        }, 1500);
      });
    } else {
      console.error("Geolocation is not supported by this browser!");
    }
  };

  // Function to get city from given address
  getCity = (addressArray) => {
    if (addressArray !== undefined) {
      let city = "";
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_2" === addressArray[i].types[0]
        ) {
          city = addressArray[i].long_name;
          return city;
        }
      }
    }
  };
  // Function to get Area from given address

  getArea = (addressArray) => {
    if (!(addressArray === "undefined")) {
      let area = "";
      for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0]) {
          for (let j = 0; j < addressArray[i].types.length; j++) {
            if (
              "sublocality_level_1" === addressArray[i].types[j] ||
              "locality" === addressArray[i].types[j]
            ) {
              area = addressArray[i].long_name;
              return area;
            }
          }
        }
      }
    }
  };

  // Function to get State from given address

  getState = (addressArray) => {
    if (!(addressArray === undefined)) {
      let state = "";
      for (let i = 0; i < addressArray.length; i++) {
        for (let i = 0; i < addressArray.length; i++) {
          if (
            addressArray[i].types[0] &&
            "administrative_area_level_1" === addressArray[i].types[0]
          ) {
            state = addressArray[i].long_name;
            return state;
          }
        }
      }
    }
  };

  // Function to get Selected Place by auto complete field

  onPlaceSelected = (place) => {
    console.log(place.formatted_address, place);
    if (!(place.formatted_address === undefined)) {
      const address = place.formatted_address,
        addressArray = place.address_components,
        city = this.getCity(addressArray),
        area = this.getArea(addressArray),
        state = this.getState(addressArray),
        latValue = place.geometry.location.lat(),
        lngValue = place.geometry.location.lng();

      this.setState({
        address: address ? address : "",
        area: area ? area : "",
        city: city ? city : "",
        state: state ? state : "",
        markerPosition: {
          lat: latValue,
          lng: lngValue,
        },
        mapPosition: {
          lat: latValue,
          lng: lngValue,
        },
      });

      document.getElementById("map").id = "topToBottom";

      document.getElementById(
        "topToBottom"
      ).innerHTML = `<iframe width="100%" height="240" frameborder="0" className='mapof' src="https://www.google.com/maps/embed/v1/place?q=${latValue},${lngValue}&amp;key=AIzaSyDR3E0Ko3uYrfQaqX9964woDyJ8NoDn4tg"></iframe>`;

      document.getElementById("mainBox").style.display = "block";

      setTimeout(() => {
        document.getElementById("topToBottom").id = "map";
      }, 1500);
    } else {
      alert("Your Location Does't Exist try with other words");
    }
  };

  // Function to unhide Form

  setBack() {
    this.setState({ form: false });

    if (!(this.state.address === "")) {
      setTimeout(() => {
        document.getElementById("map").id = "topToBottom";

        document.getElementById(
          "topToBottom"
        ).innerHTML = `<iframe width="100%" height="240" frameborder="0" className='mapof' src="https://www.google.com/maps/embed/v1/place?q=${this.state.markerPosition.lat},${this.state.markerPosition.lng}&amp;key=AIzaSyDR3E0Ko3uYrfQaqX9964woDyJ8NoDn4tg"></iframe>`;

        document.getElementById("mainBox").style.display = "block";

        setTimeout(() => {
          document.getElementById("topToBottom").id = "map";
        }, 1500);
      }, 500);
    }
  }

  render() {
    const AsyncMap = withScriptjs(
      withGoogleMap((props) => (
        <GoogleMap
          defaultZoom={this.state.zoom}
          defaultCenter={{
            lat: this.state.mapPosition.lat,
            lng: this.state.mapPosition.lng,
          }}
        >
          <div className="mainSearchBar">
            <h2
              style={{
                color: "#FFFFFF",
                fontFamily: "sans-serif",
                fontWeight: "320",
                opacity: "70%",
              }}
            >
              Address-autocomplete
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                marginTop: -20,
              }}
            >
              <Autocomplete
                className="searchbar"
                onPlaceSelected={this.onPlaceSelected}
                types={["(cites)"]}
              />
              <div
                id="mainIocn"
                onClick={() => {
                  this.getCurrent();
                }}
              >
                <BiCurrentLocation id="sericon" />
              </div>
            </div>

            <div>
              <p
                id="para"
                onClick={() => {
                  this.setState({ form: true });
                }}
              >
                {" "}
                Can't Find Address? <span className="edit">Edit</span>
              </p>
            </div>
          </div>
        </GoogleMap>
      ))
    );

    // Form Render

    if (this.state.form === true) {
      return (
        <div>
          <div className="mainBox1" style={{ marginTop: 50 }}>
            <h2 style={{ color: "#fff", fontWeight: "bold" }}>Address</h2>
          </div>

          <div className="mainBox" style={{ marginTop: -10 }}>
            <input
              className="searchbar1"
              placeholder="Street"
              defaultValue={this.state.area}
            ></input>

            <div className="boxES">
              <input
                className="searchbar3"
                placeholder="City"
                defaultValue={this.state.city}
              ></input>
              <input
                className="searchbar4"
                placeholder="Country"
                defaultValue={this.state.state}
              ></input>
            </div>

            <input
              className="searchbar1"
              placeholder="Address"
              defaultValue={this.state.address}
            ></input>
          </div>

          <p
            id="para"
            style={{
              color: "#BDBDBD",
              marginTop: 15,
              marginRight: 19,
              fontSize: 14,
            }}
            onClick={() => {
              this.setBack();
            }}
          >
            Return to? <span className="edit">Address Search</span>
          </p>
        </div>
      );
    }

    // Main Return Function

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
          width: "100%",
          marginTop: 50,
        }}
      >
        <AsyncMap
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDR3E0Ko3uYrfQaqX9964woDyJ8NoDn4tg&libraries=places"
          loadingElement={<div style={{ height: `50%` }} />}
          containerElement={
            <div id="map_res" style={{ height: this.state.height }} />
          }
          mapElement={
            <div
              style={{
                height: `70%`,
                marginTop: 150,
                display: "none",
                position: "absolute",
              }}
              id="mainGet"
            />
          }
        />

        <div className="mainSearchBar1" id="mainSearchBar1">
          <div id="map"></div>
        </div>

        <div>
          <div className="mainSearchBar2" id="mainBox">
            <p style={{ fontWeight: "bold", color: "#BDBDBD" }}>Address</p>

            <p style={{ color: "#BDBDBD", marginLeft: 5 }}>
              {" "}
              {this.state.address}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default LocationSearchModal;
