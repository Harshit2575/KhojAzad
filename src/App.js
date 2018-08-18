import React, {Component} from 'react';
import './App.css';
import data from './data2';

let md5 = require('md5');

class App extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            progress: [],
            questions: [],
            selectedTeam: 0,
            tempTeam: 1,
            answer: '',
            totalTeams: 300,
        }
    }

    componentDidMount() {
        const saveData = window.localStorage.getItem('progress');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.setState({progress: data.progress, questions: data.questions});
        }
        else {
            let {totalTeams} = this.state;
            const last = data.splice(data.length - 1)[0];
            const rest = data.splice(1);
            const easy = rest.filter(question => question.difficulty === 'easy');
            const hard = rest.filter(question => question.difficulty === 'hard');
            const first = data[0];
            // console.log(first, easy, hard, last);
            this.setState({
                progress: Array.from({length: totalTeams}).map(() => 0),
                questions: Array.from({length: totalTeams}).map(() => [first, ...(this.shuffle(easy)), ...(this.shuffle(hard)), last])
            });
            // console.log(Array.from({length: totalTeams}).map(() => [first, ...(this.shuffle(easy)), ...(this.shuffle(hard)), last]))
        }
    }

    render() {
        const {questions, progress, selectedTeam, tempTeam, answer} = this.state;
        return (
            <div className="App">
                <h1>Team Number</h1>
                <form onSubmit={this.updateTeamIndex}>
                    <input
                        onChange={e => this.setState({tempTeam: e.target.value})}
                        value={tempTeam}
                        type="number"/>
                </form>

                {
                    progress.length && questions.length &&
                    <h1>
                        {
                            progress.length && questions.length && progress[selectedTeam] !== questions[selectedTeam].length - 1
                                ? progress[selectedTeam] + 1+'. '
                                : ''
                        }
                        {
                            questions[selectedTeam][progress[selectedTeam]].question
                        }
                    </h1>
                }
                {
                    progress.length && questions.length && progress[selectedTeam] !== questions[selectedTeam].length - 1
                        ? <form onSubmit={this.submit}>
                            <input
                                type="text"
                                onChange={e => this.setState({answer: e.target.value})}
                                value={answer}/>
                        </form>
                        : null
                }
            </div>
        );
    }

    submit = e => {
        e.preventDefault();
        const {answer, questions, progress, selectedTeam} = this.state;
        if (md5(answer.toLowerCase().split(' ').join('').replace(/[^\w\s]/gi, '')).toLowerCase() === questions[selectedTeam][progress[selectedTeam]].answer.toLowerCase()) {
            progress[selectedTeam] = progress[selectedTeam] + 1;
            this.setState({
                progress,
                answer: ''
            });
        }
        else {
            alert('Wrong answer.')
        }
        const saveData = JSON.stringify({
            progress,
            questions
        });
        window.localStorage.setItem('progress', saveData);
    };

    updateTeamIndex = e => {
        e.preventDefault();
        const {tempTeam, totalTeams} = this.state;
        let teamIndex = tempTeam < 1
            ? 1
            : tempTeam > totalTeams
                ? totalTeams
                : tempTeam;
        this.setState({
            tempTeam: teamIndex,
            selectedTeam: teamIndex - 1
        })
    };

    shuffle = array => {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}

export default App;
