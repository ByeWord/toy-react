import {Component, createElement, render} from "./toy-react";

class Square extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <button className="square" onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

render(<Game/>, document.getElementById("app"));

// class MyComponent extends Component {
//     constructor() {
//         super();
//         this.state = {
//             count: 0
//         }
//     }
//
//     doAdd() {
//         this.setState({
//             count: this.state.count + 1
//         })
//     }
//
//     doDesc() {
//         this.setState({
//             count: this.state.count - 1
//         })
//     }
//
//     render() {
//         const {count} = this.state;
//         return <div id={this.props.id}>
//             <p>{count}</p>
//             <div>
//                 <button onClick={() => this.doAdd()}>+</button>
//                 <button onClick={() => this.doDesc()}>-</button>
//             </div>
//         </div>
//     }
// }
//
// // const a = <div>
// //     <div>apple</div>
// // </div>
// // console.log(a.root)
// // document.body.appendChild(a.root)
// // createElement("div",null,[
// //     createElement("div",null,[
// //         "a",
// //         createElement("div",null,["b"])
// //     ]),
// //     createElement(MyComponent,null,[])
// // ])
// // const a = <MyComponent>
// //     <div>1</div>
// //     <div>2</div>
// // </MyComponent>
//
//
// const c = createElement(
//     MyComponent,
//     {id: "my-component"},
//     createElement("div", null, "1"),
//     createElement("div", null, "2")
// )
// // console.log(c)
// // const b = (<div>123</div>)
// // console.log(b)
// // console.log(b.constructor)
// // console.log(a)
// // console.log(a.constructor)
// // console.log(a.root)
//
// render(c, document.getElementById("app"))
