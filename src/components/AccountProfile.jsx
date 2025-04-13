/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./all.css";
import { CiEdit } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";
import Header from "./Header";
import { Country, City } from "country-state-city";
import logo from "../components/images/logo.png";

const AccountProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [committingName, setCommittingName] = useState("");
  const [textarea, setTextarea] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [foodPreference, setFoodPreference] = useState("");
  const [hiking, setHiking] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const [show, setShow] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handlePasswordClose = () => setShowPasswordModal(false);
  const handlePasswordShow = () => setShowPasswordModal(true);

  const [Data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cities, setCities] = useState([]);

  // Country change hone par respective cities fetch karo
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);

    const countryCities = City.getCitiesOfCountry(countryCode);
    setCities(countryCities);
  };

  // Country change par city fetch karne ka logic
  useEffect(() => {
    if (country) {
      const selectedCities = City.getCitiesOfCountry(country) || [];
      setCities(selectedCities);
    } else {
      setCities([]);
    }
  }, [country]);

  const [formData, setFormData] = useState([]);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // const [imagePreview, setImagePreview] = useState(null);

  const fetchUserData = async () => {
    // alert("sdhbsjhvsd")
    try {
      const response = await fetch(
        `http://82.29.166.100:4000/api/auth/user/${
          JSON.parse(localStorage.getItem("userData"))?.user?._id ||
          JSON.parse(localStorage.getItem("userData"))?._id
        }`
      );
      const result = await response.json();
      if (result.user) {
        console.log(result.user, "Fetched User Data");
        setFormData(result.user);

        // Set fetched data into each input state
        setEmail(result.user.email || "");
        setName(result.user.name || "");
        setCommittingName(result.user.committingName || "");
        setTextarea(result.user.textarea || "");
        setCountry(result.user.country || "");
        setCity(result.user.city || "");
        setTravelStyle(result.user.travelStyle || "");
        setBudgetRange(result.user.budgetRange || "");
        setFoodPreference(result.user.foodPreference || "");
        setHiking(result.user.hiking || "");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (show) {
      setName(formData?.name || "");
      setCommittingName(formData?.committingName || "");
      setCountry(formData?.country || "");
      setCity(formData?.city || "");
      setTravelStyle(formData?.travelStyle || "");
      setBudgetRange(formData?.budgetRange || "");
      setFoodPreference(formData?.foodPreference || "");
      setHiking(formData?.hiking || "");
      setTextarea(formData?.bio || "");
      setEmail(formData?.email || "");
    }
  }, [show, formData]);

  

  const UpdateProfile = async () => {
    try {
      const formdata = new FormData();
      formdata.append("email", formData.email);
      formdata.append("password", "12345");
      formdata.append("name", name);
      if (file) formdata.append("img", file);
      formdata.append("textarea", textarea);
      formdata.append("committingName", committingName);
      formdata.append("location", "dcs");
      formdata.append("country", country);
      formdata.append("city", city);
      formdata.append("travelStyle", travelStyle);
      formdata.append("budgetRange", budgetRange);
      formdata.append("foodPreference", foodPreference);
      formdata.append("hiking", hiking);

      const response = await fetch(
        `http://82.29.166.100:4000/api/auth/update/${
          JSON.parse(localStorage.getItem("userData"))?.user?._id ||
          JSON.parse(localStorage.getItem("userData"))?._id
        }`,
        {
          method: "PUT",
          body: formdata,
          redirect: "follow",
        }
      );

      const result = await response.json();
      console.log("API Response:", result); // 🔍 Response ko console karein

      if (response.ok) {
        toast.success(result?.message || "Profile updated successfully");
        console.log(result?.message, "gajju bhai");
        await fetchUserData(); // ✅ Ensure ye properly define ho
        setEmail("");
        // setPassword("");
        setFile(null);
        setName("");
        setTextarea("");
        setCommittingName("");
        setCountry("");
        setCity("");
        setTravelStyle("");
        setBudgetRange("");
        setFoodPreference("");
        setHiking("");
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 500);
        setTimeout(() => {
          handleClose(); // ✅ Ensure ye properly define ho
        }, 1000);
      } else {
        console.error("API response error:", result);
        toast.error(result?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ position: "relative", width: "150px", height: "150px" }}>
          <div
            style={{
              border: "10px solid #f3f3f3",
              borderTop: "10px solid #3498db",
              borderRadius: "50%",
              width: "150px",
              height: "150px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          {/* Center Image inside the spinner */}
          <img
            src={logo}
            alt="Loading"
            style={{
              width: "80px",
              height: "80px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Header className="text-dark" />
      <div className="backImg">
        <div className="container-fluid bg-white">
          <div className="row">
            <div className="col-lg-10 m-auto">
              <div className="card mt-4">
                {/* <h3>{formData?.email}</h3> */}
                <div className="card-body">
                  <div className="container-fluid p-2 ps-4">
                    <div className="row">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <h1 className="account-title">Your Account</h1>
                        <button
                          className="reset-button mt-3 h-25"
                          onClick={handlePasswordShow}
                        >
                          RESET PASSWORD
                        </button>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <h4 className="profile1">Profile</h4>
                          <h6 className="subscribe text-dark">
                            Subscription & Billing
                          </h6>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="account-details">
                          <div
                            className="mb-4"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <h2 className=" ">Hi there!</h2>
                            <button
                              onClick={handleShow}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                cursor: "pointer",
                              }}
                              className="edit-button"
                            >
                              <CiEdit /> Edit{" "}
                            </button>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-sm-12">
                              <div class="form-group">
                                <label for="exampleInputEmail1">Email </label>
                                <input
                                  type="email"
                                  class="form-control shadow-none"
                                  id="exampleInputEmail1"
                                  aria-describedby="emailHelp"
                                  value={formData?.email || email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="col-lg-6 col-sm-12">
                              <div class="form-group">
                                <label for="exampleInputEmail1">Name </label>
                                <input
                                  type="email"
                                  class="form-control  shadow-none"
                                  id="exampleInputEmail1"
                                  aria-describedby="emailHelp"
                                  value={formData?.name || name}
                                  onChange={(e) => setName(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-sm-12">
                              <div class="form-group">
                                <label for="exampleInputEmail1">Bio </label>
                                <input
                                  type="email"
                                  class="form-control shadow-none"
                                  id="exampleInputEmail1"
                                  aria-describedby="emailHelp"
                                  value={formData?.textarea || textarea}
                                  onChange={(e) => setTextarea(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="col-lg-6 col-sm-12">
                              <div class="form-group">
                                <label for="exampleInputEmail1">
                                  COMMENTING NAME{" "}
                                </label>
                                <input
                                  type="email"
                                  class="form-control  shadow-none"
                                  id="exampleInputEmail1"
                                  aria-describedby="emailHelp"
                                  value={
                                    formData?.committingName || committingName
                                  }
                                  onChange={(e) =>
                                    setCommittingName(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="container-fluid bg-white">
                    <div className="row  ">
                      <div className="col-lg-6 m-auto">
                        <div className="row">
                          <div className="col-lg-6 col-sm-12">
                            {/* Country Dropdown */}
                            <div class="form-group">
                              <label for="exampleInputEmail1">Country </label>
                              <input
                                type="text"
                                class="form-control  shadow-none"
                                value={formData?.country || country}
                                onChange={(e) => setCountry(e.target.value)}
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 col-sm-12">
                            {/* City Dropdown */}
                            <div class="form-group">
                              <label for="exampleInputEmail1">City </label>
                              <input
                                type="email"
                                class="form-control  shadow-none"
                                value={formData?.city || city}
                                onChange={(e) => setCity(e.target.value)}
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="row">
                            <div className="col-lg-6 col-sm-12">
                              {/* Travel prefences */}
                              <div class="form-group">
                                <label for="exampleInputEmail1">
                                  Travel Style{" "}
                                </label>
                                <input
                                  type="email"
                                  class="form-control  shadow-none"
                                  value={formData?.travelStyle || travelStyle}
                                  onChange={(e) =>
                                    setTravelStyle(e.target.value)
                                  }
                                  id="exampleInputEmail1"
                                  aria-describedby="emailHelp"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-12">
                              {/* Budget Range */}
                              <div class="form-group">
                                <label for="exampleInputEmail1">
                                  Budget Range{" "}
                                </label>
                                <input
                                  type="email"
                                  class="form-control  shadow-none"
                                  id="exampleInputEmail1"
                                  value={formData?.budgetRange || budgetRange}
                                  onChange={(e) =>
                                    setBudgetRange(e.target.value)
                                  }
                                  aria-describedby="emailHelp"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-6 col-sm-12">
                              {/* Food performange  */}
                              <div class="form-group">
                                <label for="exampleInputEmail1">
                                  Food performange
                                </label>
                                <input
                                  type="email"
                                  class="form-control  shadow-none"
                                  id="exampleInputEmail1"
                                  value={
                                    formData?.foodPreference || foodPreference
                                  }
                                  onChange={(e) =>
                                    setFoodPreference(e.target.value)
                                  }
                                  aria-describedby="emailHelp"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-sm-12">
                              {/* Activity interests  */}
                              <div class="form-group">
                                <label for="exampleInputEmail1">
                                  Activity interests{" "}
                                </label>
                                <input
                                  type="email"
                                  class="form-control  shadow-none"
                                  id="exampleInputEmail1"
                                  value={formData?.hiking || hiking}
                                  onChange={(e) => {
                                    setHiking(e.target.value);
                                  }}
                                  aria-describedby="emailHelp"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          className="text-black"
          show={show}
          onHide={handleClose}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                className="input-field p-2"
                placeholder="Enter your name"
                // value={formData?.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="text"
                className="input-field p-2"
                placeholder="Enter your email"
                value={formData?.email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly
              />
            </div>

            <div className="input-group">
              <label>COMMENTING NAME</label>
              <input
                type="text"
                className="input-field p-2"
                placeholder="Enter your commenting name"
                value={committingName}
                onChange={(e) => setCommittingName(e.target.value)}
              />
            </div>

            {/* Country Dropdown */}
            <div className="input-group">
              <label>Country</label>
              <select
                className="custom-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="" disabled selected>
                  Select Country
                </option>
                {Country.getAllCountries().map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div className="input-group">
              <label>City</label>
              <select
                className="custom-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="" disabled selected>
                  Select City
                </option>
                {cities.map((city) => (
                  <option key={city?.name} value={city?.name}>
                    {city?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Travel Preferences */}
            <div className="input-group">
              <label>Travel Style</label>
              <select
                className="custom-select"
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
              >
                <option value="" disabled selected>
                  Travel Style
                </option>
                <option>Solo</option>
                <option>Group</option>
                <option>Family</option>
                <option>Couple</option>
              </select>
            </div>

            {/* Budget Range */}
            <div className="input-group">
              <label>Budget Range</label>
              <select
                className="custom-select"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
              >
                <option value="" disabled selected>
                  Budget Range
                </option>
                <option>Low Range</option>
                <option>Mid Range</option>
                <option>High Range</option>
              </select>
            </div>

            {/* Food Preferences */}
            <div className="input-group">
              <label>Food Preference</label>
              <select
                className="custom-select"
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
              >
                <option value="" disabled selected>
                  Food Preference
                </option>
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Non-Vegetarian</option>
              </select>
            </div>

            {/* Activity Interests */}
            <div className="input-group">
              <label>Activity Interests</label>
              <select
                className="custom-select"
                value={hiking}
                onChange={(e) => setHiking(e.target.value)}
              >
                <option value="" disabled selected>
                  Activity Interests
                </option>
                <option>Hiking</option>
                <option>Beaches</option>
                <option>Nightlife</option>
              </select>
            </div>

            {/* File Upload */}
            {/* <div className="input-group">
        <label>Profile Image</label>
        <input
          type="file"
          className="input-field"
          onChange={handleFileChange}
        />
      </div> */}

            {/* Bio */}
            <div className="input-group">
              <label>Bio</label>
              <textarea
                className="input-field"
                value={textarea}
                onChange={(e) => setTextarea(e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>

            <Button
              variant="primary"
              onClick={() => {
                UpdateProfile();
              }}
            >
            Update Profile
            </Button>
          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={handleClose}>
              Close
            </Button> */}
            {/* <Button variant="primary" onClick={handleUpdateProfile}>Save Changes</Button>  */}
          </Modal.Footer>
        </Modal>

        <Modal
          className="text-black"
          show={showPasswordModal}
          onHide={handlePasswordClose}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Reset Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group">
              <label>Old Password</label>
              <input
                type="password"
                name="oldPassword"
                className="input-field"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                className="input-field"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handlePasswordClose}>
              Close
            </Button>
            <Button variant="primary">Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default AccountProfile;

// <div className='col-lg-6 m-auto'>

// <div className='row'>
//   <div className='col-lg-6 col-sm-12'>
// {/* Country Dropdown */}
// <select
// className="custom-select mt-2"
// onChange={handleCountryChange}
// >
// <option value="" disabled selected>
// Select Country
// </option>
// {Country.getAllCountries().map((country) => (
// <option key={country.isoCode} value={country.isoCode}>
//   {country.name}
// </option>
// ))}
// </select>
//   </div>

//   <div className='col-lg-6 col-sm-12'>
// {/* City Dropdown */}
// <select className="custom-select mt-2">
// <option value="" disabled selected>
// Select City
// </option>
// {cities.map((city) => (
// <option key={city.name} value={city.name}>
//   {city.name}
// </option>
// ))}
// </select>
//     </div>
// </div>
// <div >

// <div className='row'>
{
  /* <div className='col-lg-6 col-sm-12'> */
}
{
  /* Travel prefences */
}
{
  /* <select className="custom-select mt-2">
<option value="" disabled selected>   Travel Style  </option>
<option> backpacker </option>
<option> Luxury Getaways  </option>
<option> Adventure   </option>
<option> Solo    </option>
<option> Group    </option>
<option> Road Trip Adventures </option>
<option> etc. </option>

</select> */
}
{
  /* </div> */
}
{
  /* <div className='col-lg-6 col-sm-12'>

<select className="custom-select mt-2">
<option value="" disabled selected>   Budget Range  </option>
<option> Budget </option>
<option> Mid Range  </option> 
<option> luxury  </option> 

</select>
</div>
</div> */
}

// <div className='row'>
// <div className='col-lg-6 col-sm-12'>
//   {/* Food performange  */}
// <select className="custom-select mt-2">
// <option value="" disabled selected>  Food performange  </option>
// <option> Vegetarian </option>
// <option> vegan  </option>
// <option > Non-Vegetarian  </option>
// <option > Local cuisine  </option>

// </select>
// </div>
// <div className='col-lg-6 col-sm-12'>
//  {/* Activity interests  */}
// <select className="custom-select w-100 mt-2">
// <option value="" disabled selected>  Activity interests   </option>
// <option> Hiking </option>
// <option> Beaches  </option>
// <option> Nightlife  </option>
// <option> Cultural  </option>
// <option> Historical  </option>

// </select>
// </div>
// </div>

// </div>
// </div>
