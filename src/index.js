import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import categoriesIds from './categoriesIDs';
import getRandomCategory from './Components/categoryRandomizer';
import shuffle from './Components/shuffle';
import LevelFieldset from './Components/levelFieldset';
import he from 'he';

export default function App() {
  const categories = Object.keys(categoriesIds).map((category, idx) => (
        <option key={idx} value = {category}>{category}</option>
    )
 );

 const [getCategory, setGetCategory] = useState('Any');
 const [getDifficulty, setGetDifficulty] = useState('any');
 const [limit, setLimit] = useState(0);
 const amount = Array.from({ length: limit }, (_, index) => index + 1).map((num, idx) => (
   <option key={idx} value = {num}>{num}</option>
 ));

  const [requestInfo, setRequestInfo] = useState({
    id: '',
    level: '',
    amount: 5
  });

  const [questions, setQuestions] = useState([]);
  const [questionsDisplay, setQuestionsDisplay] = useState([]);
  
  const generateQDisplay = () => {
    let display = questions.map((qObj, idx) => {
      const {question, correct_answer, incorrect_answers: incorrects} = qObj;
      let allAns = [...incorrects, correct_answer];
      allAns = shuffle(allAns);
      const answers = allAns.map((ans, ind) => (
        <div key={ans + idx}>
          <input type="radio" id={ans + ind} name = {`q${idx}`} value={ans} />
          <label htmlFor={ans + ind}>{he.decode(ans)}</label><br/>
        </div>
      ))
      return (
        <section key={'q' + idx} className = 'question'>
          <p>Q{idx+1} {he.decode(question)}</p>
          {answers}
          <button onClick = {() => checkAnswer(idx)}>Check Answer</button>
        </section>
      )
    })
    display.push(<section key={'start-over'}>
      <button style={{width : '100%'}} onClick = {() => {
        setQuestions([]);
        setGetCategory('Any');
        setGetDifficulty('any');
        setRequestInfo({...requestInfo, amount: 5});
      }}>Start Over</button>
    </section>)
    setQuestionsDisplay(display);
  }

  const checkAnswer = idx => {
    const selectedAnswer = document.querySelector(`input[name="q${idx}"]:checked`).value;
    const allOpts = document.querySelectorAll(`input[name="q${idx}"]`);
    allOpts.forEach(opt => {
      opt.disabled = true;
    })
    if(questions[idx].correct_answer === selectedAnswer){
      alert(`That's Correct`);
    }
    else{
      alert(`Correct Answer is: ${questions[idx].correct_answer}\n Your answer was: ${he.decode(selectedAnswer)}`);
    }
  }

  const getQuestions = () => {
    const {id, level, amount} = requestInfo;
    fetch(`https://opentdb.com/api.php?amount=${amount}&category=${id}&difficulty=${level}&type=multiple`)
    .then((response) => response.json())
    .then((JSONresponse) => setQuestions(JSONresponse.results))
    .catch(console.log);
  }

  const getMaxQuestions = () => {
    let categoryId = undefined;
    let level = undefined;
    if(getCategory === 'Any'){
      const copyIds = {...categoriesIds};
      delete copyIds.Any;
      categoryId = getRandomCategory(copyIds);
    }
    else{
      categoryId = getCategory;
    }
    if(getDifficulty === 'any'){
      const difficulty = ['easy', 'medium', 'hard'];
      level = difficulty[Math.floor(Math.random() * difficulty.length)];
    }
    else{
      level = getDifficulty;
    }
    fetch(`https://opentdb.com/api_count.php?category=${categoriesIds[categoryId]}`)
    .then((response) => response.json())
    .then((JSONresponse) => {
      const maxQuestions = JSONresponse.category_question_count;
      const lvlKey = `total_${level}_question_count`;
      const max = maxQuestions[lvlKey] > 50 ? 50 : maxQuestions[lvlKey];
      setLimit(max);
    })
    .catch(console.log);
    setRequestInfo({...requestInfo, id: categoriesIds[categoryId], level: level, amount: 5})
  }

  useEffect(() => {
    getMaxQuestions()
  }, [getCategory, getDifficulty])

  useEffect(() => {
    generateQDisplay()
  }, [questions])

  return (
    <>
      <header>
      <h1>Trivia Questions</h1>
      </header>
      <section className="centered">
        <form onSubmit={(e) => {e.preventDefault(); getQuestions();}}>
          <label htmlFor='category'>You can choose an specific category:</label>
          <select id = 'category' value={getCategory} onChange={(e) => setGetCategory(e.target.value)}>
            {categories}
          </select>
          <LevelFieldset getDifficulty = {getDifficulty} setGetDifficulty = {setGetDifficulty}/>
          <label htmlFor='amount'>Amount of Questions: (Limit Varies)</label>
          <select id = 'amount' value={requestInfo.amount} onChange={(e) => setRequestInfo({...requestInfo, amount : e.target.value})}>
            {amount}
          </select><br/>
          <button type="submit">Get Questions</button>
        </form>
      </section>
      <main className="q-centered">
        {questions.length > 0 && questionsDisplay}
      </main>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('container'));
root.render(<App />);