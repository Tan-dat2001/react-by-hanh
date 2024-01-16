import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import Avatar from "react-avatar";

import { useNavigate, useParams } from "react-router-dom";
import { getAllVideos } from "../service/VideoService";
import { findCourse } from "../service/CourseService";
import ReactPlayer from "react-player";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineSmile,
  AiOutlineLike,
  AiFillLike,
} from "react-icons/ai";
import { FiList } from "react-icons/fi";

import { FiLock } from "react-icons/fi";
import "../css/details.css";
import { checkFavorites, addToFavorites } from "../service/FavoriteService";
import { getAppUserInfoFromJwtToken } from "../service/LogInService";
import { addToCart } from "../service/CartService";
import { getAllPurchases } from "../service/PurchaseService";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { findAllCarts } from "../redux/cartAction";
import { getAllComments, saveComment } from "../service/CommentService";
import { saveQuestion, getAllQuestions } from "../service/QuestionService";
import { saveReply } from "../service/AnswerService";
import {
  saveQuestionLike,
  getQuestionLikes,
} from "../service/QuestionLikeService";

import { saveAnswerLike, getAnswerLikes } from "../service/AnswerLikeService";
import ReactStars from "react-rating-stars-component";
import TextareaAutosize from "react-textarea-autosize";

