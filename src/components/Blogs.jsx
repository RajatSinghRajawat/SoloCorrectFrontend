/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "./Header";
import "./blogs.css"; // Importing CSS
import { CiLink } from "react-icons/ci";
import { FaFacebookF, FaThreads } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa"; // Import icons
import Demo from "./images/4.png";
import ABC from "./images/4.png";
import David from "./images/nn.webp";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShare } from "react-icons/fa";
const Blogs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState({});

  // Fetch userId from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?._id || null;
  // Fetch single blog by ID
  const GetSoloblog = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/getblog/${encodeURIComponent(id)}`
      );
      const result = await response.json();
      console.log("API Response:", result);
      if (result.blog) {
        setData(result.blog);
      }
    } catch (error) {
      console.error("API Error:", error.message);
    }
  };

  useEffect(() => {
    if (id) {
      GetSoloblog();
    }
  }, [id]);

  const [data2, setData2] = useState([]);

  const handleLike = async (blogId) => {
    if (!userId) {
      toast.error("Please log in to like a blog");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/like/${blogId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        toast.success("Like updated successfully");
        GetBlogs(); // Refresh blogs to update like count
      } else {
        toast.error(result.message || "Error updating like");
        console.error("API Error Response:", result);
      }
    } catch (error) {
      toast.error("Error updating like");
      console.error("Like API Error:", error);
    }
  };

  const handleComment = async (blogId) => {
    if (!userId) {
      toast.error("Please log in to comment");
      return;
    }

    const text = commentText[blogId]?.trim();
    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/comment/${blogId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, text }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        toast.success("Comment added successfully");
        setCommentText((prev) => ({ ...prev, [blogId]: "" }));
        GetBlogs();
      } else {
        toast.error(result.message || "Error adding comment");
        console.error("API Error Response:", result);
      }
    } catch (error) {
      toast.error("Error adding comment");
      console.error("Comment API Error:", error);
    }
  };

  const GetBlogs = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:4000/api/auth/getblogs",
        requestOptions
      );
      const result = await response.json();

      if (result?.blogs) {
        setData2(result.blogs); // ✅ Correct condition
        console.log(result?.blogs.img);
      } else {
        console.error("Failed to fetch blogs:", result?.message);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  const GetComments = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        `http://localhost:4000/api/auth/comments/${encodeURIComponent(id)}`,
        requestOptions
      );
      const result = await response.json();
      console.log("Comments Response:", result);
      if (result) {
        setComments(result.comments);
      }
    } catch (error) {
      console.error("Comments API Error:", error);
    }
  };

  useEffect(() => {
    GetBlogs();
    GetComments();
  }, []);

  return (
    <div>
      <Header />

      <div className="blog-container">
        <div className="py-4" style={{ padding: "10px 0", textAlign: "start" }}>
          <h5 className="card-title text-light fw-bold">
            Title : {data.title}
          </h5>
        </div>{" "}
        <div className="image-gallery">
          {Array.isArray(data?.img) && data?.img.length > 0 ? (
            <>
              <div className="large-image">
                <img
                  src={`http://localhost:4000/${data.img[0]}`}
                  className="blog-image"
                  alt="Main Blog Image"
                />
              </div>

              <div className="right-images">
                {data.img.slice(1, 3).map((image, index) => (
                  <div key={index} className="small-image">
                    <img
                      src={`http://localhost:4000/${image}`}
                      className="blog-image"
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              {data.img.slice(3, 5).map((image, index) => (
                <div key={index} className="small-image">
                  <img
                    src={`http://localhost:4000/${image}`}
                    className=""
                    style={{ height: "20rem", objectFit: "cover" }}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </>
          ) : (
            <p>No images available</p>
          )}
        </div>
        {/* Blog Content */}
        <div className="blog-content">
          <h1>Shortdescription for this Blog</h1>
          <p className="blog-description">
            <strong>Shortdescription</strong> :{data?.shortdescription}
          </p>

          <p className="blog-author d-flex align-items-center gap-2">
            by <span className="author-name">{data.author || "!Author"}</span>{" "}
            <div className="d-flex align-items-center">
              <button
                onClick={() => handleLike(data._id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                {data.likes?.map(String).includes(userId) ? (
                  <FaHeart color="red" size={20} />
                ) : (
                  <CiHeart size={20} />
                )}
              </button>
              <span className="ms-2 text-muted">
                {data.likes?.length || 0} Likes
              </span>
              <div className="ms-2">
                <FaShare />
              </div>
            </div>{" "}
          </p>
          <p className="blog-author">
            {new Date(data?.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}{" "}
            GMT+5:30
          </p>

          {/* Social Media & Comments Section */}
          <div className="social-icons">
            <CiLink className="icon" />
            <FaFacebookF className="icon" />
            <FaThreads className="icon" />
          </div>

          {/* <div className="comment-section">
            <div className="comment-count">81</div>
            <span>Comments (81 New)</span>
          </div> */}
          <div className="d-flex align-items-center">
            <input
              className="mt-3"
              type="text"
              placeholder="Add a comment..."
              value={commentText[data._id] || ""}
              onChange={(e) =>
                setCommentText((prev) => ({
                  ...prev,
                  [data._id]: e.target.value,
                }))
              }
              style={{
                width: "100%",
                padding: "8px 0",
                border: "none",
                borderBottom: "2px solid grey",
                background: "transparent",
                outline: "none",
                color: "#333",
                fontSize: "0.9rem",
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleComment(data._id);
              }}
            />
            <button
              onClick={() => handleComment(data._id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: "8px",
              }}
            >
              <IoSend size={20} color="#ff9800" />
            </button>
          </div>
          <div className="comments-section mt-4">
            <h3>Comments</h3>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="comment">
                  <p>
                    <strong>{comment.user?.name || "Unknown User"} </strong>:{" "}
                    {comment.text}
                  </p>
                  <small>
                    {new Date(comment.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </small>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>

          <hr className="divider" />
          <i className="note">
            If you buy something from a Verge link, Vox Media may earn a
            commission. See our ethics statement.
          </i>
        </div>
        <div className="container mt-4">
          <div className="row">
            <div className="col-lg-7">
              <div style={{ display: "flex", alignContent: "center" }}>
                <img
                  src={David}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "10px",
                  }}
                />
                <p className="text-white ms-3 mt-2">
                  {" "}
                  <div
                    dangerouslySetInnerHTML={{ __html: data?.fulldescription }}
                  />
                </p>
              </div>

              {/* <div className="p-4 shadow-sm  text-white">
                <p>
                  Hi, friends! Welcome to <i>Installer</i> No. 74, your guide to
                  the best and <i>Verge</i>-iest stuff in the world. (If you're
                  new here, welcome, sorry in advance for my terrible TV taste,
                  and also you can read all the old editions at the{" "}
                  <i>Installer</i> homepage.)
                </p>

                <p>
                  This week, I’ve been reading about <b>Bybit, Walmart</b>, and{" "}
                  <b>sports analytics</b>; devouring the first season of{" "}
                  <b>Running Point</b> and the seventh season of{" "}
                  <i>Drive to Survive</i>; listening to <i>Scam Inc</i> and{" "}
                  <i>Tested</i>; obsessing over my progdatas in{" "}
                  <b>Fantasy Hike</b>; getting the hang of <i>Tiny Wings</i>{" "}
                  again; and making a lot of pancakes for a toddler who suddenly
                  won’t eat anything else.
                </p>

                <p>
                  I also have for you a couple of exciting new Apple products,
                  some fun stuff to watch this weekend, the return of a
                  legendary social media platform, and much more. Plus, I’m an
                  idiot. More on that in a minute. Let’s dig in.
                </p>

                <p>
                  (As always, the best part of <i>Installer</i> is your ideas
                  and tips. What are you into right now? What are you playing /
                  reading / watching / downloading / building / eating with
                  toast this week? Tell me everything:
                  <a
                    href="mailto:installer@theverge.com"
                    className="text-primary"
                  >
                    {" "}
                    installer@theverge.com
                  </a>
                  . And if you know someone else who might enjoy{" "}
                  <i>Installer</i>, tell them to{" "}
                  <a href="#" className="text-primary">
                    subscribe here
                  </a>
                  .)
                </p>
              </div> */}
            </div>
          </div>
        </div>
        {/* <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <ul className="text-white">
                <li>
                  <p>
                    {" "}
                    <b> The new MacBook Air.</b> The MacBook Air is probably my
                    longest-running default recommendation. If you just want a
                    laptop, no follow-up questions, get an Air. This one’s
                    faster and has a better webcam, and I even like the pale
                    blue here. And it’s cheaper! A miracle!
                  </p>
                </li>
                <li>
                  <p>
                    {" "}
                    <b> The new iPad.</b> The new iPad Air got all of Apple’s
                    attention this week, but I think the new base model is the
                    bigger deal. This is the iPad I’d tell most people to buy —
                    I wish it had gotten a bigger chip bump, but this’ll still
                    do iPad things nicely. And $349 is the right price.
                  </p>
                </li>
                <li>
                  <p>
                    {" "}
                    <b> Split Fiction.</b> I need more gamer friends, because
                    wow does this game look like a fun co-op. It looks like
                    Blade Runner and Tron. There’s a company called Radar. There
                    are puzzles and fights and — seriously, who wants to play a
                    lot of this with me? Like, right now.
                  </p>
                </li>
                <li>
                  <p>
                    {" "}
                    <b> Daredevil</b> : Born Again. I always liked the old
                    Daredevil series and Charlie Cox as Matt Murdock. As ever
                    with Marvel TV, this one sounds a little uneven in its
                    execution and requires an annoying amount of lore knowledge,
                    but I still enjoy watching some kickass crime fighting. And
                    there’s plenty of it.
                  </p>
                </li>
                <li>
                  <p>
                    {" "}
                    <b> The Nothing Phone 3A</b>. Nothing might be the most
                    interesting company in smartphones right now. It’s doing
                    really cool, unique stuff, and it seems to be really
                    starting to dial in its cameras. I particularly like the new
                    Essential Space feature that collects and organizes all the
                    photos, screenshots, and other stuff your phone accumulates
                    all day.
                  </p>
                </li>
                <li>
                  <p>
                    {" "}
                    <b> “Technology isn’t fun anymore.” </b> In this video, Drew
                    Gooden puts words to what I think a lot of people are
                    feeling about the state of technology right now. I don’t
                    agree with all of it, but it’s a pretty solid argument — and
                    raises a lot of questions about why we feel so disillusioned
                    with the state of things and what better would even look
                    like.
                  </p>
                </li>
                <li>
                  <p>
                    {" "}
                    <b> Twitter: Breaking the Bird. </b> A four-part CNN series,
                    starting on Sunday, about how Twitter got big, changed the
                    world, and screwed up a million ways along the journey. I
                    know this story pretty well, but I’m still fascinated to see
                    how this series tries to make sense of it all.
                  </p>
                </li>

                <li>
                  <p>
                    {" "}
                    <b> Deli Boys. </b> I swear I’ve been seeing ads for this
                    show in my feeds for, like, a decade. But it seems to be
                    funny and timely — a comedy, a crime show, and a critique of
                    capitalism? As ever, give me more fun half-hour shows. I’m
                    in on this one.
                  </p>
                </li>

                <li>
                  <p>
                    {" "}
                    <b> Palworld for Mac. </b> Pokémon with guns continues to be
                    a thing, and it’s now available on any Mac with at least an
                    M1 chip. It sounds like crossplay doesn’t work, though, so
                    make sure you have Mac friends to play with.
                  </p>
                </li>

                <li>
                  <p>
                    {" "}
                    Digg. Right now, the new Digg is just a landing page and a
                    signup list. But having spent some time with the folks
                    bringing it back (including original creator Kevin Rose),
                    I’m excited to see what new ideas about online community
                    might turn into over time.
                  </p>
                </li>
              </ul>
            </div>

            <div className="col-lg-1 mt-4"></div>
            <div className="col-lg-4 hello mt-4">
              {/* <ol className="text-white" style={{fontWeight:'600', position:'sticky', top:'20px'}}>
        <li >Check your DVDs for disc rot — Warner Bros. says it’s replacing them</li>

        <hr style={{color:'#fff', width:'50%', height:'3px'}}/>
        <li >Some Chromecasts are giving ‘Untrusted device’ errors today</li>

        <hr style={{color:'#fff', width:'50%', height:'3px'}}/>


        <li >Some nice upgrades for Apple’s best gadgets</li> 
        <hr style={{color:'#fff', width:'50%', height:'3px'}}/>


        <li >Here’s what the newest iPhone Air leaks say about its design</li> 
        <hr style={{color:'#fff', width:'50%', height:'3px'}}/>

        <li >It’s a great moment for classic RPGs</li> 
        <hr style={{color:'#fff', width:'50%', height:'3px'}}/>
      </ol> */}
        {/* <div className="p-4 text-white">
                {data2?.slice(0, 5).map((res, index) => {
                  return (
                    <li
                      onClick={() => navigate(`/blogs/${res?._id}`)}
                      style={{ cursor: "pointer" }}
                      className="story-item"
                      key={index + 1}
                    >
                      <div className="story-number">{index + 1}</div>
                      <div className="story-content">
                        <h3 className="story-title">{res?.title}</h3>
                        <br />
                        <h3 className="story-title">{res?.shortdescription}</h3>
                        <div className="story-meta">
                          <span className="story-author">{res?.author}</span>
                          <span className="story-time">
                            {res?.fulldescription.replace(/<[^>]*>/g, "")}
                          </span>
                        </div>
                      </div>
                      <div className="story-thumbnail">
                        {/* <img src={res.img} alt={res?._id} /> */}
        {/* <img
                          src={`http://localhost:4000/${res?.img?.[0]}`} // First image from array
                          alt={res?.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </div>
            </div> */}
        {/* </div> */}
        {/* </div>   */}
        {/* <div className="container mt-4">
          <div className="row">
            <div className="col-lg-7">
              <h2 className="text-white">Screen share </h2>
              <p className="text-white">
                This week is Installer 74. Until about six minutes ago, I
                thought it was Installer 75, which meant it would have been time
                for me to share my own homescreen, as I do every 25 issues here.
                Since I am terrible at counting, I neglected to find someone
                else to share their homescreen in this space. (This is the kind
                of week I’m having. Send good vibes.)
              </p>
              <p className="text-white">
                Anyway! It turns out there are no actual rules around here, so
                we’re jumping the gun a week — and since so many of you liked
                seeing Charlie Harding’s computer screen a couple of weeks ago,
                I’m going to show you mine. So here is a (mostly) unfiltered
                look at what’s happening on my computer right now:
              </p>

              <div>
                <img src={ABC} className="h-75 w-100" />
              </div>

              <div className="text-white mt-5">
                <p>
                  <strong>The computer:</strong> a base model M4 Mac Mini, which
                  I bought last fall. It does not have enough USB-C ports, but I
                  love it nonetheless.
                </p>
                <p>
                  <strong>The wallpaper:</strong> The 1984-era Macintosh
                  wallpaper that comes with MacOS Sequoia. I have it in gray — I
                  like it better in other colors, but then the screen reflection
                  gives my face a sort of sickly hue. So it’s gray.
                </p>
                <p>
                  <strong>The apps:</strong> Mimestream, Messages, Fission,
                  Downie, Signal, WhatsApp, FaceTime, Spotify, Things, Calendar,
                  1Password, Notion Calendar, Notion, Anybox, Arc, MyMind,
                  Craft, Slack, NotePlan, App Store, Loopback, Settings, iPhone
                  Mirroring, VLC, Apple Frames, Vocaster Hub, Quicktime, Chrome,
                  TextEdit.
                </p>
                <p>
                  I use most of these apps on a daily basis. (I have no idea why{" "}
                  <u>Calendar</u> is here. I never use <u>Calendar</u>.) A bunch
                  of them — Fission, Downie, VLC, Loopback — are for various
                  podcasting-related things. I use Notion for all my project
                  management stuff and NotePlan for my day-to-day tasks and
                  notes. Once a week or so, I debate switching everything into
                  Craft just because the app is so lovely (but still just a
                  feature or two away from what I need).
                </p>
                <p>
                  MyMind and Anybox are for storing links, images, and other
                  stuff I might want or need later, and everything else is
                  pretty self-explanatory. I really recommend downloading
                  desktop versions of all your messaging apps; I am now the
                  world’s fastest texter because I’m hardly ever texting from my
                  phone.
                </p>
                <p>
                  I go through phases with my computer. I’ll let the desktop and
                  downloads folder get really messy, then spend an hour
                  organizing and deleting things. I’ll let my dock get unwieldy
                  and then organize it all at once. Sometimes I’m a religious
                  one-app-at-a-time person, and other times I open so many
                  windows on my 27-inch screen that I can barely read them all.
                </p>
                <p>
                  But mostly, honestly, I live in the browser. I’ve been using{" "}
                  <u>Arc</u> for years (I use <u>Chrome</u> because our
                  podcast-recording software likes it better, but for nothing
                  else) and perpetually have between three and eight windows
                  full of tabs. It’s bonkers, but it’s the only way I know.
                </p>
                <p>
                  My most important recent upgrade has been going all-in on{" "}
                  <strong>Raycast</strong>. I use it for opening apps, managing
                  windows, changing settings, accessing apps, and much more. It
                  took me a while to really start using it like a power user,
                  and it’s still not the most user-friendly tool out there, but
                  it has made a huge difference in how efficiently I use my
                  computer.
                </p>
              </div>
              <hr style={{ height: "4px", backgroundColor: "#fff" }} />

              <div className="text-white mt-4">
                <h2>Crowdsourced</h2>

                <p>
                  Here’s what the Installer community is into this week. I want
                  to know what you’re into right now, as well! Email
                  installer@theverge.com or message me on Signal —
                  @davidpierce.11 — with your recommendations for anything and
                  everything, and we’ll feature some of our favorites here every
                  week. For more great recommendations, check out this post on
                  Threads and this post on Bluesky. (But I think I’m about done
                  with Threads, so pretty soon it’ll just be Bluesky.)
                </p>

                <p>
                  “You should check out the Feeeed app. Probably the best
                  representation of a timeline app I’ve seen to date.” — Daniel
                </p>

                <p>
                  “Fountain pens. Who knew?! In a world full of Notions — which
                  I use and love — I wanted an analog outlet for my brain dumps
                  and light journaling. That led me to this TWSBI pen and this
                  ink. The pen has a piston mechanism that makes it super easy
                  to suck up ink. Love the feeling of the nib on paper. And
                  don’t get me started on how cool ink bottles can be. Good
                  times.” — Austin
                </p>

                <p>
                  “Moonbound by Robin Sloan. Highly recommend it. It’s like
                  Ursula K. Le Guin writing about Thundarr the barbarian crossed
                  with Narnia.” — Joe
                </p>

                <p>
                  “Working at a computer all day and reading on my phone all
                  evening really strains my eyes. I’ve downloaded the LookAway
                  app for Mac to actually enforce my optician’s advice of
                  resting my eyes, and it’s worth every penny. My eyes feel a
                  lot more comfortable at work now. For my reading, I’ve bought
                  a Boox Palma with the FeedMe app using Feedbin as an RSS
                  service — the verdict is still out on how much it’ll help my
                  eyes, but it’s a really interesting device.” — Tom
                </p>

                <p>
                  “I’ve found CheapCharts, a great app to track when Apple movie
                  prices are discounted. I’ve got myself some real bargains and
                  reduced the low-level stress of switching streaming services
                  off and on.” — Chris
                </p>

                <p>
                  “Five Books, if you want some non-obvious books on a subject
                  for serious reading.” — Astrid
                </p>

                <p>
                  “I started using Bend 26 days ago after it was mentioned in
                  The New York Times. The streak nature has me hooked, and the
                  five-minute wake up routine is a low hurdle with a defined
                  time limit so I know when to get on with my day. Good luck on
                  getting more flexible!” — Sean
                </p>

                <p>
                  “I wanted to put a quick shout out for the series Six Nations:
                  Full Contact on Netflix. Think DTS but for rugby. And for the
                  uninitiated, rugby is often described as the NFL without
                  pads.” — Alex
                </p>

                <p>
                  “To cope with the US’ continued descent into unitary religious
                  authoritarianism, I’m doing what any sane person would and
                  starting the Horus Heresy series of Warhammer 40k books!” —
                  Luis
                </p>

                <p>
                  “I can’t believe y’all haven’t posted anything about Pantheon,
                  the animated series on Netflix! I actually just discovered it
                  myself, but it’s in its third season, and it’s an amazing
                  futuristic techy thriller. Check it out!” — Erik
                </p>

                <hr style={{ height: "4px", backgroundColor: "#fff" }} />
              </div>

              <div className="text-white mt-4">
                <h2>Signing off</h2>

                <p>
                  A weird thing about TikTok is that the algorithm is so diverse
                  and so specific that there aren’t a lot of shared experiences
                  on the platform. That means that when I say the sentence, “I
                  can’t believe how invested I got in the Zach vs. Danny cup
                  game battle,” a few of you are going to get really excited and
                  the vast majority are going to have absolutely no idea what
                  I’m talking about.
                </p>

                <p>
                  The short version: it’s two brothers competing to see who can
                  win a TikTok game, in which you toss a ball into a line of
                  cups the fastest. (This link is a complete and total spoiler
                  of the whole thing.) It’s both incredibly boring and
                  absolutely riveting, and I have checked TikTok for updates
                  every single day for nearly six weeks. And now I’m wondering
                  how many equally awesome things are happening on other corners
                  of the internet. If there’s something online that you’re
                  outrageously, unnecessarily, and embarrassingly invested in, I
                  want to know about it. And good news: Zach and Danny are back
                  at it again. And you’ve barely missed anything.
                </p>

                <p>See you next week!</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Blogs;
