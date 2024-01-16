import React from "react";
import ReactPlayer from "react-player";

export default function SubSection() {
  return (
    <>
      <section className="video-area section-gap-bottom pt-0">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="section-title text-white">
                <h2 className="text-white">
                  Watch Our Trainers <br />
                  in Live Action
                </h2>
                <p>
                  In the realm of language learning, there's probably no greater
                  leap forward than the advent of online English courses.
                  Experience the revolution in language learning with our
                  interactive, real-time classes led by expert tutors.
                </p>
              </div>
            </div>
            <div className="offset-lg-1 col-md-6 video-left pt-5">
              <div className="owl-carousel video-carousel">
                <div className="single-video mt-5">
                  <div className="video-part mt-5">
                    <ReactPlayer
                      url="https://www.youtube.com/watch?v=9tusoKSh0AU&ab_channel=UdemydeoUrl"
                      id="url-path-for-video"
                      controls="true"
                      width="100%"
                    />
                  </div>
                  <h4 className="text-white mb-20 mt-30">
                    Discover the Joy of Learning English Online
                  </h4>
                  <p className="text-white mb-20">
                    In the digital age, learning English online has become not
                    just a trend, but a necessity. With our comprehensive online
                    English courses, you can enjoy the flexibility of learning
                    at your own pace, from the comfort of your home, while
                    benefiting from our tutors' expertise and guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="other-feature-area pt-0">
        <div class="container">
          <div class="feature-inner row">
            <div class="col-lg-12">
              <div class="section-title text-left p-0 mb-4">
                <h2 className="m-0 fw-bold">
                  Features That <br />
                  Can Avail By Everyone
                </h2>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 h-100">
              <div class="other-feature-item">
                <i class="ti-key"></i>
                <h4>Lifetime Access</h4>
                <div>
                  <p>
                    Gain access to a wealth of knowledge that you can tap into
                    at any time, from anywhere. With lifetime access, your
                    learning doesn't stop when the course ends.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 mt--160 h-100">
              <div class="other-feature-item">
                <i class="ti-files"></i>
                <h4>Source File Included</h4>
                <div>
                  <p>
                    All the source files used in the course are included,
                    allowing you to follow along with the lessons and learn at
                    your own pace.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 mt--260">
              <div class="other-feature-item">
                <i class="ti-medall-alt"></i>
                <h4>Student Membership</h4>
                <div>
                  <p>
                    As a student member, you'll join a community of learners,
                    gain access to exclusive content, and enjoy other benefits
                    designed to enhance your learning experience.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 ">
              <div class="other-feature-item">
                <i class="ti-briefcase"></i>
                <h4>2700+ Courses</h4>
                <div>
                  <p>
                    With over 35,000 courses, our platform offers a wealth of
                    knowledge across a wide range of subjects. Whether you're
                    looking to learn a new skill, enhance your current
                    abilities, or explore a new hobby, you're sure to find a
                    course that suits your needs.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 mt--160">
              <div class="other-feature-item">
                <i class="ti-crown"></i>
                <h4>Expert Mentors</h4>
                <div>
                  <p>
                    Our expert mentors guide you through every step of your
                    learning journey, providing personalized feedback and
                    answering your questions to ensure you're on the right
                    track.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 mt--260">
              <div class="other-feature-item">
                <i class="ti-headphone-alt"></i>
                <h4>Live Supports</h4>
                <div>
                  <p>
                    We offer live support to all our students. Whether you're
                    stuck on a problem or need clarification on a concept, our
                    support team is just a click away.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