export default function Details() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [course, setCourse] = useState({});
  const [numOfStudent, setNumOfStudent] = useState(null);
  const [isFavorite, setIsFavorite] = useState({});
  const [appUser, setAppUser] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState({});
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [showICons, setShowIcons] = useState(false);
  const [randomColor, setRandomColor] = useState("");
  const [questions, setQuestions] = useState([]);
  const [numOfComments, setNumOfComments] = useState(0);
  const [questionLikes, setQuestionLikes] = useState([]);
  const [answerLikes, setAnswerLikes] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setRandomColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }, []);

  const onClick = (emojiData, event) => {
    console.log(emojiData.emoji);
    setText((currentText) => currentText + emojiData.emoji);
  };

  const firstExample = {
    size: 25,
    activeColor: "#f4ab20",
    edit: false,
  };

  const secondExample = {
    size: 25,
    count: 5,
    color: "black",
    activeColor: "#f4ab20",
    value: 0,
    a11y: true,
    isHalf: false,
    emptyIcon: <i className="fa fa-star m-1" />,
    filledIcon: <i className="fa fa-star m-1" />,
    onChange: (newValue) => {
      document.getElementById("rating-star").value = newValue;
    },
  };

  const extractToken = () => {
    console.log("heheheh");
    const temp = getAppUserInfoFromJwtToken();
    if (temp !== null) {
      console.log("hi");
      console.log(temp.appUser);
      setAppUser(temp.appUser);
    }
  };

  const loadAllVideos = async () => {
    const data = await getAllVideos(id);
    setVideos(data);
    setVideoUrl(data[0].urlPath);
  };

  const loadCourse = async () => {
    const data = await findCourse(id);
    setCourse(data.course);
    setNumOfStudent(data.numOfStudent);
    console.log("course");
    console.log(course);
  };

  const loadFavorite = async (appUserId) => {
    const data = await checkFavorites(appUserId, course.id);
    setIsFavorite(data);
    console.log("favorite");
    console.log(data);
  };

  const loadMyCourses = async () => {
    const data = await getAllPurchases(appUser.id);
    setMyCourses(data);
    console.log(data);
  };

  const loadReviews = async () => {
    // this is the {id} from useParams
    const data = await getAllComments(id);
    setComments(data.comments);
    setRating(data.rating);
  };

  const loadQuestions = async () => {
    // this is the {id} from useParams
    const data = await getAllQuestions(id, sortBy);
    setQuestions(data);
    console.log(data);
    let totalNum = data.length;
    data.map((el) => (totalNum += el.answers.length));
    setNumOfComments(totalNum);
  };

  const loadQuestionLikes = async () => {
    // this is the {id} from useParams
    const data = await getQuestionLikes(appUser.id, id);
    setQuestionLikes(data);
    console.log("question likessss");
    console.log(data);
  };

  const loadAnswerLikes = async () => {
    // this is the {id} from useParams
    const data = await getAnswerLikes(appUser.id, id);
    setAnswerLikes(data);
    console.log("answer likessss");
    console.log(data);
  };

  const handleHeartClick = async () => {
    if (appUser.id) {
      const data = await addToFavorites(appUser.id, course.id);
      setIsUpdated(!isUpdated);
    } else {
      Swal.fire(
        "Please sign in your account to use this function!",
        "",
        "warning"
      );
      navigate("/log-in");
    }
  };

  const handleAddToCart = async () => {
    if (!appUser.id) {
      Swal.fire("Please sign in your account!", "", "warning");
      navigate("/log-in");
    } else {
      const response = await addToCart(appUser.id, course.id);
      dispatch(findAllCarts(appUser.id));
      toast.info("Course added successfully!");
    }
  };

  const handleChangeVideoPath = (urlPath) => {
    setVideoUrl(urlPath);
    setIsUpdated(!isUpdated);
    window.scrollTo(0, 0);
  };

  const handleSubmitReview = async () => {
    if (document.getElementById("rating-star").value == "0") {
      Swal.fire("Please leave your rating before submitting!", "", "warning");
    } else {
      const comment = document.getElementById("feedback").value;
      const rating = document.getElementById("rating-star").value;
      console.log(comment);
      if (!appUser.id) {
        Swal.fire(
          "You need to enroll in this course to leave feedback!",
          "",
          "warning"
        );
      } else {
        try {
          const save = await saveComment(appUser.id, id, comment, rating);
          setIsUpdated(!isUpdated);
          document.getElementById("feedback").value = "";
          Swal.fire("Thank You For Your Feedback! ❤️ ", "", "success");
        } catch (er) {
          console.error(er);
          if (er.response) {
            console.log(er.response.data);
            console.log(er.response.status);
            if (er.response.status === 405) {
              Swal.fire(
                "Sorry! You already left your feedback some time ago!",
                "",
                "info"
              );
              setIsUpdated(!isUpdated);
              document.getElementById("feedback").value = "";
            }
            if (er.response.status === 406) {
              Swal.fire(
                "You need to enroll in this course to leave feedback!",
                "",
                "warning"
              );
              setIsUpdated(!isUpdated);
              document.getElementById("feedback").value = "";
            }
          }
        }
      }
    }
  };

  const handleSubmitComment = async () => {
    if (!appUser.id) {
      Swal.fire("You need to sign in first!", "", "warning");
      navigate("/log-in");
    } else {
      const data = await saveQuestion(appUser.id, id, text);
      setIsUpdated(!isUpdated);
      setText("");
      Swal.fire("Thank You For Your Question! ❤️ ", "", "success");
    }
  };

  const handleSubmitReply = async (questionId) => {
    const text = document.getElementById(`replyText-${questionId}`).value;
    const data = await saveReply(appUser.id, questionId, text);
    setIsUpdated(!isUpdated);
    document.getElementById(`replyText-${questionId}`).value = "";
    document.getElementById(`rep-${questionId}`).style.display = "none";
    Swal.fire("Thank You For Your Reply! ❤️ ", "", "success");
  };

  const handleSubmitMiniReply = async (questionId, answerId) => {
    const text = document.getElementById(`miniReplyText-${answerId}`).value;
    const data = await saveReply(appUser.id, questionId, text);
    setIsUpdated(!isUpdated);
    document.getElementById(`miniReplyText-${answerId}`).value = "";
    document.getElementById(`miniRep-${answerId}`).style.display = "none";
    Swal.fire("Thank You For Your Reply! ❤️ ", "", "success");
  };

  const handleQuestionLike = async (questionId) => {
    if (!appUser.id) {
      Swal.fire("You need to sign in first!", "", "warning");
      navigate("/log-in");
    } else {
      const data = await saveQuestionLike(appUser.id, questionId);
      setIsUpdated(!isUpdated);
    }
  };

  const handleAnswerLike = async (answerId) => {
    if (!appUser.id) {
      Swal.fire("You need to sign in first!", "", "warning");
      navigate("/log-in");
    } else {
      const data = await saveAnswerLike(appUser.id, answerId);
      setIsUpdated(!isUpdated);
    }
  };

  const handleSortByChange = (event) => {
    console.log(event.target.value);
    setSortBy(event.target.value);
    setIsUpdated(!isUpdated);
  };

  useEffect(() => {
    if (appUser.id) {
      loadMyCourses(appUser.id);
    }
  }, [appUser.id]);

  useEffect(() => {
    loadAllVideos();
    loadCourse();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    extractToken();
  }, []);

  useEffect(() => {
    if (appUser.id && course.id) {
      loadFavorite(appUser.id, course.id);
    }
  }, [appUser.id, course.id, isUpdated]);

  useEffect(() => {
    loadReviews();
  }, [isUpdated]);

  useEffect(() => {
    loadQuestions();
  }, [isUpdated]);

  useEffect(() => {
    if (appUser.id) {
      loadQuestionLikes();
    }
  }, [isUpdated, appUser.id]);

  useEffect(() => {
    if (appUser.id) {
      loadAnswerLikes();
    }
  }, [isUpdated, appUser.id]);

  return (
    <>
      <Header />
      <section className="course-details-area section-gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 course-details-left">
              <div className="main-image">
                {videos.length > 0 && (
                  <ReactPlayer
                    url={videoUrl}
                    id="url-path-for-video"
                    controls="true"
                    width="100%"
                  />
                )}
              </div>
              <div className="content-wrapper">
                <h4 className="title">Objectives</h4>
                {course.id && (
                  <>
                    <div className="content">{course.description}</div>
                    <h4 className="title">Description</h4>
                    <div className="content">
                      <p>
                        Learn everything about English grammar, English
                        speaking, and English writing. Use perfect English
                        grammar in real conversations. Get high scores for
                        English grammar exams like A1, A2, B1, B2, C1, TOEFL,
                        IELTS, and TOEIC. Upgrade your speaking, listening, and
                        writing with better English grammar. Accent Training:
                        Build an American or British accent. Master English
                        writing with English punctuation and sentence structure
                        section. Learn to speak about 27 different daily topics.
                        Professional English pronunciation practice activities.
                      </p>
                      <div className=" mb-3">
                        <p className=" fw-bold d-inline">
                          English Grammar Section:
                        </p>
                        Over 90 different English grammar topics. No other
                        course covers as many English Grammar topics. Full video
                        lessons and conversations showing you the English
                        grammar in use. You will learn to score higher on your
                        English exams like TOEIC, IELTS, or TOEFL. Hundred of
                        practice problems and examples. Full-length PDFs for
                        offline learning.
                      </div>
                      <div className=" mb-3">
                        <p className=" fw-bold d-inline">
                          English Speaking Section:
                        </p>{" "}
                        Learn to speak like a native English speaker. Learn how
                        to talk about 27 different topics. Learn hundreds of new
                        English vocabulary, verbs, and phrases. Improve your
                        accent and gain confidence while speaking. Includes
                        American and British audio so you can pick which accent
                        to learn. 75 full-length real conversations with native
                        English speakers allowing you to truly master the
                        English language.
                      </div>
                      <div className=" mb-3">
                        <p className=" fw-bold d-inline">
                          English Writing Section:
                        </p>
                        Learn the grammar behind English sentences and their
                        different structures. Master all 14 English punctuation
                        marks so you can write better and more professionally.
                        Get that new job you want or better grades in school.
                        Hundreds of examples and writing practice problems.
                        Full-length PDFs and video lessons.
                      </div>
                      <div className=" mb-3">
                        <p className=" fw-bold d-inline">
                          English Pronunciation Section:
                        </p>
                        Build the perfect English accent. The accent training
                        section covers all the sounds of the English language.
                        Learn how to make each sound correctly. In addition,
                        train your accent with professional voice actors using
                        state-of-the-art accent training activities. Pick an
                        American or British accent.
                      </div>
                      <div className=" mb-3">
                        <p className=" fw-bold d-inline">
                          After using this course
                        </p>
                        , you will ace tough English grammar tests such as A1,
                        A2, B1, B2, C1, TOEFL, IETLS, AND TOEIC. You will sound
                        more professional at work and may even get that new job
                        or promotion you want. You will impress people with your
                        new advanced English level. Your English grammar,
                        English speaking, and English writing will all improve.
                        You will develop a British or American accent and sound
                        fluent.
                      </div>
                    </div>
                  </>
                )}

                <h4 className="title">Course Outline</h4>
                <div className="content">
                  <ul className="course-list p-0">
                    {videos.length > 0 &&
                      videos.map((el) => {
                        return (
                          <li
                            key={`vid-${el.id}`}
                            className="justify-content-between d-flex"
                          >
                            <div className=" d-flex align-items-center">
                              <span
                                className="fa fa-star m-0 mx-3"
                                style={{ color: "#eab35f" }}
                              />
                              <p className=" fw-bold m-0">{el.title}</p>
                            </div>

                            {myCourses.find(
                              (temp) => temp.purchase.course.id == course.id
                            ) ? (
                              <button
                                className="btn text-uppercase"
                                onClick={() =>
                                  handleChangeVideoPath(el.urlPath)
                                }
                              >
                                View Details
                              </button>
                            ) : (
                              <button
                                className="btn text-uppercase d-flex align-items-center"
                                disabled={el.free == false}
                                onClick={() =>
                                  handleChangeVideoPath(el.urlPath)
                                }
                              >
                                View Details{" "}
                                {el.free == false && (
                                  <FiLock className=" ms-2"></FiLock>
                                )}
                              </button>
                            )}
                          </li>
                        );
                      })}
                  </ul>
                </div>
                {/* comments sec */}
                <hr className=" my-5"></hr>
                <section>
                  <div className=" d-flex align-items-center mb-4">
                    <h3 className=" fw-bold">
                      {numOfComments}{" "}
                      {numOfComments > 1 ? "comments" : "comment"}{" "}
                    </h3>
                    <div
                      className=" d-flex flex-column align-items-start mx-5 px-3 py-2"
                      style={{
                        border: "1px solid #5b85d1",
                        color: "#5b85d1",
                        cursor: "pointer",
                      }}
                    >
                      <div className=" d-flex ">
                        <FiList className="fw-bold"></FiList>
                        <small className=" fw-bold mx-1 ">Sort by</small>
                      </div>
                      <select
                        onChange={(event) => handleSortByChange(event)}
                        name="sortBy"
                        id="sortBy"
                        className=" border-0"
                        style={{ color: "#5b85d1", outline: "none" }}
                      >
                        <option value="newest">Newest first</option>
                        <option value="top">Top comments</option>
                      </select>
                    </div>
                  </div>

                  <div className=" d-flex flex-column align-items-center mb-5">
                    <div className=" d-flex align-items-center w-100">
                      <Avatar
                        name={appUser.id ? appUser.userName : ""}
                        round={true}
                        size="40"
                        className=" me-2"
                        color={randomColor}
                      />

                      <TextareaAutosize
                        style={{
                          width: "100%",
                          border: "none",
                          borderBottom: "1px solid black",
                        }}
                        className=" px-2"
                        onChange={(event) => setText(event.target.value)}
                        value={text}
                        placeholder="Add a comment..."
                      />
                    </div>
                    {text.length > 0 && (
                      <div className=" d-flex  justify-content-between w-100 px-5 ">
                        <div className=" position-relative">
                          <div className=" position-absolute">
                            <AiOutlineSmile
                              style={{ cursor: "pointer" }}
                              size={25}
                              onClick={() => setShowIcons((prev) => !prev)}
                            ></AiOutlineSmile>
                            {showICons && (
                              <EmojiPicker
                                onEmojiClick={onClick}
                                autoFocusSearch={false}
                                emojiStyle={EmojiStyle.NATIVE}
                              />
                            )}
                          </div>
                        </div>

                        <div className="d-flex align-items-start">
                          <button
                            className="btn"
                            onClick={() => {
                              setShowIcons(false);
                              setText("");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-outline-primary back-btn "
                            style={{ borderRadius: "100px" }}
                            onClick={handleSubmitComment}
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {questions.length > 0 &&
                    questions.map((el) => {
                      return (
                        <div
                          key={`question-${el.question.id}`}
                          className=" d-flex  align-items-start mb-4 "
                        >
                          <div>
                            <Avatar
                              name={el.question.appUser.userName}
                              round={true}
                              size="40"
                              className=" me-2"
                              color={randomColor}
                            />
                          </div>
                          <div className=" px-2 d-flex flex-column align-items-start justify-content-start flex-grow-1">
                            <p className="m-0 fw-bold">
                              {el.question.appUser.userName}{" "}
                              <small>{el.question.questionDate}</small>
                            </p>
                            <p className="m-0">{el.question.questionText}</p>
                            <div>
                              {questionLikes.length > 0 &&
                              questionLikes.find(
                                (temp) => temp.question.id == el.question.id
                              ) ? (
                                <AiFillLike
                                  onClick={() =>
                                    handleQuestionLike(el.question.id)
                                  }
                                  style={{ cursor: "pointer" }}
                                ></AiFillLike>
                              ) : (
                                <AiOutlineLike
                                  onClick={() =>
                                    handleQuestionLike(el.question.id)
                                  }
                                  style={{ cursor: "pointer" }}
                                ></AiOutlineLike>
                              )}

                              <small className=" ms-1 fw-bold">
                                {el.likes > 0 && el.likes}
                              </small>
                              <button
                                className="ms-3 btn fw-bold"
                                onClick={() => {
                                  if (appUser.id) {
                                    console.log("heeeeerere");
                                    let element = document.getElementById(
                                      `rep-${el.question.id}`
                                    );
                                    if (element.style.display === "none") {
                                      element.style.display = "block";
                                    } else {
                                      element.style.display = "none";
                                    }
                                  } else {
                                    Swal.fire(
                                      "Please sign in your account!",
                                      "",
                                      "warning"
                                    );
                                    navigate("/log-in");
                                  }
                                }}
                              >
                                Reply
                              </button>
                            </div>

                            <div
                              className="reply-section p-0 m-0 mt-4 w-100"
                              style={{
                                display: "none",
                              }}
                              id={`rep-${el.question.id}`}
                            >
                              <div className=" d-flex flex-column align-items-start w-100">
                                <div className=" d-flex align-items-center w-100">
                                  <Avatar
                                    name={appUser.id ? appUser.userName : ""}
                                    round={true}
                                    size="40"
                                    className=" me-2"
                                    color={randomColor}
                                  />

                                  <div className="d-flex w-100 flex-grow-1">
                                    <TextareaAutosize
                                      id={`replyText-${el.question.id}`}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        borderBottom: "1px solid black",
                                      }}
                                      className=" px-2 w-100 flex-grow-1"
                                      onChange={(event) =>
                                        (document.getElementById(
                                          `replyText-${el.question.id}`
                                        ).value = event.target.value)
                                      }
                                      defaultValue=""
                                      placeholder="Add a reply..."
                                    />
                                  </div>
                                </div>

                                <div className=" d-flex  justify-content-between w-100 px-5 position-relative">
                                  <div>
                                    <AiOutlineSmile
                                      style={{ cursor: "pointer" }}
                                      size={25}
                                      onClick={() => {
                                        console.log("heeeeerere");
                                        let element = document.getElementById(
                                          `icon-${el.question.id}`
                                        );
                                        if (element.style.display === "none") {
                                          element.style.display = "block";
                                        } else {
                                          element.style.display = "none";
                                        }
                                      }}
                                    ></AiOutlineSmile>

                                    <div
                                      id={`icon-${el.question.id}`}
                                      style={{
                                        position: "absolute",
                                        display: "none",
                                        zIndex: "9999",
                                      }}
                                    >
                                      <EmojiPicker
                                        onEmojiClick={(emojiData, event) => {
                                          document.getElementById(
                                            `replyText-${el.question.id}`
                                          ).value += emojiData.emoji;
                                        }}
                                        autoFocusSearch={false}
                                        emojiStyle={EmojiStyle.NATIVE}
                                      />
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-start">
                                    <button
                                      className="btn"
                                      onClick={() => {
                                        setShowIcons(false);
                                        document.getElementById(
                                          `rep-${el.question.id}`
                                        ).style.display = "none";
                                        document.getElementById(
                                          `replyText-${el.question.id}`
                                        ).value = "";
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="btn btn-outline-primary back-btn "
                                      style={{ borderRadius: "100px" }}
                                      onClick={() =>
                                        handleSubmitReply(el.question.id)
                                      }
                                    >
                                      Comment
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* answers section mini */}
                            {el.answers.map((temp) => {
                              return (
                                <>
                                  <div className=" d-flex  align-items-start m-0 mb-1 w-100">
                                    <div>
                                      <Avatar
                                        name={temp.answer.appUser.userName}
                                        round={true}
                                        size="40"
                                        className=" me-2"
                                        color={randomColor}
                                      />
                                    </div>
                                    <div className=" px-2 d-flex flex-column align-items-start justify-content-start flex-grow-1">
                                      <p className="m-0 fw-bold">
                                        {temp.answer.appUser.userName}{" "}
                                        <small>{temp.answer.answerDate}</small>
                                      </p>
                                      <p className="m-0">
                                        {temp.answer.answerText}
                                      </p>
                                      <div>
                                        {answerLikes.length > 0 &&
                                        answerLikes.find(
                                          (temp1) =>
                                            temp1.answer.id == temp.answer.id
                                        ) ? (
                                          <AiFillLike
                                            onClick={() =>
                                              handleAnswerLike(temp.answer.id)
                                            }
                                            style={{
                                              cursor: "pointer",
                                            }}
                                          ></AiFillLike>
                                        ) : (
                                          <AiOutlineLike
                                            onClick={() =>
                                              handleAnswerLike(temp.answer.id)
                                            }
                                            style={{
                                              cursor: "pointer",
                                            }}
                                          ></AiOutlineLike>
                                        )}

                                        <small className=" ms-1 fw-bold">
                                          {temp.likes}
                                        </small>
                                        <button
                                          className="ms-3 btn fw-bold"
                                          onClick={() => {
                                            if (appUser.id) {
                                              console.log("heeeeerere");
                                              let element =
                                                document.getElementById(
                                                  `miniRep-${temp.answer.id}`
                                                );
                                              if (
                                                element.style.display === "none"
                                              ) {
                                                element.style.display = "block";
                                              } else {
                                                element.style.display = "none";
                                              }
                                              if (
                                                temp.answer.appUser.userName !==
                                                appUser.userName
                                              )
                                                document.getElementById(
                                                  `miniReplyText-${temp.answer.id}`
                                                ).defaultValue = `@${temp.answer.appUser.userName} `;
                                            } else {
                                              Swal.fire(
                                                "Please sign in your account!",
                                                "",
                                                "warning"
                                              );
                                              navigate("/log-in");
                                            }
                                          }}
                                        >
                                          Reply
                                        </button>
                                      </div>
                                      <div
                                        className="mini-reply-section p-0 m-0 my-3 w-100"
                                        style={{
                                          display: "none",
                                        }}
                                        id={`miniRep-${temp.answer.id}`}
                                      >
                                        <div className=" d-flex flex-column align-items-start w-100">
                                          <div className=" d-flex align-items-center w-100">
                                            <Avatar
                                              name={
                                                appUser.id
                                                  ? appUser.userName
                                                  : ""
                                              }
                                              round={true}
                                              size="40"
                                              className=" me-2"
                                              color={randomColor}
                                            />

                                            <div className="d-flex w-100 flex-grow-1">
                                              <TextareaAutosize
                                                id={`miniReplyText-${temp.answer.id}`}
                                                style={{
                                                  width: "100%",
                                                  border: "none",
                                                  borderBottom:
                                                    "1px solid black",
                                                }}
                                                className=" px-2 w-100 flex-grow-1"
                                                onChange={(event) =>
                                                  (document.getElementById(
                                                    `miniReplyText-${temp.answer.id}`
                                                  ).value = event.target.value)
                                                }
                                                defaultValue=""
                                                placeholder="Add a reply..."
                                              />
                                            </div>
                                          </div>

                                          <div className=" d-flex  justify-content-between w-100 px-5 position-relative">
                                            <div>
                                              <AiOutlineSmile
                                                style={{ cursor: "pointer" }}
                                                size={25}
                                                onClick={() => {
                                                  console.log("heeeeerere");
                                                  let element =
                                                    document.getElementById(
                                                      `miniIcon-${temp.answer.id}`
                                                    );
                                                  if (
                                                    element.style.display ===
                                                    "none"
                                                  ) {
                                                    element.style.display =
                                                      "block";
                                                  } else {
                                                    element.style.display =
                                                      "none";
                                                  }
                                                }}
                                              ></AiOutlineSmile>

                                              <div
                                                id={`miniIcon-${temp.answer.id}`}
                                                style={{
                                                  position: "absolute",
                                                  display: "none",
                                                  zIndex: "999",
                                                }}
                                              >
                                                <EmojiPicker
                                                  onEmojiClick={(
                                                    emojiData,
                                                    event
                                                  ) => {
                                                    document.getElementById(
                                                      `miniReplyText-${temp.answer.id}`
                                                    ).value += emojiData.emoji;
                                                  }}
                                                  autoFocusSearch={false}
                                                  emojiStyle={EmojiStyle.NATIVE}
                                                />
                                              </div>
                                            </div>
                                            <div className="d-flex align-items-start">
                                              <button
                                                className="btn"
                                                onClick={() => {
                                                  setShowIcons(false);
                                                  document.getElementById(
                                                    `miniRep-${temp.answer.id}`
                                                  ).style.display = "none";
                                                  document.getElementById(
                                                    `miniReplyText-${temp.answer.id}`
                                                  ).value = "";
                                                }}
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                className="btn btn-outline-primary back-btn "
                                                style={{
                                                  borderRadius: "100px",
                                                }}
                                                onClick={() =>
                                                  handleSubmitMiniReply(
                                                    el.question.id,
                                                    temp.answer.id
                                                  )
                                                }
                                              >
                                                Comment
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </section>
              </div>
            </div>
            <div className="col-lg-4 right-contents">
              {videos.length > 0 && course.id && (
                <ul>
                  <li>
                    <a className="justify-content-between d-flex" href="#">
                      <p>Course</p>
                      <span className="or">{course.name}</span>
                    </a>
                  </li>
                  <li>
                    <a className="justify-content-between d-flex" href="#">
                      <p>Instructor’s Name</p>
                      <span className="or">{course.appUser.userName}</span>
                    </a>
                  </li>
                  <li>
                    <a className="justify-content-between d-flex" href="#">
                      <p>Course Fee </p>
                      {myCourses.find(
                        (temp) => temp.purchase.course.id == course.id
                      ) ? (
                        <span>Paid</span>
                      ) : (
                        <span>${course.price}</span>
                      )}
                    </a>
                  </li>
                  <li>
                    <a className="justify-content-between d-flex" href="#">
                      <p>Course Type </p>
                      <span>{course.courseType.name}</span>
                    </a>
                  </li>
                  <li>
                    <a className="justify-content-between d-flex" href="#">
                      <p>Lectures </p>
                      <span>{videos.length}</span>
                    </a>
                  </li>
                  <li>
                    <a className="justify-content-between d-flex" href="#">
                      <p>Number Of Students </p>
                      <span>{numOfStudent}</span>
                    </a>
                  </li>
                </ul>
              )}
              <div className=" d-flex justify-content-between align-items-center mt-5">
                {myCourses.find(
                  (temp) => temp.purchase.course.id == course.id
                ) ? (
                  <button
                    type="button"
                    className="btn text-uppercase mt-0 enroll col col-9"
                  >
                    You have enrolled this course!
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="btn text-uppercase mt-0 enroll col col-10"
                  >
                    Enroll the course
                  </button>
                )}

                <div className="col col-2">
                  {isFavorite.id ? (
                    <AiFillHeart
                      style={{
                        cursor: "pointer",
                        width: "50px",
                        height: "50px",
                        color: "#bb37de",
                        border: "2px solid #8233fe",
                      }}
                      onClick={() => handleHeartClick(course.id)}
                    ></AiFillHeart>
                  ) : (
                    <AiOutlineHeart
                      style={{
                        cursor: "pointer",
                        width: "50px",
                        height: "50px",
                        color: "#bb37de",
                        border: "2px solid #8233fe",
                      }}
                      onClick={() => handleHeartClick(course.id)}
                    ></AiOutlineHeart>
                  )}
                </div>
              </div>

              <p className="m-0 mt-5 fw-bold" style={{ fontSize: "24px" }}>
                Reviews & Ratings
              </p>
              <div className=" d-flex flex-row title m-0 align-items-center gap-2">
                <h6 className="m-0">
                  {rating.numOfRating > 0
                    ? Number.parseFloat(rating.averageRating).toFixed(1)
                    : ""}
                </h6>
                <ReactStars
                  key={rating.averageRating}
                  value={rating.averageRating}
                  {...firstExample}
                />
                <h6 className="m-0">
                  ({rating.numOfRating}{" "}
                  {rating.numOfRating > 1 ? "ratings" : "rating"})
                </h6>
              </div>
              <div className="content">
                <div className="review-top row pt-20">
                  <div className="col-lg-12">
                    <div className="d-flex align-items-center">
                      <h6 className=" m-0 me-3 fw-bold">Your Rating: </h6>
                      <input id="rating-star" value="0" type="hidden"></input>
                      <ReactStars
                        {...secondExample}
                        className="star-gap"
                        style={{ marginRight: "10px" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="feedback mt-0">
                  <h6 className="my-1 mb-2 fw-bold">Your Feedback:</h6>
                  <textarea
                    id="feedback"
                    name="feedback"
                    className="form-control"
                    cols={10}
                    rows={5}
                    defaultValue={""}
                  />
                  <div className="mt-10 text-right">
                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      className="btn text-center text-uppercase enroll"
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div
                  className="comments-area mb-30 "
                  style={{ height: "1000px", overflowY: "scroll" }}
                >
                  {comments.length > 0 &&
                    comments
                      .slice()
                      .reverse()
                      .map((el) => {
                        return (
                          <div
                            className="comment-list m-0 p-0 mb-2"
                            key={`cmt-${el.id}`}
                          >
                            <div className="single-comment single-reviews flex-column d-flex">
                              <div className="d-flex justify-content-between ">
                                <div className=" d-flex m-0 p-0 justify-content-start align-items-center col-7">
                                  <a href="#" className=" me-2 fw-bold">
                                    {el.appUser.userName}
                                  </a>
                                  <ReactStars
                                    key={el.rating}
                                    value={el.rating}
                                    {...firstExample}
                                  />
                                </div>

                                <div className="p-0 d-flex align-items-center justify-content-end col-5">
                                  <p className="text-end m-0">
                                    {el.commentDate}
                                  </p>
                                </div>
                              </div>
                              <div className="w-100">
                                <p className="comment">{el.commentText}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ToastContainer autoClose={2000} className="toast-position" />
    </>
  );
}
