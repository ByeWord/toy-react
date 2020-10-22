import {createElement, Component, render} from "./ToyReact";

class MyComponent extends Component {
    render() {
        return <div>
            {this.children}
        </div>
    }
}


const a = <MyComponent>
    <div id={1}>1</div>
    <div id={2}>2</div>
    <div id={3}>3</div>
    <div id={4}>
        <div id={"4-1"}>4</div>
    </div>
</MyComponent>

render(a,document.getElementById("app"))

