import React, { useEffect, useState } from "react";
import "./Home.css"; // Updated CSS file name
import solotrip from "../components/images/soloTrip.jpg";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const GetBlogs = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        "http://82.29.166.100:4000/api/auth/getblogs",
        requestOptions
      );
      const result = await response.json();

      if (result?.blogs) {
        setData(result.blogs);
      } else {
        console.error("Failed to fetch blogs:", result?.message);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    GetBlogs();
  }, []);

  const sortedData = [...data].sort((a, b) => {
    const dateA = a.createdAt
      ? new Date(a.createdAt)
      : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
    const dateB = b.createdAt
      ? new Date(b.createdAt)
      : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
    return dateB - dateA;
  });

  return (
    <div className="text-light">
      <Header />

      <div className="container">
        <div className="row">
          {/* LEFT: Featured Section */}
          <div className="col-lg-8">
            <div className="unique-main-content">
              <div className="unique-featured-article">
                <div className="unique-featured-image-container">
                  <img
                    src={solotrip}
                    alt="Featured"
                    className="unique-featured-image"
                  />
                </div>
                <div className="unique-top-news">
                  <a
                    href="#"
                    onClick={() => navigate(`/blogs/${sortedData[0]?._id}`)}
                    className="unique-featured-title"
                  >
                    {sortedData[0]?.title || "No Featured Blog Available"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Top Stories */}
          <div className="col-lg-4">
            <div className="unique-top-stories">
              <h2 className="unique-top-stories-header">Top Stories</h2>
              <ol className="unique-story-list">
                {sortedData.slice(0, 5).map((res, index) => (
                  <li
                    onClick={() => navigate(`/blogs/${res?._id}`)}
                    style={{ cursor: "pointer" }}
                    className="unique-story-item d-flex align-items-center mb-3"
                    key={index + 1}
                  >
                    <div className="unique-story-number me-3">{index + 1}</div>

                    <div className="unique-story-content flex-grow-1">
                      <h3 className="unique-story-title mb-1">{res?.title}</h3>
                      <div className="unique-story-meta">
                        <span className="unique-story-author">{res?.author}</span>
                        <p className="unique-story-time">
                          <span style={{ color: "#32a868" }}>
                            Travel Blog
                          </span>
                          <span
                            style={{
                              textTransform: "capitalize",
                              fontSize: "10px",
                              paddingLeft: "15px",
                            }}
                          >
                            {res?.createdAt
                              ? new Date(res.createdAt).toLocaleDateString()
                              : "Recently"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="unique-story-thumbnail">
                      <img
                        src={`http://82.29.166.100:4000/${res?.img?.[0]}`}
                        alt={res?.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;