from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory quiz data
QUIZ_QUESTIONS = [
    {
        "id": 1,
        "question": "What is the capital of France?",
        "options": ["Berlin", "London", "Paris", "Rome"],
        "answer": 2  # index of correct answer
    },
    {
        "id": 2,
        "question": "Which planet is known as the Red Planet?",
        "options": ["Earth", "Mars", "Jupiter", "Saturn"],
        "answer": 1
    },
    {
        "id": 3,
        "question": "Who wrote 'To Kill a Mockingbird'?",
        "options": ["Harper Lee", "Mark Twain", "J.K. Rowling", "Jane Austen"],
        "answer": 0
    }
]

class Question(BaseModel):
    id: int
    question: str
    options: List[str]

class AnswerSubmission(BaseModel):
    answers: Dict[int, int]  # {question_id: selected_option_index}

class QuizResult(BaseModel):
    total: int
    correct: int
    details: List[Dict]

@app.get("/questions", response_model=List[Question])
def get_questions():
    return [
        Question(id=q["id"], question=q["question"], options=q["options"]) for q in QUIZ_QUESTIONS
    ]

@app.post("/submit", response_model=QuizResult)
def submit_answers(submission: AnswerSubmission):
    correct = 0
    details = []
    for q in QUIZ_QUESTIONS:
        qid = q["id"]
        user_answer = submission.answers.get(qid, None)
        is_correct = user_answer == q["answer"]
        if is_correct:
            correct += 1
        details.append({
            "id": qid,
            "question": q["question"],
            "correct_answer": q["options"][q["answer"]],
            "your_answer": q["options"][user_answer] if user_answer is not None and 0 <= user_answer < len(q["options"]) else None,
            "is_correct": is_correct
        })
    return QuizResult(total=len(QUIZ_QUESTIONS), correct=correct, details=details)
