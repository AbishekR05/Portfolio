import React from "react";
import "./Quote.css";

export default function Quote() {
  return (
    <section className="quote-section dark-theme">
      <div className="quote-container">
        <blockquote className="movie-quote display">
          "We’ve always defined ourselves by the ability to overcome the impossible."
        </blockquote>
        <cite className="quote-author mono">— INTERSTELLAR, 2014</cite>
      </div>
    </section>
  );
}
