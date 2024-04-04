import React from 'react';

const LevelFieldset = ({getDifficulty, setGetDifficulty}) => {
    return (
        <>
            <fieldset>
                <legend>Difficuty Level:</legend>
                <input type="radio" id="any" checked={getDifficulty === 'any'} onChange={() => setGetDifficulty('any')}/>
                <label htmlFor='any'>Any</label><br/>
                <input type="radio" id="easy" checked={getDifficulty === 'easy'} onChange={() => setGetDifficulty('easy')}/>
                <label htmlFor='easy'>Easy</label><br/>
                <input type="radio" id="medium" checked={getDifficulty === 'medium'} onChange={() => setGetDifficulty('medium')}/>
                <label htmlFor='medium'>Medium</label><br/>
                <input type="radio" id="hard" checked={getDifficulty === 'hard'} onChange={() => setGetDifficulty('hard')}/>
                <label htmlFor='hard'>Hard</label><br/>
            </fieldset>
        </>
    )
}

export default LevelFieldset;