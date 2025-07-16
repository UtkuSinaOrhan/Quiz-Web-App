import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/questions`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      });
  }, []);

  const handleOptionChange = (qid, idx) => {
    setAnswers({ ...answers, [qid]: idx });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    setResult(data);
  };

  if (loading) return <div style={{textAlign: "center", marginTop: "2rem"}}>Loading...</div>;

  if (result) {
    return (
      <div className="container"> 
      <div style={{backgroundColor: "white", padding: "2rem", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
        <h2>Quiz Results</h2>
        <p>
          You got {result.correct} out of {result.total} correct!
        </p>
        <ul>
          {result.details.map((d) => (
            <li key={d.id} style={{marginBottom: "1rem"}}>
              <strong>{d.question}</strong>
              <br />
              Your answer: {d.your_answer ?? <em>Not answered</em>}
              <br />
              Correct answer: {d.correct_answer}
              <br />
              {d.is_correct ? (
                <span style={{color: "green"}}>Correct</span>
              ) : (
                <span style={{color: "red"}}>Incorrect</span>
              )}
            </li>
          ))}
        </ul>
        <button onClick={() => { setResult(null); setAnswers({}); }}>Try Again</button>
      </div>
      </div>
    );
  }

  return (
    <div className="container">
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "sans-serif",
        background: "#fff",
        justifyContent: "center",
        alignContent: "center"
      }}
    >
      <h2 style={{textAlign: "center"}}>Quiz</h2>
      {questions.map((q) => (
        <div key={q.id} style={{marginBottom: "1.5rem"}}>
          <div style={{fontWeight: "bold", marginBottom: 8}}>{q.question}</div>
          {q.options.map((opt, idx) => (
            <label key={idx} style={{display: "block", marginBottom: 4}}>
              <input
                type="radio"
                name={`q${q.id}`}
                value={idx}
                checked={answers[q.id] === idx}
                onChange={() => handleOptionChange(q.id, idx)}
                style={{marginRight: 8}}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "0.75rem",
          fontSize: "1rem",
          borderRadius: 4,
          border: "none",
          background: "#007bff",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Submit
      </button>
    </form>
    </div>
  );
}

export default App;